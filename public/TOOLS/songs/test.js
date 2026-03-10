const fs = require('fs');
const MINIGAME_YOUTUBE_API_KEY = 'AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g';
const encodeURIComponent = escape;
async function test() {
  const searchQuery = "Ngoi Sao Le Loi Phan Dinh Tung official audio";
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=8&q=${searchQuery.replace(/ /g, '%20')}&key=${MINIGAME_YOUTUBE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}
test();
