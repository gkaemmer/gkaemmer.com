import Engine, { rgba } from "./engine";
import { extendObservable, computed } from "mobx";

const funcs = [
  function (x, y) {
    return Math.sin(y);
  },
  function (x, y) {
    return Math.sin(x);
  },
  function (x, y) {
    return Math.cos(x);
  },
  function (x, y) {
    return Math.cos(y);
  },
];
const funcNames = ["cos(y)", "cos(x)", "sin(x)", "sin(y)"];

// Field
export default class Field {
  constructor(id) {
    this.engine = new Engine(id);
    this.engine.maximize();

    this.engine.update = this.draw.bind(this);
    this.W = this.engine.W;
    this.H = this.engine.H;

    this.scale = 8;
    this.xRange = (this.engine.W / this.engine.H) * this.scale;
    this.yRange = this.scale;
    this.speed = 0.1;
    this.fieldStr = 0.01;
    this.life = 100;
    this.maxSpeed = 0;
    this.N = this.W;

    this.speed = 0.1;

    this.particles = [];

    extendObservable(this, {
      xFunc: 0,
      yFunc: 0,
      xFuncName: computed(() => funcNames[this.xFunc]),
      yFuncName: computed(() => funcNames[this.yFunc]),
    });
    this.change();
  }

  change() {
    this.xFunc = Math.floor(Math.random() * funcs.length);
    this.yFunc = Math.floor(Math.random() * funcs.length);
    if (this.changeTimeout) clearTimeout(this.changeTimeout);
    this.changeTimeout = setTimeout(this.change.bind(this), 5000);
  }

  start() {
    for (let i = 0; i < this.N; i++) {
      this.initParticleAtIndex(i);
    }

    document.body.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    document.body.addEventListener("mousedown", (e) => {
      this.isMouseDown = true;
    });
    document.body.addEventListener("mouseup", (e) => {
      this.isMouseDown = false;
    });
    document.addEventListener("mouseout", (e) => {
      // Thanks to https://stackoverflow.com/questions/923299/how-can-i-detect-when-the-mouse-leaves-the-window
      e = e ? e : window.event;
      const from = e.relatedTarget || e.toElement;
      if (!from || from.nodeName == "HTML") {
        this.mouseX = null;
        this.mouseY = null;
        this.isMouseDown = false;
      }
    });

    this.engine.start();
  }

  drawPixel(x, y) {
    this.engine.ctx.beginPath();
    this.engine.ctx.fillRect(x, y, 1, 1);
  }

  field(x, y, vx, vy) {
    let resX = funcs[this.xFunc](x, y);
    let resY = funcs[this.yFunc](x, y);

    // Influence by mouse -- antigravity, stronger when clicked
    if (this.mouseX) {
      const dx = this.mouseX - this.toSX(x + vx / 2);
      const dy = this.mouseY - this.toSY(y + vy / 2);
      const d2 = dx * dx + dy * dy;
      if (dx * dx + dy * dy < 500 * 500) {
        const gravConstant = this.isMouseDown ? 100000 : 5000;
        const divisor = Math.max(d2 * Math.sqrt(d2), gravConstant);
        resX -= (dx * gravConstant) / divisor;
        resY += (dy * gravConstant) / divisor;
      }
    }
    return [resX * this.fieldStr, resY * this.fieldStr];
  }

  initParticleAtIndex(i) {
    const coords = [
      (Math.random() - 0.5) * this.xRange,
      (Math.random() - 0.5) * this.yRange,
    ];

    if (this.particles[i]) this.particles[i].reset(coords[0], coords[1]);
    else this.particles[i] = new Particle(coords[0], coords[1], this);
    const speed = Math.random() * Math.random() * this.speed;
    const ang = Math.random() * Math.PI;
    this.particles[i].vx = speed * Math.cos(ang);
    this.particles[i].vy = speed * Math.sin(ang);
  }

  toSX(x) {
    return (x / this.scale) * this.H + this.W / 2;
  }

  toSY(y) {
    return this.H - ((y / this.scale) * this.H + this.H / 2);
  }

  draw() {
    const ctx = this.engine.ctx;

    ctx.fillStyle = rgba(255, 255, 255, 0.05);
    ctx.fillRect(0, 0, this.W, this.H);
    for (let i = 0; i < this.N; i++) {
      if (this.particles[i].life < 0) {
        this.initParticleAtIndex(i);
      }
      this.particles[i].update();
      this.particles[i].draw(ctx);
    }
    this.maxSpeed *= 0.99;
  }
}

// Particle
class Particle {
  ax = 0;
  ay = 0;
  vx = 0;
  vy = 0;
  fv = 0;
  speed = 1;

  constructor(x, y, field) {
    this.field = field;
    this.x = x;
    this.y = y;
    this.sx = this.getSX();
    this.sy = this.getSY();
    this.lastX = this.sx;
    this.lastY = this.sy;
    this.life = Math.random() * this.field.life;
  }

  getSX() {
    return this.field.toSX(this.x);
  }

  getSY() {
    return this.field.toSY(this.y);
  }

  reset(x, y) {
    this.vx = 0;
    this.vy = 0;
    this.x = x;
    this.y = y;
    this.sx = this.getSX();
    this.sy = this.getSY();
    this.lastX = this.sx;
    this.lastY = this.sy;
    this.life = Math.random() * this.field.life;
  }

  draw(ctx) {
    ctx.strokeStyle = rgba(150, 150, 150, 0.15);

    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(this.sx, this.sy);
    ctx.stroke();
  }

  update() {
    const [ax, ay] = this.field.field(this.x, this.y, this.vx, this.vy);
    this.ax = this.speed * ax;
    this.ay = this.speed * ay;
    this.vx += this.ax;
    this.vy += this.ay;
    this.fv = ax * ax + ay * ay;
    if (this.fv > this.field.maxSpeed) {
      this.field.maxSpeed = this.fv;
    }
    this.lastX = this.sx;
    this.lastY = this.sy;
    this.x += this.vx;
    this.y += this.vy;
    this.sx = this.getSX();
    this.sy = this.getSY();
    this.vx *= 0.8;
    this.vy *= 0.8;
    this.life--;
  }
}
