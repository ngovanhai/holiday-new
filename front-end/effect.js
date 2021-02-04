// var ot_omgholiday_shopName = Shopify.shop;
let ot_omgholiday_events;
let ot_omgholiday_FramePrev = "";
let __st = { p: "product" };
var ot_omgholiday_shopName = "ngo-van-hai.myshopify.com";
// var rootlinkHoliday = "https://hai.omegatheme.com/holiday-app2";
var rootlinkHoliday = "https://localhost/holiday-effects";
function param(name) {
  return (location.search.split(name + "=")[1] || "").split("&")[0];
}
const paramPreview = param("preview");
const paramPreviewSample = param("previewSample");
const date = new Date();
const version = date.getTime();
const dateStr =
  ("00" + (date.getMonth() + 1)).slice(-2) +
  "/" +
  ("00" + date.getDate()).slice(-2) +
  "/" +
  date.getFullYear() +
  " " +
  ("00" + date.getHours()).slice(-2) +
  ":" +
  ("00" + date.getMinutes()).slice(-2) +
  ":" +
  ("00" + date.getSeconds()).slice(-2);

const nowDate = new Date(dateStr);
if (typeof $ == "undefined") {
  javascript: (function (e, s) {
    e.src = s;
    e.onload = function () {
      $ = jQuery.noConflict();
      ot_omgholiday_init();
    };
    document.head.appendChild(e);
  })(
    document.createElement("script"),
    "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
  );
} else {
  ot_omgholiday_init();
}

async function ot_omgholiday_init() {
  var result = await ot_omgholiday_getHolidayEvents();
  const expired = await checkExpired();
  const settings = await ot_omgholiday_getSettings();
  if (settings[0].autoPublish === "1") {
    ot_omgholiday_autopublish(settings[0].autoPublish, result);
  }
  if (settings[0].turn_onoff === "0") {
    if (+expired !== 1) {
      if (paramPreview) {
        const eventPreview = result.filter(
          (event) => event.id === paramPreview
        );
        ot_omgholiday_loadFile(eventPreview);
        return;
      }
      if (paramPreviewSample) {
        const result = await ot_omgholiday_getHolidayEventsSample();
        const eventPreview = result.filter(
          (event) => event.idSample === paramPreviewSample
        );
        ot_omgholiday_loadFile(eventPreview);
        return;
      }
      if (result != null) {
        ot_omgholiday_loadFile(result);
      }
    }
  } else {
  }
}
const test = () => {
  ot_omgholiday_init();
};
// -----------------Fetch Settings-------------------
function ot_omgholiday_getHolidayEvents() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${rootlinkHoliday}/admin/server/product.php`,
      type: "GET",
      data: {
        shop: ot_omgholiday_shopName,
        action: "getEvents",
      },
      dataType: "json",
    }).done((result) => {
      resolve(result);
    });
  });
}

function ot_omgholiday_getHolidayEventsSample() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${rootlinkHoliday}/admin/server/product.php`,
      type: "GET",
      data: {
        shop: ot_omgholiday_shopName,
        action: "getEventsSample",
      },
      dataType: "json",
    }).done((result) => {
      resolve(result);
    });
  });
}
function ot_omgholiday_getSettings() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${rootlinkHoliday}/admin/server/product.php`,
      type: "GET",
      data: {
        shop: ot_omgholiday_shopName,
        action: "getSettings",
      },
      dataType: "json",
    }).done((result) => {
      resolve(result);
    });
  });
}
function ot_omgholiday_active(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${rootlinkHoliday}/admin/server/product.php`,
      type: "GET",
      data: {
        shop: ot_omgholiday_shopName,
        id: id,
        active: 1,
        action: "active",
      },
      dataType: "text",
    }).done((result) => {
      resolve(result);
    });
  });
}

// ----------------End Fetch Settings-----------------

function checkExpired() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${rootlinkHoliday}/admin/server/product.php`,
      type: "GET",
      data: {
        shop: "ngo-van-hai.myshopify.com",
        action: "check_expired",
      },
      dataType: "json",
    }).done((result) => {
      resolve(result);
    });
  });
}
async function ot_omgholiday_autopublish(publish, result) {
  if (publish === "1") {
    const eventPublish = result.filter((event) => event.publish === "1");
    if (eventPublish.length === 0) {
      let newEvent = [...result];
      newEvent = newEvent.filter(
        (event) =>
          new Date(event.end_date).valueOf() >= new Date(nowDate).valueOf() ||
          event.end_date === "0000-00-00 00:00:00"
      );
      newEvent = newEvent.sort((a, b) =>
        a.start_date.localeCompare(b.start_date)
      );
      const a = await ot_omgholiday_active(newEvent[0].id);
      ot_omgholiday_init();
    }
  }
}
// -------------------------- Load file -------------------------
function ot_omgholiday_loadFile(result) {
  // <link rel='stylesheet' type='text/css' href='//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' />
  // <link href='${rootlinkHoliday}/front-end/css/style.css?v=12243a3asd23'  rel="stylesheet" />
  $("head").append(`
  <link rel='stylesheet' type='text/css' href='https://hai.omegatheme.com/holiday-effects/admin/client/src/asset/css/font-awesome.min.css' />
  <link href='${rootlinkHoliday}/front-end/css/style.css?v=12243a3asd23'  rel="stylesheet" />
          `);
  ot_omgholiday_getJsonFile(result);
}
// ------------------------ End load file -----------------------
function ot_omgholiday_getJsonFile(events) {
  paramPreview || paramPreviewSample
    ? (ot_holiday_events = events)
    : (ot_holiday_events = events.filter(
      (event) =>
        +event.publish === 1 &&
        new Date(event.start_date).valueOf() <= new Date(nowDate).valueOf() &&
        (new Date(event.end_date).valueOf() >= new Date(nowDate).valueOf() ||
          event.end_date === "0000-00-00 00:00:00")
    ));
  if (ot_holiday_events.length > 0) {
    $("body").append(`
                <div class="otHolidayEffects">
                    
                </div>
            `);
    $("body").prepend(`
            <div id="holidayTopFrames" class="holidayTopFrames holidayTopFramesUpload"></div>
            <div id="holidayBottomFrames" class="holidayBottomFrames holidayBottomFramesUpload" ></div>

          `);
    let CssFrame;
    !paramPreview && !paramPreviewSample
      ? (CssFrame = ot_omgholiady_renderframe(
        ot_holiday_events[0].only_home,
        ot_holiday_events[0].other_page
      ))
      : (CssFrame = "");
    paramPreview || paramPreviewSample
      ? null
      : $("head").append(`
        <style>
            ${CssFrame}
        </style>
    `);
    let CssCanvas;
    !paramPreview && !paramPreviewSample
      ? (CssCanvas = ot_omgholiady_renderCanvas(
        ot_holiday_events[0].only_home,
        ot_holiday_events[0].other_page
      ))
      : (CssCanvas = "");
    paramPreview || paramPreviewSample
      ? null
      : $("head").append(`
        <style>
            ${CssCanvas}
        </style>
    `);

    for (var i = 0; i < ot_holiday_events.length; i++) {
      ot_omgholiday_renderEvent(i, ot_holiday_events[i]);
    }
  }
}

function ot_omgholiday_renderEvent(key, event) {
  $(".otHolidayEffects").append(`
        <div id='holidayEffects-${key}'></div>
    `);
  var numberOfIcons = Number(event.number_of_icons),
    divEffects = $("#holidayEffects-" + key);
  if (!paramPreview && !paramPreviewSample) {
    homeCss = ot_omgholiday_renderHomepage(
      key,
      event.only_home,
      event.other_page
    );
  }
  $("head").append(`
        <style>
            ${paramPreview || paramPreviewSample ? "" : homeCss}
            #holidayEffects-${key} > div {width:${event.image_size}px;height:${event.image_size
    }px;}
            #holidayEffects-${key} > div > img{width:${event.image_size
    }px;height:${event.image_size}px;}
            #holidayEffects-${key} > div > i{font-size:${event.icon_size
    }px;color:${event.icon_color};}
        </style>
    `);
  if (event.choose_icons !== "") {
    var number = numberOfIcons;
    for (var j = 0; j < number; j++) {
      const icons = event.choose_icons.split(",");
      for (icon in icons) {
        if (icons[icon] !== "") {
          divEffects.append(
            ot_omgholiday_createIconEffects(
              icons[icon],
              Number(event.icon_size),
              Number(event.animation_speed)
            )
          );
        }
      }
    }
  }
  if (event.choose_images !== "") {
    var number = numberOfIcons;
    for (var j = 0; j < event.number_of_icons; j++) {
      const images = event.choose_images.split(",");
      for (image in images) {
        if (images[image] !== "") {
          divEffects.append(
            ot_omgholiday_createImageEffects(
              images[image],
              Number(event.icon_size),
              Number(event.animation_speed)
            )
          );
        }
      }
    }
  }
  if (event.custom_images !== "") {
    var number = numberOfIcons;
    for (var j = 0; j <= number; j++) {
      const images = event.custom_images.split(",");
      for (image in images) {
        if (images[image] !== "") {
          divEffects.append(
            ot_omgholiday_createCustomImageEffects(
              images[image],
              Number(event.icon_size),
              Number(event.animation_speed)
            )
          );
        }
      }
    }
  }
  if (Number(event.effect_time) > 0) {
    setTimeout(function () {
      $("#holidayEffects-" + key).css("display", "none");
    }, Number(event.effect_time) * 1000);
  }
  // check full frame
  if (
    (new RegExp("1").test(ot_omgholiday_FramePrev) === true &&
      new RegExp("2").test(ot_omgholiday_FramePrev) === true) ||
    new RegExp("3").test(ot_omgholiday_FramePrev) === true
  ) {
  } else {
    ot_omgholiday_createFrame();
  }

  function ot_omgholiday_createEffect() {
    if (event.effect_background !== "") {
      var script = document.createElement("script");
      script.src = `${rootlinkHoliday}/front-end/effectAnimation/${event.effect_background}.js?v=${version}`;
      script.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(script);
      localStorage.setItem("timeEndEffect", event.effect_time);
      const a = document.getElementById("canvasOmg");
      if (event.effect_time) {
        setTimeout(() => {
          a.style.display = "none";
        }, event.effect_time * 1000);
      }
    }
  }
  ot_omgholiday_createEffect();
  function ot_omgholiday_createFrame() {
    if (event.frames !== "") {
      ot_omgholiday_FramePrev += event.frame_position.toString() + ",";
      $("head").append(`
                <style>
                    #holidayTopFrames{background-position: top left;background-repeat: repeat-x;}
                    #holidayBottomFrames{background-position: top left;background-repeat: repeat-x;}
                </style>
            `);
      switch (event.frame_position) {
        case "2":
          $("head").append(`
                        <style>
                        #holidayBottomFrames {background-image:url("${rootlinkHoliday}/admin/client/src/asset/image/${event.frames}.png");display:block ;background-repeat: repeat-x}
                        </style>
                    `);
          break;
        case "3":
          $("head").append(`
                        <style>
                            #holidayBottomFrames {background-image:url(${rootlinkHoliday}/admin/client/src/asset/image/${event.frames}.png);display:block ;background-repeat: repeat-x}
                            #holidayTopFrames {background-image:url(${rootlinkHoliday}/admin/client/src/asset/image/${event.frames}.png);display:block ;background-repeat: repeat-x}
                            </style>
                    `);
          break;
        default:
          $("head").append(`
                        <style>
                        #holidayTopFrames {background-image:url("${rootlinkHoliday}/admin/client/src/asset/image/${event.frames}.png");display:block ;background-repeat: repeat-x}
                        </style>
                    `);
          break;
      }
      if (Number(event.frame_time) > 0) {
        setTimeout(function () {
          $(".holidayBottomFrames").css("display", "none");
          $(".holidayTopFrames").css("display", "none");
        }, Number(event.frame_time) * 1000);
      }
    }
    if (event.custom_frame !== "") {
      ot_omgholiday_FramePrev += event.frame_position.toString() + ",";
      switch (event.frame_position) {
        case "2":
          $("head").append(`
                    <style>
                    #holidayBottomFrames {background-image:url(${event.custom_frame});background-size:contain;display:block ;background-repeat: repeat-x;}
                    </style>
                `);
          break;
        case "3":
          $("head").append(`
                    <style>
                        #holidayBottomFrames {background-image:url(${event.custom_frame}); background-size:contain;display:block ;background-repeat: repeat-x}
                        #holidayTopFrames {background-image:url(${event.custom_frame}); background-size:contain;display:block ;background-repeat: repeat-x}
                    </style>
                `);
          break;
        default:
          $("head").append(`
                    <style>
                        #holidayTopFrames {background-image:url(${event.custom_frame}); background-size:contain;display:block ;background-repeat: repeat-x}
                    </style>
                `);
          break;
      }
      if (Number(event.frame_time) > 0) {
        setTimeout(function () {
          $(".holidayBottomFramesUpload").css("display", "none");
          $(".holidayTopFramesUpload").css("display", "none");
        }, Number(event.frame_time) * 1000);
      }
    }
    if (event.frame_gif !== "") {
      ot_omgholiday_FramePrev += event.frame_position.toString() + ",";
      switch (event.frame_position) {
        case "2":
          $("head").append(`
                      <style>
                      #holidayBottomFrames {background:url(${event.frame_gif});background-size:contain;display:block ;
                      width: 120px;
                      height: 90px;
                      animation-name: run;
                      animation-duration: 35s, 5s;
                      animation-iteration-count: infinite;
                      transition: transform 0.1s;
                      background-size: contain ;
                      background-repeat: no-repeat ;
                      )}
                      </style>
                  `);
          break;
        case "3":
          $("head").append(`
                      <style>
                        #holidayBottomFrames {background:url(${event.frame_gif});background-size:contain;display:block ;
                        width: 120px;
                        height: 90px;
                        animation-name: run;
                        animation-duration: 35s, 5s;
                        animation-iteration-count: infinite;
                        transition: transform 0.1s;
                        background-size: contain ;
                        background-repeat: no-repeat ;
                        )}
                        #holidayTopFrames {background:url(${event.frame_gif});background-size:contain;display:block ;
                        width: 120px;
                        height: 90px;
                        animation-name: run;
                        animation-duration: 35s, 5s;
                        animation-iteration-count: infinite;
                        transition: transform 0.1s;
                        background-size: contain ;
                        background-repeat: no-repeat ;
                        )}
                      </style>
                  `);
          break;
        default:
          $("head").append(`
                      <style>
                      #holidayTopFrames {background:url(${event.frame_gif});background-size:contain;display:block ;
                      width: 120px;
                      height: 90px;
                      animation-name: run;
                      animation-duration: 35s, 5s;
                      animation-iteration-count: infinite;
                      transition: transform 0.1s;
                      background-size: contain ;
                      background-repeat: no-repeat ;
                    }
                      </style>
                  `);
          break;
      }
      if (Number(event.frame_time) > 0) {
        setTimeout(function () {
          $("#holidayBottomFrames").css("display", "none");
          $("#holidayTopFrames").css("display", "none ");
        }, Number(event.frame_time) * 1000);
      }
    }
  }
}

function ot_omgholiday_renderHomepage(key, only_home, other_page) {
  var homeCss = "";
  pageView = "";
  if (only_home === "0" && other_page === "allpage") {
    return (homeCss = "");
  }
  if (only_home === "0" && other_page === "") {
    return (CanvasCss = "");
  }
  only_home === "1"
    ? (pageView = other_page + "home")
    : (pageView = other_page);
  const show = pageView !== "" ? pageView.search(new RegExp(__st.p)) : -1;
  if (+show === -1) {
    homeCss += "#holidayEffects-" + key + "{display:none;}";
  }
  return homeCss;
}
function ot_omgholiady_renderCanvas(only_home, other_page) {
  let CanvasCss = "";
  pageView = "";
  if (only_home === "0" && other_page === "allpage") {
    return (CanvasCss = "");
  }
  if (only_home === "0" && other_page === "") {
    return (CanvasCss = "");
  }
  only_home === "1"
    ? (pageView = other_page + "home")
    : (pageView = other_page);
  const show = pageView.search(new RegExp(__st.p));
  if (+show === -1) {
    CanvasCss += "#canvasOmg  {display:none !important;}";
  }
  return CanvasCss;
}
function ot_omgholiady_renderframe(only_home, other_page) {
  let frameCss = "";
  pageView = "";
  if (only_home === "0" && other_page === "allpage") {
    return (frameCss = "");
  }
  if (only_home === "0" && other_page === "") {
    return (CanvasCss = "");
  }

  only_home === "1"
    ? (pageView = other_page + "home")
    : (pageView = other_page);
  const show = pageView.search(new RegExp(__st.p));
  if (+show === -1) {
    frameCss += "#holidayBottomFrames  {display:none !important;}";
    frameCss += "#holidayTopFrames  {display:none !important;}";
  }
  return frameCss;
}
function ot_omgholiday_randomInteger(low, high) {
  return low + Math.floor(Math.random() * (high - low));
}
function ot_omgholiday_randomFloat(low, high) {
  return low + Math.random() * (high - low);
}
function ot_omgholiday_durationValue(value) {
  return value + "s";
}
function ot_omgholiday_pixelValue(value) {
  return value + "px";
}
function ot_omgholiday_createIconEffects(text, iconSize, animationSpeed) {
  var spinAnimationName =
    Math.random() < 0.5 ? "clockwiseSpin" : "counterclockwiseSpinAndFlip",
    spinDuration = ot_omgholiday_durationValue(ot_omgholiday_randomFloat(4, 8)),
    leafDelay = ot_omgholiday_durationValue(ot_omgholiday_randomFloat(0, 5)),
    leftStyle = ot_omgholiday_pixelValue(
      ot_omgholiday_randomInteger(0, $(window).width())
    ),
    html = `
            <div style="top:-${iconSize}px;left:${leftStyle};animation-name:fade,drop;animation-duration:${animationSpeed}s,${animationSpeed}s;animation-delay:${leafDelay},${leafDelay}">
                <i class="fa ${text}" aria-hidden="true" style="animation-name:${spinAnimationName};animation-duration:${spinDuration}"></i>
            </div>
        `;
  return html;
}
function ot_omgholiday_createImageEffects(text, iconSize, animationSpeed) {
  iconSize = iconSize + 50;
  var spinAnimationName =
    Math.random() < 0.5 ? "clockwiseSpin" : "counterclockwiseSpinAndFlip",
    spinDuration = ot_omgholiday_durationValue(ot_omgholiday_randomFloat(4, 8)),
    leafDelay = ot_omgholiday_durationValue(ot_omgholiday_randomFloat(0, 5)),
    leftStyle = ot_omgholiday_pixelValue(
      ot_omgholiday_randomInteger(0, $(window).width())
    ),
    html = `
            <div style="top:-${iconSize}px;left:${leftStyle};animation-name:fade,drop;animation-duration:${animationSpeed}s,${animationSpeed}s;animation-delay:${leafDelay},${leafDelay}">
                <img src="${rootlinkHoliday}/admin/client/src/asset/image/${text}.png" style="animation-name:${spinAnimationName};animation-duration:${spinDuration};">
            </div>
        `;

  return html;
}
function ot_omgholiday_createCustomImageEffects(url, iconSize, animationSpeed) {
  iconSize = iconSize + 50;
  var spinAnimationName =
    Math.random() < 0.5 ? "clockwiseSpin" : "counterclockwiseSpinAndFlip",
    spinDuration = ot_omgholiday_durationValue(ot_omgholiday_randomFloat(4, 8)),
    leafDelay = ot_omgholiday_durationValue(ot_omgholiday_randomFloat(0, 5)),
    leftStyle = ot_omgholiday_pixelValue(
      ot_omgholiday_randomInteger(0, $(window).width())
    ),
    html = `
            <div style="top:-${iconSize}px;left:${leftStyle};animation-name:fade,drop;animation-duration:${animationSpeed}s,${animationSpeed}s;animation-delay:${leafDelay},${leafDelay}">
                <img src="${url}" style="animation-name:${spinAnimationName};animation-duration:${spinDuration};; ">
            </div>
        `;
  return html;
}
