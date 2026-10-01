import axios from 'axios';

async function getPlaylistVideos(playlistId) {
  const url = `https://www.youtube.com/playlist?list=${playlistId}`;
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = res.data;
  const matches = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
  if (!matches) return [];

  const videoIds = [];
  for (const m of matches) {
    const id = m.replace(/"videoId":"|"$/g, '');
    if (!videoIds.includes(id)) {
      videoIds.push(id);
    }
  }
  return videoIds;
}

async function run() {
  const p1Ids = await getPlaylistVideos('PLcvm9IWCmev_8Y6ezzL53H5YwjZolpmeh');
  const p2Ids = await getPlaylistVideos('PLcvm9IWCmev9tcJrdLdBBU61RRNCkZ6b5');

  console.log("P1 All Video IDs:", p1Ids);
  console.log("P2 All Video IDs:", p2Ids);

  const allSelected = [...p1Ids.slice(0, 6), ...p2Ids.slice(0, 6)];
  
  const videoDetails = [];
  for (const id of allSelected) {
    try {
      const res = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      videoDetails.push({
        id,
        title: res.data.title,
        author: res.data.author_name
      });
    } catch (e) {
      videoDetails.push({
        id,
        title: `Highlight ${id}`,
        author: 'Akash Camera Productions'
      });
    }
  }

  console.log("\nFULL VIDEO DETAILS LIST:");
  console.log(JSON.stringify(videoDetails, null, 2));
}

run().catch(console.error);
