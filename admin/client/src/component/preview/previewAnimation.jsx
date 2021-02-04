import React from "react";
import { AnimationBallon2 } from "./effect/ball2";
import { AnimationFirework } from "./effect/firework";
import { AnimationFirework2 } from "./effect/firework2";
import { AnimationHalloween } from "./effect/halloween";
import { AnimationHalloween2 } from "./effect/halloween2";
import { AnimationValentine } from "./effect/valentine";
import { AnimationRain2 } from "./effect/rain2";
import { AnimationRain } from "./effect/rain";
import { AnimationSnow } from "./effect/snow2";
import { AnimationStar } from "./effect/star";
import { AnimationStar2 } from "./effect/star2";
import { AnimationWind } from "./effect/wind";

function PreviewAnimation(props) {
  const { selectEffect } = props;
  return (
    <div >
      {selectEffect === "ballon" ?
        <AnimationBallon2 /> : selectEffect === "new_year" ?
          <AnimationFirework /> : selectEffect === "new_year_2" ?
            <AnimationFirework2 /> : selectEffect === "halloween" ?
              <AnimationHalloween /> : selectEffect === "halloween2" ?
                <AnimationHalloween2 /> : selectEffect === "valentine" ?
                  <AnimationValentine /> : selectEffect === "rain" ?
                    <AnimationRain /> : selectEffect === "rain2" ?
                      <AnimationRain2 /> : selectEffect === "snow" ?
                        <AnimationSnow /> : selectEffect === "star" ?
                          <AnimationStar /> : selectEffect === "star2" ?
                            <AnimationStar2 /> : selectEffect === "wind" ?
                              <AnimationWind /> : null
      }
    </div>
  );
}

export default PreviewAnimation;
