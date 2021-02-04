
var c = document.createElement("canvas");
c.setAttribute("id", "canvasOmg");
document.body.append(c)
document.body.style.backgroundColor = "black"
var canvas = c.getContext("2d");
var w = (c.width = window.innerWidth),
  h = (c.height = window.innerHeight);
let stop = false;
Snowy();
function Snowy() {
  if (stop === false) {
    var snow,
      arr = [];
    var num = 600,
      tsc = 1,
      sp = 1;
    var sc = 1.3,
      t = 0,
      mv = 20,
      min = 1;
    for (var i = 0; i < num; ++i) {
      snow = new Flake();
      snow.y = Math.random() * (h + 50);
      snow.x = Math.random() * w;
      snow.t = Math.random() * (Math.PI * 2);
      snow.sz = (100 / (10 + Math.random() * 100)) * sc;
      snow.sp = Math.pow(snow.sz * 0.8, 2) * 0.15 * sp;
      snow.sp = snow.sp < min ? min : snow.sp;
      arr.push(snow);
    }
  }
  go();
  function go() {
    if (stop === false) {
      window.requestAnimationFrame(go);
      canvas.clearRect(0, 0, w, h);
      canvas.fillStyle = "hsla(242, 95%, 3%, 1)";
      canvas.fillRect(0, 0, w, h);
      canvas.clearRect(0, 0, w, h);
      canvas.fill();
      for (var i = 0; i < arr.length; ++i) {
        var f = arr[i];
        f.t += 0.05;
        f.t = f.t >= Math.PI * 2 ? 0 : f.t;
        f.y += f.sp;
        f.x += Math.sin(f.t * tsc) * (f.sz * 0.3);
        if (f.y > h + 50) f.y = -10 - Math.random() * mv;
        if (f.x > w + mv) f.x = -mv;
        if (f.x < -mv) f.x = w + mv;
        f.draw();
      }
    }
  }
  function Flake() {
    this.draw = function () {
      this.g = canvas.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.sz
      );
      this.g.addColorStop(0, "hsla(255,255%,255%,1)");
      this.g.addColorStop(1, "hsla(255,255%,255%,0)");
      canvas.moveTo(this.x, this.y);
      canvas.fillStyle = this.g;
      canvas.beginPath();
      canvas.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
      canvas.fill();
    };
  }
}
const handleResize = () => {
  c.width = w = window.innerWidth;
  c.height = h = window.innerHeight;
};
window.addEventListener("resize", handleResize, false);

const timeStop = localStorage.getItem("timeEndEffect")
if (timeStop !== "undefined") {
  if (typeof timeStop !== undefined) {
    setTimeout(() => {
      stop = true;
      window.removeEventListener("resize", handleResize, false);
    }, timeStop * 1000)
  }
}

