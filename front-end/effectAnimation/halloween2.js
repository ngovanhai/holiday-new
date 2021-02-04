
var c = document.createElement("canvas");
document.body.append(c)
c.setAttribute("id", "canvasOmg");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;
ctx.fillStyle = "rgba(255, 255, 255, 0)";
ctx.fillRect(0, 0, 0, 0);
var rnd = function (min, max) {
  return Math.random() * (max - min) + min;
};

function Base(b) {
  this.sp = 0.025;
  this.act = Math.random() * 1000 + 500;
  if (b) {
    this.rad = b.rad * rnd(0.55, 0.65) + Math.random() * b.rad * 0.65;
    this.x = b.x + Math.cos(b.rot) * (b.rad + this.rad);
    this.y = b.y + Math.sin(b.rot) * (b.rad + this.rad);
    this.rot = b.rot + Math.PI;
    this.acl = !b.acl;
    this.sp = b.sp + 0.01;

    if (this.rot > Math.PI * 2) this.rot -= Math.PI * 2;
  } else {
    this.rad = Math.random() * 20 + 50;
    this.x = (Math.random() * c.width) / 2;
    this.y = (Math.random() * c.height) / 2;
    this.rot = Math.random() * Math.PI * 2;
    this.acl = Math.random() > 0.5;
  }

  if (this.rad < 5) {
    this.t = -1;
    return;
  }

  var obj = this;

  this.draw = function (prot) {
    ctx.strokeStyle = "hsla(1,0%,5%,0.5)";
    ctx.lineWidth = obj.rad / 200;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.rad, prot, obj.rot, obj.acl);
    ctx.stroke();
  };

  var t = function () {
    window.requestAnimationFrame(t);
    obj.act -= 50;
    if (obj.act < 0) {
      window.cancelAnimationFrame(t);
      if (arr.length < 10) {
        var num = Math.floor(Math.random() * 3 + 1);
        for (var i = 0; i < num; i++) {
          arr.push(new Base(obj));
        }
      }
      for (var i in arr) {
        if (arr[i] == obj) arr.splice(i, 1);
      }
      return;
    }

    var prot = obj.rot;
    obj.rot += obj.sp * (obj.acl ? -1 : 1);
    if (obj.rot < 0) obj.rot += Math.PI * 2;
    else if (obj.rot > Math.PI * 2) obj.rot -= Math.PI * 2;

    obj.draw(prot);
  }.bind(this);
  t();
}

var arr = [];
for (var i = 0; i < Math.random() * 4 + 1; i++) {
  var a = new Base();
  a.y = c.height + 1;
  a.rot = Math.random() * 0.4 - 0.2 + (a.acl ? 0 : Math.PI);
  arr.push(a);
}

ctx.shadowColor = "hsla(0,0%,5%,.2)";
ctx.shadowBlur = 5;
ctx.shadowOffsetX = 3;
ctx.shadowOffsetY = 3;
ctx.fillStyle = "hsla(0,0%,15%,1)";
ctx.beginPath();
ctx.moveTo(0, c.height);
var botX = 0,
  botY;
while (botX < c.width) {
  botY = Math.random() * 50;
  botX += Math.random() * 0 + 10;
  ctx.lineTo(botX, c.height - botY);
}
ctx.lineTo(c.width, c.height);
ctx.closePath();
ctx.fill();
const handleResize = () => {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
};
window.addEventListener("resize", handleResize, false);

