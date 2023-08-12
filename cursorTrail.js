const Config = {
  particleChangePercent: 40,
  maxParticles: 100,
  particleSize: 60,
  particleSpeed: 10,
  particleMaxSpeed: 10,
  particleLife: 100,
  gravity: 0.05,
  particleColor: 'random', // #000000 or random
  particleShape: 'random', // circle, square, triangle, star, pfp, random
};

const sb = window.streamerbot;

const canvas = document.createElement('canvas');
canvas.id = 'cursor-trail';
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

sb.subscribeTo({
  general: ['Custom'],
});

class Vector {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
  }

  div(n) {
    this.x /= n;
    this.y /= n;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const m = this.mag();
    if (m != 0) {
      this.div(m);
    }
  }

  limit(max) {
    if (this.mag() > max) {
      this.normalize();
      this.mult(max);
    }
  }
}

class Color {
  r = 0;
  g = 0;
  b = 0;
  a = 0;

  hex(c) {
    this.r = parseInt(c.slice(1, 3), 16);
    this.g = parseInt(c.slice(3, 5), 16);
    this.b = parseInt(c.slice(5, 7), 16);
    this.a = 1;
  }

  rgb(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 1;
  }

  rgba(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  constructor(r, g, b, a) {
    if (typeof r === 'string') {
      this.hex(r);
    } else if (typeof a === 'number') {
      this.rgba(r, g, b, a);
    } else {
      this.rgb(r, g, b);
    }
  }
}

class Shape {
  particle;
  constructor(particle) {
    this.particle = particle;
  }
  render() {}
}

class Circle extends Shape {
  render() {
    ctx.beginPath();
    ctx.arc(this.particle.x, this.particle.y, this.particle.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Square extends Shape {
  render() {
    ctx.fillRect(
      this.particle.x - this.particle.size,
      this.particle.y - this.particle.size,
      this.particle.size * 2,
      this.particle.size * 2
    );
  }
}

class Triangle extends Shape {
  render() {
    ctx.beginPath();
    ctx.moveTo(this.particle.x, this.particle.y - this.particle.size);
    ctx.lineTo(this.particle.x + this.particle.size, this.particle.y + this.particle.size);
    ctx.lineTo(this.particle.x - this.particle.size, this.particle.y + this.particle.size);
    ctx.fill();
  }
}

class Star extends Shape {
  // Credit: markE on StackOverFlow - https://stackoverflow.com/questions/25837158/drawing-a-star-by-using-canvas-html5
  render() {
    var rot = (Math.PI / 2) * 3;
    var x = this.particle.x;
    var y = this.particle.y;
    var step = Math.PI / 5;
    var outerRadius = this.particle.size;
    var innerRadius = this.particle.size / 3;

    ctx.beginPath();
    ctx.moveTo(this.particle.x, this.particle.y - outerRadius);
    for (let i = 0; i < 5; i++) {
      x = this.particle.x + Math.cos(rot) * outerRadius;
      y = this.particle.y + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = this.particle.x + Math.cos(rot) * innerRadius;
      y = this.particle.y + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(this.particle.x, this.particle.y - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

const Gravity = new Vector(0, Config.gravity);

class Particle {
  x = 0;
  y = 0;
  size = 0;
  rotation = 0;
  direction;
  color;
  opacity = 1;
  shape;
  constructor(x, y, size, rotation, direction, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = rotation;
    this.direction = direction;
    this.color = color;
  }

  setShape(shape) {
    this.shape = shape;
  }

  isAlive() {
    return this.opacity > 0;
  }

  update() {
    this.direction.add(Gravity);
    this.direction.limit(Config.particleMaxSpeed);
    this.x += this.direction.x;
    this.y += this.direction.y;
  }

  render() {
    this.update();
    this.opacity -= 1 / Config.particleLife;
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
    this.shape.render();
  }
}

class Trail {
  particles = [];
  constructor() {
    this.particles = [];
  }

  add(particle) {
    this.particles.push(particle);
  }

  render() {
    this.particles = this.particles.filter((particle) => particle.isAlive());
    this.particles.forEach((particle) => {
      particle.render();
    });
  }
}

const trail = new Trail();

let active = false;
let user = new Image();
let mouse = {
  x: 0,
  y: 0,
};

class ProfilePicture extends Shape {
  render() {
    ctx.drawImage(
      user,
      this.particle.x - this.particle.size,
      this.particle.y - this.particle.size,
      this.particle.size * 2,
      this.particle.size * 2
    );
  }
}

async function getPfpImage(user) {
  const res = await fetch(`https://decapi.me/twitch/avatar/${user}`);
  const text = await res.text();
  const img = new Image();
  img.src = text;
  return img;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!active) return;
  trail.render();
  if (
    Math.random() < Config.particleChangePercent / 100 &&
    trail.particles.length < Config.maxParticles
  ) {
    let color = new Color(
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255)
    );
    if (Config.particleColor !== 'random') color = new Color(Config.particleColor);
    const particle = new Particle(
      mouse.x,
      mouse.y,
      Math.random() * Config.particleSize,
      0,
      new Vector(
        (Math.random() * Config.particleSpeed) / Config.particleMaxSpeed -
          Config.particleSpeed / Config.particleMaxSpeed / 2,
        (Math.random() * Config.particleSpeed) / Config.particleMaxSpeed -
          Config.particleSpeed / Config.particleMaxSpeed / 2
      ),
      color
    );
    setShape(particle);
    trail.add(particle);
  }
  requestAnimationFrame(render);
}

function setShape(particle) {
  const shapes = [Circle, Square, Triangle, Star, ProfilePicture];
  let shape = shapes[Math.floor(Math.random() * shapes.length)];
  switch (Config.particleShape) {
    case 'circle':
      shape = Circle;
      break;
    case 'square':
      shape = Square;
      break;
    case 'triangle':
      shape = Triangle;
      break;
    case 'star':
      shape = Star;
      break;
    case 'pfp':
      shape = ProfilePicture;
      break;
  }
  particle.setShape(new shape(particle));
}

sb.onMessage(async (msg) => {
  if (!msg.event) return;
  if (msg.event.type !== 'Custom') return;
  if (!msg.data) return;
  if (msg.data.type !== 'CursorTrail') return;

  const data = msg.data;

  if (data.status === 'start') {
    mouse.x = data.x;
    mouse.y = data.y;
    user = await getPfpImage(data.user);
    if (!active) {
      active = true;
      requestAnimationFrame(render);
    }
  } else if (data.status === 'move') {
    mouse.x = data.x;
    mouse.y = data.y;
  } else if (data.status === 'end') {
    active = false;
  }
});
