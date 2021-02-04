if (typeof omgholiday_checkJS == "undefined") {
    var omgholiday_checkJS = 1;
    var omg_holiday_effects_shopName = Shopify.shop;
    var rootlinkHolidayEffects = "https://apps.omegatheme.com/holiday-effects";

    if (typeof $ == "undefined") {
        javascript: (function (e, s) {
            e.src = s;
            e.onload = function () {
                $ = jQuery.noConflict();
                omgholiday_init();
            };
            document.head.appendChild(e);
        })(
            document.createElement("script"),
            "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
        );
    } else {
        omgholiday_init();
    }

    async function omgholiday_init() {
        var result = await omgholiday_getHolidayEvents();
        if (result != null) {
            omgholiday_loadFile(result);
        }
    }

    // -----------------Fetch Settings-------------------
    function omgholiday_getHolidayEvents() {
        return new Promise(resolve => {
            $.ajax({
                url: `${rootlinkHolidayEffects}/holidayeffects.php`,
                type: "GET",
                data: {
                    shop: omg_holiday_effects_shopName,
                    action: "getHolidayEvents"
                },
                dataType: "json"
            }).done(result => {
                if (result.install && !result.expired) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            });
        });
    }
    // ----------------End Fetch Settings-----------------

    // -------------------------- Load file -------------------------
    function omgholiday_loadFile(result) {
        $("head").append(`
            <link rel='stylesheet' type='text/css' href='//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' />
            <link href='${rootlinkHolidayEffects}/assets/css/holidayeffects.css?v=${result.ver}' rel='stylesheet'>
        `);
        omgholiday_cachedScriptFile(`${rootlinkHolidayEffects}/app.js?v=${result.ver}`).done(function (script, textStatus) {
            omgholiday_getJsonFile(result.events);
        });
    }

    // ------------------------ End load file -----------------------

    function omgholiday_cachedScriptFile(url, options) {
        options = $.extend(options || {}, {
            dataType: "script",
            cache: true,
            url: url
        });
        return $.ajax(options);
    }
}

