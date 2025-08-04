#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import requests
import re
from typing import Dict, Any, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

def is_metadata_line(text: str) -> bool:
    """
    判断是否为歌词元数据行（如贡献者、作词作曲等信息）
    """
    if not text or not text.strip():
        return True
    
    text = text.strip()
    
    # 检查是否是贡献者信息行
    if re.match(r'^(作词|作曲|编曲|制作人|监制|混音|母带|录音|演唱|歌手|艺人)[:：]', text):
        return True
    
    # 检查是否是纯中文人名（2-4个字符，没有其他内容）
    if re.match(r'^[\u4e00-\u9fa5]{2,4}$', text):
        return True
    
    # 检查是否是空行或只有符号
    if re.match(r'^[\s\-\—\.\*\+\=\|\[\]（）(){}]*$', text):
        return True
    
    # 过滤"翻译"和"歌词"
    if text in {'翻译', '歌词'}:
        return True
    
    # 过滤"贡献者"相关行
    if re.search(r'(歌词|滚动歌词|翻译)?贡献者', text):
        return True
    
    return False

def fetch_soda_lyrics(url: str) -> Dict[str, Any]:
    """
    从soda音乐分享链接获取歌词和歌曲信息
    
    Args:
        url: soda音乐分享链接
        
    Returns:
        包含歌词和歌曲信息的字典
    """
    try:
        # 请求分享链接，自动跟随跳转
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, allow_redirects=True, headers=headers, timeout=30)
        response.raise_for_status()
        
        # 提取HTML中_ROUTER_DATA的JSON字符串
        router_data_match = re.search(r'_ROUTER_DATA\s*=\s*({.*?});', response.text, re.DOTALL)
        if not router_data_match:
            return {"success": False, "error": "未找到_ROUTER_DATA"}
        
        router_data = json.loads(router_data_match.group(1))
        
        # 提取歌曲信息
        track_data = router_data.get("loaderData", {}).get("track_page", {})
        audio_data = track_data.get("audioWithLyricsOption", {})
        
        if not audio_data:
            return {"success": False, "error": "未找到音频数据"}
        
        # 提取歌曲基本信息
        song_info = {
            "track_id": audio_data.get("track_id"),
            "track_name": audio_data.get("trackName"),
            "artist_name": audio_data.get("artistName"),
            "duration": audio_data.get("duration"),
            "artist_id": audio_data.get("artistIdStr"),
            "song_maker_team": audio_data.get("songMakerTeamSentences", []),
            "audio_url": audio_data.get("url")
        }
        
        # 提取专辑信息
        track_info = audio_data.get("trackInfo", {})
        if track_info:
            album_info = track_info.get("album", {})
            if album_info:
                song_info["album"] = {
                    "id": album_info.get("id"),
                    "name": album_info.get("name"),
                    "release_date": album_info.get("release_date"),
                    "cover_url": album_info.get("url_cover", {}).get("uri")
                }
            
            # 提取艺术家信息
            artists = track_info.get("artists", [])
            if artists:
                song_info["artists"] = []
                for artist in artists:
                    song_info["artists"].append({
                        "id": artist.get("id"),
                        "name": artist.get("name"),
                        "avatar_url": artist.get("url_avatar", {}).get("uri"),
                        "display_name": artist.get("simple_display_name")
                    })
            
            # 提取统计信息
            stats = track_info.get("stats", {})
            if stats:
                song_info["stats"] = {
                    "collected_count": stats.get("count_collected"),
                    "comment_count": stats.get("count_comment"),
                    "shared_count": stats.get("count_shared")
                }
        
        # 提取歌词信息
        lyrics_data = audio_data.get("lyrics", {})
        lyrics_text = ""
        lyrics_with_timing = []
        
        if lyrics_data and "sentences" in lyrics_data:
            lyrics_sentences = lyrics_data["sentences"]
            if isinstance(lyrics_sentences, list):
                # 将歌词拼接成文本，并过滤元数据
                lyrics_lines = []
                for line in lyrics_sentences:
                    text = line.get("text", "").strip()
                    # 检查是否有startMs和endMs字段，如果没有则使用startTime和endTime
                    start_time = line.get("startMs", line.get("startTime", 0)) / 1000  # 转换为秒
                    end_time = line.get("endMs", line.get("endTime", 0)) / 1000  # 转换为秒
                    
                    # 提取字符级别的时间戳
                    words = line.get("words", [])
                    char_timing = []
                    
                    if words and isinstance(words, list):
                        for word in words:
                            word_text = word.get("text", "")
                            word_start = word.get("startMs", word.get("startTime", 0)) / 1000
                            word_end = word.get("endMs", word.get("endTime", 0)) / 1000
                            
                            if word_text:
                                char_timing.append({
                                    "text": word_text,
                                    "startTime": word_start,
                                    "endTime": word_end
                                })
                    
                    if text and not is_metadata_line(text):
                        lyrics_lines.append(text)
                        lyrics_with_timing.append({
                            "text": text,
                            "startTime": start_time,
                            "endTime": end_time,
                            "char_timing": char_timing
                        })
                
                lyrics_text = '\n'.join(lyrics_lines)
        
        # 构建结果
        result = {
            "success": True,
            "lyrics": lyrics_text,
            "lyrics_with_timing": lyrics_with_timing,
            "song_info": song_info,
            "source": "soda音乐"
        }
        
        return result
        
    except requests.RequestException as e:
        return {"success": False, "error": f"网络请求失败: {str(e)}"}
    except json.JSONDecodeError as e:
        return {"success": False, "error": f"JSON解析失败: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"未知错误: {str(e)}"}

@app.route('/api/parse-soda-link', methods=['POST'])
def parse_soda_link():
    """解析汽水音乐链接的API端点"""
    try:
        data = request.get_json()
        url = data.get('url')
        platform = data.get('platform')
        
        if not url:
            return jsonify({"success": False, "error": "请提供链接"})
        
        if platform != 'qishui':
            return jsonify({"success": False, "error": "不支持的平台"})
        
        # 检查URL格式
        if 'qishui.douyin.com' not in url:
            return jsonify({"success": False, "error": "无效的汽水音乐分享链接"})
        
        # 获取歌词
        result = fetch_soda_lyrics(url)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"success": False, "error": f"服务器错误: {str(e)}"})

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({"status": "ok", "message": "服务正常运行"})

if __name__ == '__main__':
    # 检查是否作为独立程序运行
    if len(sys.argv) > 1 and sys.argv[1] == '--standalone':
        print("启动汽水音乐链接解析服务...")
        print("服务地址: http://localhost:5000")
        print("API端点: POST /api/parse-soda-link")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        # 作为子进程运行，不显示调试信息
        app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False) 