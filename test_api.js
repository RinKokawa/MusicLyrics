#!/usr/bin/env node

import fetch from 'node-fetch';

async function testAPI() {
  console.log('🧪 测试 API 连接...\n');
  
  try {
    // 测试健康检查端点
    console.log('1. 测试健康检查端点...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ 健康检查结果:', healthData);
    
    // 测试汽水音乐链接解析端点
    console.log('\n2. 测试汽水音乐链接解析端点...');
    const testResponse = await fetch('http://localhost:5000/api/parse-soda-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://qishui.douyin.com/s/imQw1YUw/',
        platform: 'qishui'
      })
    });
    
    const testData = await testResponse.json();
    console.log('✅ API测试结果:', testData.success ? '成功' : '失败');
    if (!testData.success) {
      console.log('❌ 错误信息:', testData.error);
    } else {
      console.log('📝 歌曲信息:', testData.song_info?.track_name || '未知');
      console.log('🎵 歌词长度:', testData.lyrics?.length || 0, '字符');
    }
    
  } catch (error) {
    console.error('❌ API测试失败:', error.message);
  }
}

// 等待服务器启动
setTimeout(testAPI, 2000); 