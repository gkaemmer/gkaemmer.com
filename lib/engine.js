export default class Engine {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.W = this.canvas.width;
    this.H = this.canvas.height;
  }

  doUpdate = () => {
    if (!this.update) throw new Error("update() must be implemented");
    this.update();
    window.requestAnimationFrame(this.doUpdate);
  };

  doDraw = timestamp => {
    if (!this.draw) return;
    this.draw();
    window.requestAnimationFrame(this.doDraw);
  };

  start() {
    this.doUpdate();
    this.doDraw();
  }

  maximize() {
    var e = window,
      a = "inner";
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }
    this.W = e[a + "Width"];
    this.H = e[a + "Height"];
    this.canvas.width = this.W;
    this.canvas.height = this.H;
  }
}

// HELPER FUNCTIONS:

export function rgb(r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")";
}

export function rgba(r, g, b, a) {
  if (a > 1) a = 1;
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
