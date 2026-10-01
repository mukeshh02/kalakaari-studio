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
  console.log("Fetching Playlist 1 (PLcvm9IWCmev_8Y6ezzL53H5YwjZolpmeh)...");
  const p1 = await getPlaylistVideos('PLcvm9IWCmev_8Y6ezzL53H5YwjZolpmeh');
  console.log("Playlist 1 Video IDs:", p1.slice(0, 5));

  console.log("Fetching Playlist 2 (PLcvm9IWCmev9tcJrdLdBBU61RRNCkZ6b5)...");
  const p2 = await getPlaylistVideos('PLcvm9IWCmev9tcJrdLdBBU61RRNCkZ6b5');
  console.log("Playlist 2 Video IDs:", p2.slice(0, 5));
}

run().catch(console.error);
