import axios from 'axios';

async function test() {
  const res = await axios.get('https://www.tastyedits.com/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Upgrade-Insecure-Requests': '1'
    }
  });
  console.log("Status:", res.status);
  console.log("Headers:", res.headers);
  console.log("Body:", res.data);
}

test().catch(err => {
  if (err.response) {
    console.log("Err Status:", err.response.status);
    console.log("Err Data:", err.response.data);
  } else {
    console.log("Err:", err.message);
  }
});
