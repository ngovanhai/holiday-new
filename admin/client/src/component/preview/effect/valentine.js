import React, { useEffect, useRef } from "react";

export const AnimationValentine = () => {
  const wrapperRef = useRef();

  useEffect(() => {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    let stop = false
    var num = 700,
      s = 0.0075,
      sp = 0.033,
      rot = 0.2,
      u = 0;

    var draw = function (ctx) {
      var i,
        j,
        p,
        g,
        k = 1 + 1 / num,
        t = new Date() / 1000,
        r = new mtx()
          .rotY(-t * 0.123)
          .rotX(0.8)
          .rotZ(rot);

      for (i = 0; i < num; i++) {
        j = t * sp + i * k;
        p = new Pt();
        p.x = rnd(j);
        p.y = j % 1;
        p.z = rnd(j + 10000);
        p.x -= 0.5;
        p.y -= 0.5;
        p.z -= 0.5;
        p.y *= 5;
        p = p.rot(r);
        p.x += Math.sin(t * 0.15 + i) * 0.3;
        p.z += 0.5;

        if (p.z <= 0) continue;

        ctx.save();
        ctx.globalAlpha *= 1 / (p.z + 0.6);
        ctx.translate(p.x / p.z, p.y / p.z);
        ctx.scale(s / p.z, s / p.z);
        ctx.rotate(rot);

        g = ctx.createRadialGradient(0, -0.4, 0, 0, -0.4, 4);
        g.addColorStop(0, "hsla(" + i * u + ",100%,50%,1)");
        g.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, 1.8);
        ctx.quadraticCurveTo(2, 0, 2, -1);
        ctx.quadraticCurveTo(2, -2, 1, -2);
        ctx.quadraticCurveTo(0, -2, 0, -1);
        ctx.quadraticCurveTo(0, -2, -1, -2);
        ctx.quadraticCurveTo(-2, -2, -2, -1);
        ctx.quadraticCurveTo(-2, 0, 0, 1.8);
        ctx.fill();
        ctx.restore();
      }
    };

    var mtx = function () { };
    mtx.prototype = {
      0: 1,
      1: 0,
      2: 0,
      3: 0,
      4: 1,
      5: 0,
      6: 0,
      7: 0,
      8: 1,

      md: function () {
        var a = this,
          b = arguments,
          mx = new mtx();

        mx[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
        mx[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
        mx[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
        mx[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
        mx[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
        mx[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
        mx[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
        mx[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
        mx[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

        return mx;
      },

      rotX: function (t) {
        var mx = Math.cos(t),
          s = Math.sin(t);
        return this.md(1, 0, 0, 0, mx, -s, 0, s, mx);
      },

      rotY: function (t) {
        var mx = Math.cos(t),
          s = Math.sin(t);
        return this.md(mx, 0, s, 0, 1, 0, -s, 0, mx);
      },

      rotZ: function (t) {
        var mx = Math.cos(t),
          s = Math.sin(t);
        return this.md(mx, -s, 0, s, mx, 0, 0, 0, 1);
      },
    };

    var Pt = function () { };

    Pt.prototype = {
      x: 0,
      y: 0,
      z: 0,

      rot: function (m) {
        var p = new Pt();

        p.x = m[0] * this.x + m[1] * this.y + m[2] * this.z;
        p.y = m[3] * this.x + m[4] * this.y + m[5] * this.z;
        p.z = m[6] * this.x + m[7] * this.y + m[8] * this.z;

        return p;
      },
    };

    var rnd = function (n) {
      for (var i = 0; i < 6; i++) {
        n ^= n << 3;
        n ^= n >> 2;
      }
      return (n & 0xffffff) / 0x1000000;
    };
    var _u = 0;
    var anime = function () {
      var g1 = ctx.createLinearGradient(-1, -2, 1, 2);
      var sc = Math.max(c.width, c.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save();
      ctx.translate(c.width * 0.5, c.height * 0.5);
      ctx.scale(sc, sc);
      draw(ctx);
      ctx.restore();
      _u -= 0.2;
      var t = "".split("").join(String.fromCharCode(0x2004));
      ctx.font = "Italic 2.5em Alegreya Sans";
      ctx.fillStyle = "hsla(" + _u + ",90%,50%,.5)";
      ctx.textBaseline = "middle";
      ctx.fillText(
        t,
        (c.width - ctx.measureText(t).width) * 0.5,
        c.height * 0.5
      );
    };

    window.addEventListener(
      "resize",
      (function resize() {
        c.width = window.innerWidth / 2.1;
        c.height = window.innerHeight;
        anime();
        return resize;
      })(),
      false
    );

    function run() {
      if (stop === false) {
        u -= 0.005;
        window.requestAnimationFrame(run);
        anime();
      }
    }
    if (wrapperRef.current) {
      if (wrapperRef.current.childNodes.length < 1) {
        run();
        wrapperRef.current.append(c);
      }
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.innerHTML = "";
      }
      stop = true;
      window.removeEventListener(
        "resize",
        (function resize() {
          c.width = window.innerWidth;
          c.height = window.innerHeight;
          anime();
          return resize;
        })(),
        false
      );
    };

  }, [wrapperRef.current]);
  return <div ref={wrapperRef}></div>;
};
