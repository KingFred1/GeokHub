// test-api.js
import fetch from 'node-fetch';

async function test() {
  const endpoints = [
    'https://www.geokhub.com/api/indexnow?checkKey=true',
    'https://www.geokhub.com/api/indexnow',
    'https://www.geokhub.com/beb4ccd0e4654b1489f99a669e7e7324.txt',
    'https://api.indexnow.org/indexnow'
  ];

  for (const endpoint of endpoints) {
    console.log(`\n🔍 Testing: ${endpoint}`);
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        timeout: 10000
      });
      console.log(`   Status: ${response.status} ${response.statusText}`);
      if (response.ok) {
        const text = await response.text();
        console.log(`   Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

test();