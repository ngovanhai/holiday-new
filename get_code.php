<?php
require 'vendor/autoload.php';

use sandeepshetty\shopify_api;

require 'help.php';

if (!empty($_GET['shop']) && !empty($_GET['code'])) {
    $shop = $_GET['shop'];
    $app_settings = db_fetch_row("SELECT * FROM tbl_appsettings WHERE id = $appId");
    $access_token = shopify_api\oauth_access_token($_GET['shop'], $app_settings['api_key'], $app_settings['shared_secret'], $_GET['code']);
    $installed = checkInstalled($db, $shop, $appId);
    if ($installed["installed"]) {
        $date_installed = $installed["installed_date"];
        db_insert("tbl_usersettings", [
            'access_token' => $access_token,
            'store_name' => $shop,
            'app_id' => $appId,
            'installed_date' => $date_installed,
            'confirmation_url' => ''
        ]);
        $date1 = new DateTime($installed["installed_date"]);
        $date2 = new DateTime("now");
        $interval = date_diff($date1, $date2);
        $diff = (int)$interval->format('%R%a');
        $trialTime = $trialTime - $diff;
        if ($trialTime < 0) {
            $trialTime = 0;
        }
    } else {
        db_insert("tbl_usersettings", [
            'access_token' => $access_token,
            'store_name' => $shop,
            'app_id' => $appId,
            'installed_date' => date("Y-m-d H:i:s"),
            'confirmation_url' => ''
        ]);
        db_insert("shop_installed", [
            'shop' => $shop,
            'app_id' => $appId,
            'date_installed' => date("Y-m-d H:i:s")
        ]);
    }


    //settings

    $shop_data1 = db_fetch_row("SELECT * FROM holiday_events_effects_settings WHERE shop ='$shop' AND appId='$appId'");
    if (!$shop_data1) {
        db_insert("holiday_events_effects_settings", [
            'shop' => $shop,
            'autoPublish' => 0,
            'turn_onoff' => 0,
            'appId' => $appId
        ]);
    }
    //---- CHARGE FEE ----
    $shopify = shopifyInit($db, $shop, $appId);
    $charge = array(
        "recurring_application_charge" => array(
            "name" => $chargeTitle,
            "price" => $price,
            "return_url" => "$rootLink/charge.php?shop=$shop",
            "test" => $testMode,
            "trial_days" => $trialTime
        )
    );
    if ($chargeType == "one-time") {
        $recu = $shopify("POST", $apiVersion . "application_charges.json", $charge);
    } else {
        $recu = $shopify("POST", $apiVersion . "recurring_application_charges.json", $charge);
    }
    $confirmation_url =  isset($recu["confirmation_url"]) ? $recu["confirmation_url"] : NULL;
    db_update("tbl_usersettings", ['confirmation_url' => $confirmation_url], "store_name = '$shop' and app_id = $appId");


    //---- SEND EMAIL ----
    // require 'plugin/email/install_email.php';

    //---- RES WEBHOOK ---- 
    registerWebhooks($shop, $shopify, $rootLink);


    //---- ADD SCRIPTTAG ---- 
    postScriptTag($shop, $appId, $apiVersion, $rootLink, $version);

    if ($chargeType == "free" || $confirmation_url == NULL) {
        db_update("tbl_usersettings", ['confirmation_url' => $confirmation_url], "store_name = '$shop' and app_id = $appId");
        header('Location: https://' . $shop . '/admin/apps/hai-sample-app');
    } else {
        header('Location: ' . $confirmation_url);
    }
}
function registerWebhooks($shop, $shopify, $rootLink)
{
    // Define all hooks
    $hooks = [
        [
            "topic" => "app/uninstalled",
            "address" => $rootLink . '/uninstall.php',
            "format" => "json"
        ]
    ];
    // Register
    foreach ($hooks as $key => $hook) {
        $webhook = $shopify('POST', $apiVersion . 'webhooks.json', ["webhook" => $hook]);
        usleep(60 * 10 * 1000);
    }

    return;
}
function checkInstalled($db, $shop, $appId)
{
    $shop_installled = db_fetch_row("select * from shop_installed where shop = '$shop' and app_id = $appId");
    if (count($shop_installled) > 0) {
        $date_instaled = $shop_installled["date_installed"];
        $result = array(
            "installed_date" => $date_instaled,
            "installed" => true
        );
        return $result;
    } else {
        $result = array(
            "installed" => false
        );
        return $result;
    }
}
