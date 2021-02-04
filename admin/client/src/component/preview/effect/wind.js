import React, { useEffect, useRef } from "react";
export const AnimationWind = () => {
  const wrapperRef = useRef();
  useEffect(() => {
    var c = document.createElement("canvas");

    var ctx = c.getContext("2d");
    var w = (c.width = window.innerWidth / 2.1);
    var h = (c.height = window.innerHeight);
    let stop = false
    var draw = function (a, b, t) {
      ctx.lineWidth = 0.8;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);
      ctx.clearRect(0, 0, w, h);
      for (var i = -60; i < 60; i += 1) {
        ctx.strokeStyle = "hsla(277, 95%, 15%, .15)";
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        for (var j = 0; j < w; j += 10) {
          ctx.lineTo(
            10 * Math.sin(i / 10) + j + 0.008 * j * j,
            Math.floor(
              h / 2 +
              (j / 2) * Math.sin(j / 50 - t / 50 - i / 118) +
              i * 0.9 * Math.sin(j / 25 - (i + t) / 65)
            )
          );
        }
        ctx.stroke();
      }
    };
    var t = 0;
    const handleResize = () => {
      c.width = w = window.innerWidth;
      c.height = h = window.innerHeight;
      ctx.fillStyle = "hsla(277, 95%, 55%, 1)";
    };
    var run = function () {
      if (stop === false) {
        window.requestAnimationFrame(run);
        t += 5;
        draw(33, 52 * Math.sin(t / 2400), t);
      }
    };
    window.addEventListener("resize", handleResize, false);
    if (wrapperRef.current) {
      run();
      wrapperRef.current.append(c);
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.innerHTML = "";
      }
      stop = true
      window.removeEventListener("resize", handleResize, false);
    };
  });
  return <div ref={wrapperRef}></div>;
};
