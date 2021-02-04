import { rootlink } from "config";
import React, { useEffect, useRef } from "react";

export const AnimationHalloween = () => {
  const wrapperRef = useRef();
  useEffect(() => {
    var c = document.createElement("canvas");
    var $ = c.getContext("2d");
    var w = (c.width = window.innerWidth / 2.1);
    var h = (c.height = window.innerHeight);
    let stop = false;
    var _w = w / 2;
    var _h = h / 2;

    var arr = [];
    var _arr = [];

    var grav = 1;
    var prevX = 0;
    var drg = 0.99;

    var Pos = function (x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;

      this.rx = 0;
      this.rz = 0;
      this.cY = 0;
      this.sY = 0;

      this.rotY = function (a) {
        this.rx = this.x;
        this.rz = this.z;

        this.cY = Math.cos(a);
        this.sY = Math.sin(a);

        this.x = this.rx * this.cY + this.rz * this.sY;
        this.z = this.rx * -this.sY + this.rz * this.cY;
      };
      this.res = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      };
      this.calc = function (p) {
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
      };
      this.mcalc = function (q) {
        this.x *= q;
        this.y *= q;
        this.z *= q;
      };
    };

    var Part = function () {
      this.pos = new Pos(0, 0, 0);
      this.vel = new Pos(0, 0, 0);
      this.ready = true;

      this.res = function () {
        this.pos.res(0, 50, 0);
        this.vel.res(
          Math.random() * 30 - 10,
          Math.random() * -40,
          Math.random() * 30 - 10
        );
        this.ready = true;
      };
      this.res();
      this.upd = function () {
        if (this.ready) {
          this.pos.calc(this.vel);
          this.vel.mcalc(drg);
          this.vel.y += grav;
        }
      };
    };

    var set = function () {
      var pov = 200;
      var num = 100;
      var msX = 0;
      var msY = -100;
      var msdn = false;
      var img = new Image();
      img.src = `${rootlink}holiday-effects/admin/client/src/asset/image/pump2.png`;
      var img2 = new Image();
      img2.src = `${rootlink}holiday-effects/admin/client/src/asset/image/pump1.png`;

      var draw = function (_p) {
        var x_ = _p.pos.x;
        var y_ = _p.pos.y;
        var z_ = _p.pos.z;
        var sc = pov / (pov + z_);
        var _x = x_ * sc + _w;
        var _y = y_ * sc + _h;

        sc *= 8;
        $.globalAlpha = 0.85;
        if (sc > 0 && sc < 3) {
          $.drawImage(img, _x - sc, _y - sc, sc * 10, sc * 10);
        } else {
          $.drawImage(img2, _x - sc, _y - sc, sc * 10, sc * 10);
        }
      };
      var disp = function () {
        if (stop === false) {
          var _p;
          if (!msdn) {
            for (var i = 0; i < 1; i++) {
              if (_arr.length == 0) {
                _p = new Part();
                arr.push(_p);
              } else {
                _p = _arr.shift();
                _p.res();
              }
            }
          }

          $.fillStyle = "white";
          $.fillRect(0, 0, w, h);

          arr.sort(Zang);
          for (i in arr) {
            _p = arr[i];

            if (!msdn) {
              _p.upd();
              if (_p.ready && _p.pos.y > 50) {
                _p.ready = false;
                _arr.push(_p);
              }
            } else {
              _p.pos.rotY((prevX - msX) * 0.01);
              _p.vel.rotY((prevX - msX) * 0.01);
            }

            if (_p.ready) draw(_p);
          }
          prevX = msX;
        }
      };
      var Zang = function (a, b) {
        return b.pos.z - a.pos.z;
      };
      var run = function () {
        if (stop === false) {
          window.requestAnimationFrame(run);
          disp();
        }
      };
      if (wrapperRef.current) {
        if (wrapperRef.current.childNodes.length < 1) {
          run();
          wrapperRef.current.append(c);
        }
      }
    };
    set();
    return () => {
      stop = true
    }
  }, [wrapperRef.current]);
  return <div ref={wrapperRef}></div>;
};
