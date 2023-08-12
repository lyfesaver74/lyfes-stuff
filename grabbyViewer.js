const sb = window.streamerbot;

const images = [
  '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',
];

const canvas = document.createElement('canvas');
canvas.id = 'grabby-viewers';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

function base64ToImage(base64) {
  const img = new Image();
  img.src = 'data:image/png;base64,' + base64;
  return img;
}

async function getPfpImage(user) {
  const res = await fetch(`https://decapi.me/twitch/avatar/${user}`);
  const text = await res.text();
  const img = new Image();
  img.src = text;
  return img;
}

sb.subscribeTo({
  general: ['Custom'],
});

let started = false;

let frame = 0;

let followTime = 0;
let grabTime = 0;
let takeTime = 0;

let hand = {
  x: 0,
  y: 0,
  goToX: 0,
  goToY: 0,
  tmpX: 0,
  tmpY: 0,
  grabFrame: 0,
};

let pfpImage;

sb.onMessage(async (msg) => {
  if (!msg.event) return;
  if (msg.event.type !== 'Custom') return;
  if (!msg.data) return;
  if (msg.data.type !== 'GrabbyViewers') return;

  const data = msg.data;

  console.log(data);

  if (data.status === 'start') {
    pfpImage = await getPfpImage(data.user);
  } else if (data.status === 'follow') {
    if (!started) {
      started = true;
      followTime = data.time;
      render();
    }
    folow(data.x, data.y);
  } else if (data.status === 'grab') {
    hand.goToX = data.x;
    hand.goToY = data.y;
    grabTime = data.time;
  } else if (data.status === 'take') {
    takeTime = data.time;
    hand.x = data.startX;
    hand.y = data.startY;
    hand.tmpX = data.startX;
    hand.tmpY = data.startY;
    hand.goToX = data.endX;
    hand.goToY = data.endY;
    frame = 0;
  } else if (data.status === 'end') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grabTime = 0;
    takeTime = 0;
    hand.x = 0;
    hand.y = 0;
    hand.goToX = 0;
    hand.goToY = 0;
    hand.tmpX = 0;
    hand.tmpY = 0;
    hand.grabFrame = 0;
    followTime = 0;
    frame = 0;
    frameRate = 0;
    started = false;
    pfpImage = null;
  }
});

// Rendering

const imageXOffset = -50;
const imageYOffset = -50;

const pfpXOffset = 20;
const pfpYOffset = -50;

function renderHand(x, y, f) {
  const img = base64ToImage(images[f]);
  ctx.beginPath();
  ctx.drawImage(img, x + imageXOffset, y + imageYOffset, 100, 100);
  ctx.closePath();
}

function folow(x, y) {
  hand.goToX = x;
  hand.goToY = y;
}

function steal() {}

let lastFrame = 0;
let frameRate = 0;

function render() {
  if (!started) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw hand
  if (hand.goToX !== hand.x && takeTime === 0) {
    hand.x += (hand.goToX - hand.x) * 0.1;
  }

  if (hand.goToY !== hand.y && takeTime === 0) {
    hand.y += (hand.goToY - hand.y) * 0.1;
  }

  if (grabTime != 0 && hand.grabFrame < images.length - 1 && frame % 4 === 0) {
    hand.grabFrame++;
  }

  takeBreak: if (takeTime != 0) {
    if (frameRate === 0) {
      const timeSinceLastFrame = Date.now() - lastFrame;
      frameRate = 1000 / timeSinceLastFrame;
    }
    const totalFrames = (takeTime * 5.55) / frameRate;
    const diffX = hand.goToX - hand.tmpX;
    const diffY = hand.goToY - hand.tmpY;
    if (distance(hand.x, hand.y, hand.goToX, hand.goToY) < 5) break takeBreak;
    hand.x = hand.tmpX + (diffX / totalFrames) * frame;
    hand.y = hand.tmpY + (diffY / totalFrames) * frame;
    console.log(hand.tmpX, hand.tmpY, hand.x, hand.y, frame, takeTime, frameRate, totalFrames);
  }

  if (pfpImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(hand.x + pfpXOffset + 50, hand.y + pfpYOffset + 50, 50, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(pfpImage, hand.x + pfpXOffset, hand.y + pfpYOffset, 100, 100);
    ctx.restore();
  }

  renderHand(hand.x, hand.y, hand.grabFrame);

  lastFrame = Date.now();
  frame++;
  requestAnimationFrame(render);
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
