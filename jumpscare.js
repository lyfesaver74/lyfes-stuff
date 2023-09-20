// Get config from import params
const url = new URL(import.meta.url);
const config = {
  rewardTitle: url.searchParams.get('rewardTitle'),
  imageUrl: url.searchParams.get('imageUrl'),
  seconds: Number(url.searchParams.get('seconds')) || 5 // default to 5 seconds
}

// Streamer.bot WebSocket Client configuration
import "https://cdn.skypack.dev/@streamerbot/client";
const client = new StreamerbotClient({
  host: window.config.host || '127.0.0.1',
  port: window.config.port || 8080,
  endpoint: window.config.endpoint || '/',
});
client.on('Twitch.RewardRedemption', (message) => {
  if ((message.data.reward.title || message.data.title) === config.rewardTitle) {
    showImage();
  }
});

function showImage() {
  // Create our image element
  const imgElement = document.createElement("img");

  // Modify the image element src to point at the configured image URL
  imgElement.src = config.imageUrl;

  // Add inline CSS to make the image fullscreen
  imgElement.style.width = "100%";
  imgElement.style.height = "100%";
  imgElement.style.objectFit = "cover"; // To maintain aspect ratio and cover the entire viewport
  
  // Set a timeout to remove the image after the configured amount of time
  setTimeout(() => {
    imgElement.remove();
  }, config.seconds * 1000)

  // Append the image element to the HTML document
  document.body.appendChild(imgElement);

  // Set the body and html elements to 100% height to ensure the image takes up the entire viewport
  document.body.style.height = "100%";
  document.documentElement.style.height = "100%";  
}