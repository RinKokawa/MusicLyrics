#!/usr/bin/env node

import fetch from 'node-fetch';

/**
 * 判断是否为歌词元数据行（如贡献者、作词作曲等信息）
 */
function isMetadataLine(text) {
  if (!text || !text.trim()) {
    return true;
  }
  
  text = text.trim();
  
  // 检查是否是贡献者信息行
  if (/^(作词|作曲|编曲|制作人|监制|混音|母带|录音|演唱|歌手|艺人)[:：]/.test(text)) {
    return true;
  }
  
  // 检查是否是纯中文人名（2-4个字符，没有其他内容）
  if (/^[\u4e00-\u9fa5]{2,4}$/.test(text)) {
    return true;
  }
  
  // 检查是否是空行或只有符号
  if (/^[\s\-\—\.\*\+\=\|\[\]（）(){}]*$/.test(text)) {
    return true;
  }
  
  // 过滤"翻译"和"歌词"
  if (text === '翻译' || text === '歌词') {
    return true;
  }
  
  // 过滤"贡献者"相关行
  if (/(歌词|滚动歌词|翻译)?贡献者/.test(text)) {
    return true;
  }
  
  return false;
}

/**
 * 从soda音乐分享链接获取歌词和歌曲信息
 */
async function fetchSodaLyrics(url) {
  try {
    // 请求分享链接，自动跟随跳转
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    const response = await fetch(url, {
      headers,
      redirect: 'follow'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // 提取HTML中_ROUTER_DATA的JSON字符串
    const routerDataMatch = html.match(/_ROUTER_DATA\s*=\s*({.*?});/s);
    if (!routerDataMatch) {
      return { success: false, error: "未找到_ROUTER_DATA" };
    }
    
    const routerData = JSON.parse(routerDataMatch[1]);
    
    // 提取歌曲信息
    const trackData = routerData.loaderData?.track_page || {};
    const audioData = trackData.audioWithLyricsOption || {};
    
    if (!audioData) {
      return { success: false, error: "未找到音频数据" };
    }
    
    // 提取歌曲基本信息
    const songInfo = {
      track_id: audioData.track_id,
      track_name: audioData.trackName,
      artist_name: audioData.artistName,
      duration: audioData.duration,
      artist_id: audioData.artistIdStr,
      song_maker_team: audioData.songMakerTeamSentences || [],
      audio_url: audioData.url
    };
    
    // 提取专辑信息
    const trackInfo = audioData.trackInfo || {};
    if (trackInfo.album) {
      const albumInfo = trackInfo.album;
      songInfo.album = {
        id: albumInfo.id,
        name: albumInfo.name,
        release_date: albumInfo.release_date,
        cover_url: albumInfo.url_cover?.uri
      };
    }
    
    // 提取艺术家信息
    const artists = trackInfo.artists || [];
    if (artists.length > 0) {
      songInfo.artists = artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        avatar_url: artist.url_avatar?.uri,
        display_name: artist.simple_display_name
      }));
    }
    
    // 提取统计信息
    const stats = trackInfo.stats || {};
    if (stats) {
      songInfo.stats = {
        collected_count: stats.count_collected,
        comment_count: stats.count_comment,
        shared_count: stats.count_shared
      };
    }
    
    // 提取歌词信息
    const lyricsData = audioData.lyrics || {};
    let lyricsText = "";
    const lyricsWithTiming = [];
    
    if (lyricsData.sentences && Array.isArray(lyricsData.sentences)) {
      const lyricsLines = [];
      
      for (const line of lyricsData.sentences) {
        const text = (line.text || "").trim();
        // 检查是否有startMs和endMs字段，如果没有则使用startTime和endTime
        const startTime = (line.startMs || line.startTime || 0) / 1000; // 转换为秒
        const endTime = (line.endMs || line.endTime || 0) / 1000; // 转换为秒
        
        // 提取字符级别的时间戳
        const words = line.words || [];
        const charTiming = [];
        
        if (Array.isArray(words)) {
          for (const word of words) {
            const wordText = word.text || "";
            const wordStart = (word.startMs || word.startTime || 0) / 1000;
            const wordEnd = (word.endMs || word.endTime || 0) / 1000;
            
            if (wordText) {
              charTiming.push({
                text: wordText,
                startTime: wordStart,
                endTime: wordEnd
              });
            }
          }
        }
        
        if (text && !isMetadataLine(text)) {
          lyricsLines.push(text);
          lyricsWithTiming.push({
            text,
            startTime,
            endTime,
            char_timing: charTiming
          });
        }
      }
      
      lyricsText = lyricsLines.join('\n');
    }
    
    // 构建结果
    const result = {
      success: true,
      lyrics: lyricsText,
      lyrics_with_timing: lyricsWithTiming,
      song_info: songInfo,
      source: "soda音乐"
    };
    
    return result;
    
  } catch (error) {
    return { success: false, error: `解析失败: ${error.message}` };
  }
}

/**
 * 从文本中提取汽水音乐链接
 */
function extractSodaLink(text) {
  if (!text) {
    return null;
  }
  
  // 正则表达式匹配汽水音乐链接
  const linkPattern = /https?:\/\/qishui\.douyin\.com\/s\/[a-zA-Z0-9]+\/?/g;
  const matches = text.match(linkPattern);
  
  if (matches && matches.length > 0) {
    return matches[0]; // 返回第一个匹配的链接
  }
  
  return null;
}

/**
 * 主函数 - 解析汽水音乐链接
 */
async function parseSodaLink(input) {
  if (!input) {
    return { success: false, error: "请提供链接或包含链接的文本" };
  }
  
  // 尝试从输入文本中提取链接
  let url = extractSodaLink(input);
  
  if (!url) {
    // 如果没有提取到链接，检查输入本身是否是链接
    if (input.includes('qishui.douyin.com')) {
      url = input.trim();
    } else {
      return { success: false, error: "未找到有效的汽水音乐分享链接" };
    }
  }
  
  return await fetchSodaLyrics(url);
}

// 主程序
async function main() {
  const input = process.argv.slice(2).join(' '); // 支持多个参数拼接
  
  if (!input) {
    console.log('🎵 MusicLyrics - 汽水音乐歌词解析工具');
    console.log('');
    console.log('使用方法:');
    console.log('  node simple-parser.js <汽水音乐链接或包含链接的文本>');
    console.log('');
    console.log('示例:');
    console.log('  node simple-parser.js https://qishui.douyin.com/s/imQw1YUw/');
    console.log('  node simple-parser.js "《あっちゅうま》@汽水音乐 https://qishui.douyin.com/s/imbBdEKt/"');
    console.log('');
    process.exit(1);
  }
  
  console.log('🎵 正在解析汽水音乐链接...');
  console.log(`📝 输入内容: ${input}`);
  
  // 尝试提取链接
  const extractedUrl = extractSodaLink(input);
  if (extractedUrl) {
    console.log(`🔗 提取到链接: ${extractedUrl}`);
  }
  console.log('');
  
  const result = await parseSodaLink(input);
  
  if (result.success) {
    console.log('✅ 解析成功！');
    console.log('');
    console.log('📋 歌曲信息:');
    console.log(`   歌曲名: ${result.song_info.track_name}`);
    console.log(`   艺术家: ${result.song_info.artist_name}`);
    console.log(`   时长: ${Math.floor(result.song_info.duration / 60)}:${String(result.song_info.duration % 60).padStart(2, '0')}`);
    console.log('');
    console.log('🎵 歌词内容:');
    console.log('─'.repeat(50));
    console.log(result.lyrics);
    console.log('─'.repeat(50));
    console.log('');
    console.log(`📊 共 ${result.lyrics.split('\n').length} 行歌词`);
  } else {
    console.log('❌ 解析失败！');
    console.log(`错误信息: ${result.error}`);
    process.exit(1);
  }
}

// 运行主程序
main().catch(error => {
  console.error('❌ 程序执行失败:', error.message);
  process.exit(1);
});
