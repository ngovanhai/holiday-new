import React, { useEffect, useRef } from "react";
export const AnimationRain = () => {
  const wrapperRef = useRef();
  useEffect(() => {
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    var w = (c.width = window.innerWidth / 2.1);
    var h = (c.height = window.innerHeight);
    var clearColor = "rgba(0, 0, 0, .1)";
    var max = 30;
    var drops = [];
    let stop = false;
    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function O() { }

    O.prototype = {
      init: function () {
        this.x = random(0, w);
        this.y = 0;
        this.color = "hsl(180, 100%, 50%)";
        this.w = 2;
        this.h = 1;
        this.vy = random(4, 5);
        this.vw = 3;
        this.vh = 1;
        this.size = 2;
        this.hit = random(h * 0.8, h * 0.9);
        this.a = 1;
        this.va = 0.96;
      },
      draw: function () {
        if (this.y > this.hit) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.h / 2);

          ctx.bezierCurveTo(
            this.x + this.w / 2,
            this.y - this.h / 2,
            this.x + this.w / 2,
            this.y + this.h / 2,
            this.x,
            this.y + this.h / 2
          );

          ctx.bezierCurveTo(
            this.x - this.w / 2,
            this.y + this.h / 2,
            this.x - this.w / 2,
            this.y - this.h / 2,
            this.x,
            this.y - this.h / 2
          );

          ctx.strokeStyle = "hsla(180, 100%, 50%, " + this.a + ")";
          ctx.stroke();
          ctx.closePath();
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.size, this.size * 5);
        }
        this.update();
      },
      update: function () {
        if (this.y < this.hit) {
          this.y += this.vy;
        } else {
          if (this.a > 0.03) {
            this.w += this.vw;
            this.h += this.vh;
            if (this.w > 100) {
              this.a *= this.va;
              this.vw *= 0.98;
              this.vh *= 0.98;
            }
          } else {
            this.init();
          }
        }
      },
    };

    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }

    function setup() {
      if (stop === false) {
        for (var i = 0; i < max; i++) {
          (function (j) {
            setTimeout(function () {
              var o = new O();
              o.init();
              drops.push(o);
            }, j * 200);
          })(i);
        }
      }
    }
    function anim() {
      if (stop === false) {
        ctx.fillStyle = "#3d474754";
        ctx.fillRect(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        for (var i in drops) {
          drops[i].draw();
        }
        requestAnimationFrame(anim);
      }
    }
    window.addEventListener("resize", resize);
    if (wrapperRef.current) {
      if (wrapperRef.current.childNodes.length < 2) {
        setup();
        anim();
        wrapperRef.current.append(c);
      }
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.innerHTML = "";
      }
      window.removeEventListener("resize", resize);
      stop = true;
    };
  }, [wrapperRef.current]);
  return <div ref={wrapperRef}></div>;
};
