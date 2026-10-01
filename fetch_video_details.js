import axios from 'axios';

const videoIds = [
  '5I0uO5CRDqU',
  'GtryHGmrr6I',
  '6WzFW9ZD71w',
  'AQOCRrJ_rAo',
  '-KwF59qW_oU',
  'mqjFRM0GYww'
];

async function fetchDetails() {
  const list = [];
  for (const id of videoIds) {
    try {
      const res = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      list.push({
        id,
        title: res.data.title,
        author: res.data.author_name,
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
      });
    } catch (e) {
      list.push({
        id,
        title: `Video ${id}`,
        author: 'Kalakaari Studios',
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      });
    }
  }
  console.log("Extracted 6 Videos:");
  console.log(JSON.stringify(list, null, 2));
}

fetchDetails();
