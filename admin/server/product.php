<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type,Accept,Authorization, X-Requested-With');
require '../../vendor/autoload.php';
require '../../help.php';
require 'regex.php';

use sandeepshetty\shopify_api;

use function PHPSTORM_META\type;

// CONST
// CONST LIMIT_PRODUCT_PER_PAGE = 250;
// CONST MAX_LIMIT_PRODUCT_PER_PAGE = 50;
// END CONST


if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET['shop'];
    if ($action == "getEvents") {
        $events = db_fetch_array("SELECT * FROM `holiday_events_effects` WHERE shop= '$shop'");
        echo json_encode($events);
        exit();
    }
    if ($action == "getEventsSample") {
        $events = db_fetch_array("SELECT * FROM `holiday_events_effects_sample` ");
        echo json_encode($events);
        exit();
    }
    if ($action == "getEvents") {
        $id = $_GET['id'];
        $event = db_fetch_row("SELECT * FROM `holiday_events_effects` WHERE shop= '$shop' AND id='$id'");
        echo json_encode($event);
        exit();
    }

    if ($action == "active") {
        if (!isset($_GET['id'])) return false;
        $id = $_GET['id'];
        $shop = $_GET['shop'];
        $active = $_GET['active'];
        $event = db_fetch_row("SELECT * FROM `holiday_events_effects` WHERE shop= '$shop' AND id='$id'");
        if ($active == 1) {
            db_update("holiday_events_effects", [
                "publish" => "0"
            ], "shop = '$shop'  AND publish = '1'");
            db_update("holiday_events_effects", [
                "publish" => "1"
            ], "shop = '$shop'  AND id = $id");
            echo "active succes !";
        }
        if ($active == 0) {
            db_update("holiday_events_effects", [
                "publish" => "0"
            ], "shop = '$shop'  AND id = $id ");
            echo "active succes !";
        }
    }
    if ($action == "deleteEvent") {
        $id = $_GET['id'];
        try {
            db_delete("holiday_events_effects", "shop = '$shop'  AND id = $id");
            echo "delete succsess";
        } catch (Exception $e) {
            echo "loi";
        }
    }


    if ($action == "getImage") {
        $shop = $_GET['shop'];
        try {
            $res = db_fetch_array("SELECT * FROM holiday_events_images WHERE shop = '$shop'");
            echo json_encode($res);
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "getFrame") {
        $shop = $_GET['shop'];
        try {
            $res = db_fetch_array("SELECT * FROM holiday_events_frames WHERE shop = '$shop'");
            echo json_encode($res);
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "getCss") {
        postScriptTag($shop, $appId, $apiVersion, $rootLink, $version);
    }
    if ($action == "getImageFe") {
        $shop = $_GET['shop'];
        $id = $_GET['id'];
        try {
            $res = db_fetch_array("SELECT * FROM holiday_events_images WHERE shop = '$shop' AND id='$id'");
            echo json_encode($res);
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "getFrameFe") {
        $shop = $_GET['shop'];
        $id = $_GET['id'];
        try {
            $res = db_fetch_array("SELECT * FROM holiday_events_frames WHERE shop = '$shop' AND id = '$id'");
            echo json_encode($res);
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "getBackground") {
        $shop = $_GET['shop'];
        try {
            $res = db_fetch_array("SELECT * FROM holiday_events_background WHERE shop = '$shop' ");
            echo json_encode($res);
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    if ($action == "deleteBackground") {
        $id = $_GET['id'];
        echo "hello";
        try {
            db_delete("holiday_events_background", "shop = '$shop'  AND id = $id");
            echo "delete succsess";
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "deleteImage") {
        $id = $_GET['id'];
        try {
            db_delete("holiday_events_images", "shop = '$shop'  AND id = $id");
            echo "delete succsess";
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "deleteFrame") {
        $id = $_GET['id'];
        try {
            db_delete("holiday_events_frames", "shop = '$shop'  AND id = $id");
            echo "delete succsess";
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    if ($action == "getproduct") {
        $shopify = shopifyInit($db, $shop, $appId);
        $products = getProductInPage($shopify, $since_id = 0, $limit = 50, $fields = "id,title,handle");
        echo json_encode($products);
    }
    if ($action == "getWebhook") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res =  $shopify('GET', $apiVersion . '/webhooks.json');
        echo json_encode($res);
    }
    if ($action == "getIdTheme") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res = $shopify('GET', $apiVersion . '/themes.json');
        echo json_encode($res);
    }
    if ($action == "getTheme") {
        $shop = $_GET['shop'];
        $shopify = shopifyInit($db, $shop, $appId);
        $resTheme = $shopify('GET', $apiVersion . '/themes.json');
        $idTheme = "";
        foreach ($resTheme as $value) {
            if ($value['role'] == "main") {
                $idTheme = $value['id'];
            };
        }
        $themeLiquid = $shopify("GET", $apiVersion . "/themes/" . $idTheme . '/assets.json?asset[key]=layout/theme.liquid');
        $themeLiquid = $themeLiquid['value'];
        $chuoi_con = "<head><link rel='stylesheet' href='{{ 'styleHoliday.css' | asset_url }}' type='text/css' media='print' onload='this.media=";
        if (strlen(strstr($themeLiquid, $chuoi_con)) < 0) {
            echo " kco";
        } else {
            echo "hihi";
        }
    }
    if ($action == "getAssest") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res = $shopify('GET', '/admin/api/2021-01/themes/116501119147/assets.json');
        echo json_encode($res);
    }
    if ($action == "getAssets") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res = $shopify('GET', $apiVersion . '/themes.json');
        echo json_encode($res);
    }
    if ($action == "getScript") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res = $shopify('GET', $apiVersion . '/script_tags.json');
        echo json_encode($res);
    }
    if ($action == "postScript") {
        postScriptTag($shop, $appId, $apiVersion, $rootLink, $version);
    }
    if ($action == "deleteScript") {
        $shopify = shopifyInit($db, $shop, $appId);
        $id = $_GET['id'];
        $res = $shopify('DELETE',  '/admin/api/2021-01/script_tags/' . $id . '.json');
        echo $id;
        echo json_encode($res);
    }
    if ($action == "check_expired") {
        $shop = $_GET['shop'];
        try {
            $check = check_expired($shop, $appId);
            if ($check == 1) {
                echo 1;
            } else {
                echo 0;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    if ($action == "getSettings") {
        $shop = $_GET['shop'];
        try {
            $res = db_fetch_array("SELECT * FROM holiday_events_effects_settings WHERE shop = '$shop'");
            echo json_encode($res);
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "settingsturnOnOff") {
        $shop = $_GET['shop'];
        try {
            $res = db_fetch_row("SELECT turn_onoff FROM holiday_events_effects_settings WHERE shop = '$shop'");
            if ($res['turn_onoff'] == "0") {
                db_update('holiday_events_effects_settings', [
                    'turn_onoff' => "1"
                ], "shop = '$shop'");
                echo "update success !";
            } else {
                db_update('holiday_events_effects_settings', [
                    'turn_onoff' => "0"
                ], "shop = '$shop'");
                echo "update success !";
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    if ($action == "settingsAuoPublish") {
        $shop = $_GET['shop'];
        try {
            $res = db_fetch_row("SELECT autoPublish FROM holiday_events_effects_settings WHERE shop = '$shop'");
            if ($res['autoPublish'] == "0") {
                db_update('holiday_events_effects_settings', [
                    'autoPublish' => "1"
                ], "shop = '$shop'");
                echo "update success !";
            } else {
                db_update('holiday_events_effects_settings', [
                    'autoPublish' => "0"
                ], "shop = '$shop'");
                echo "update success !";
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "autoPublish") {
        $shop = $_GET['shop'];
        try {
            $res = db_fetch_array("SELECT * FROM holiday_events_effects_settings WHERE shop = '$shop'");
            echo json_encode($res);
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    if ($action == "backup") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res  = $shopify("PUT", $apiVersion . "/themes/116501119147/assets.json", array('asset' => array('key' => "layout/alternate.liquid", 'source_key' => "layout/theme.liquid")));
        echo json_encode($res);
    }
    if ($action == "test") {
        $shop = $_GET['shop'];
        $id = $_GET['id'];
        $a = $db->query('delete from holiday_events_effects where shop = "' . $shop . '" and id = ' . $id);
        pr($a);
    }
    if ($action == "test2") {
        $shop = $_GET['shop'];
        $appId = 1;
        $shop_data1 = $db->query('delete from tbl_usersettings where store_name= "' . $shop . '" and app_id = ' . $appId);
        echo $shop_data1;
    }
    if ($action == 'createScript') {
        $shop = $_GET['shop'];
        echo $shop;
        $shopify = shopifyInit($db, $shop, $appId);
        $resScript  = $shopify("PUT", $apiVersion . "/themes/" . $idTheme . "/assets.json", array(
            'asset' => array('key' => "assets/effect.js", 'src' => $rootLink . '/front-end/effect.js?v=' . $version)
        ));
        $script_arrayScript = array(
            'script_tag' => array(
                'event' => 'onload',
                'src' => $resScript['public_url']
            )
        );

        $scriptTagScript = $shopify('POST', $apiVersion . '/script_tags.json', $script_arrayScript);
    }
}

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);
if (isset($_POST)) {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        if ($action == "create") {
            try {
                $res = db_insert("holiday_events_effects", [
                    "frame_gif" => $_POST['frame_gif'],
                    "shop" => $_POST['shop'],
                    "id" => $_POST['id'],
                    "event_name" => $_POST['event_name'],
                    "number_of_icons" => $_POST['number_of_icons'],
                    "animation_speed" => $_POST['animation_speed'],
                    "icon_size" => $_POST['icon_size'],
                    "icon_color" => $_POST['icon_color'],
                    "image_size" => $_POST['image_size'],
                    "choose_icons" => $_POST['choose_icons'],
                    "choose_images" => $_POST['choose_images'],
                    "frames" => $_POST['frames'],
                    "effect_time" => $_POST['effect_time'],
                    "frame_time" => $_POST['frame_time'],
                    "frame_position" => $_POST['frame_position'],
                    "only_home" => $_POST['only_home'],
                    "top_frame" => $_POST['top_frame'],
                    "bottom_frame" => $_POST['bottom_frame'],
                    "start_date" => $_POST['start_date'],
                    "end_date" => $_POST['end_date'],
                    "custom_images" => $_POST['custom_images'],
                    "custom_frame" => $_POST['custom_frame'],
                    "other_page" => $_POST['other_page'],
                    "effect_background" => $_POST['effect_background'],
                ]);
                echo   "succsess";
            } catch (Exception $e) {
                echo "loi";
            }
        }
        if ($action == "update") {
            if (!isset($_POST['id'])) return false;
            $id = $_POST['id'];
            $shop = $_POST['shop'];
            try {
                $res = db_update("holiday_events_effects", [
                    "shop" => $shop,
                    "frame_gif" => $_POST['frame_gif'],
                    "event_name" => $_POST['event_name'],
                    "number_of_icons" => $_POST['number_of_icons'],
                    "animation_speed" => $_POST['animation_speed'],
                    "icon_size" => $_POST['icon_size'],
                    "icon_color" => $_POST['icon_color'],
                    "image_size" => $_POST['image_size'],
                    "choose_icons" => $_POST['choose_icons'],
                    "choose_images" => $_POST['choose_images'],
                    "frames" => $_POST['frames'],
                    "effect_time" => $_POST['effect_time'],
                    "frame_time" => $_POST['frame_time'],
                    "frame_position" => $_POST['frame_position'],
                    "only_home" => $_POST['only_home'],
                    "top_frame" => $_POST['top_frame'],
                    "bottom_frame" => $_POST['bottom_frame'],
                    "start_date" => $_POST['start_date'],
                    "end_date" => $_POST['end_date'],
                    "custom_images" => $_POST['custom_images'],
                    "custom_frame" => $_POST['custom_frame'],
                    "other_page" => $_POST['other_page'],
                    "effect_background" => $_POST['effect_background'],
                ], "shop = '$shop'  AND id = $id");
                echo "success !";
            } catch (Exception $e) {
                echo "Message :" . $e->getMessage();
            }
        }
        if ($action == "deleteChooseEvents") {
            if (!isset($_POST['id'])) return false;
            $shop = $_POST['shop'];
            $array_id = $_POST['id'];
            try {
                foreach ($array_id as $id) {
                    db_delete("holiday_events_effects", "shop = '$shop'  AND id = $id");
                }
                echo "success !";
            } catch (Exception $e) {
                echo "Message :" . $e->getMessage();
            }
        }
        if ($action == "updateSample") {
            if (!isset($_POST['id'])) return false;
            $id = $_POST['id'];
            $shop = $_POST['shop'];
            try {
                db_update("holiday_events_effects", [
                    "only_home" => $_POST['only_home'],
                    "effect_time" => $_POST['effect_time'],
                    "animation_speed" => $_POST['animation_speed'],
                    "start_date" => $_POST['start_date'],
                    "end_date" => $_POST['end_date'],
                ], "shop= '$shop' AND id = $id");
            } catch (Exception $e) {
                echo "Message :" . $e->getMessage();
            }
        }
        if ($action == "uploadframe") {
            $name = $_POST['name'];
            $name = vn_to_str($name);
            $shop = $_POST['shop'];
            $themeid = $_POST['idTheme'];
            $base = $_POST['base'];
            $id = $_POST['id'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res  = $shopify("PUT", $apiVersion . "/themes/" . $themeid . "/assets.json", array('asset' => array('key' => "assets/" . $name, 'attachment' => $base)));
            $sql = db_insert('holiday_events_frames', [
                "url" => $res['public_url'],
                "name" => $name,
                "shop" => $shop,
                "id" => $id,
            ]);
            $data = array("url" => $res['public_url'], "name" => $name);
            echo json_encode($data);
        }
        if ($action == "uploadBackground") {
            $name = $_POST['name'];
            $name = vn_to_str($name);
            $shop = $_POST['shop'];
            $themeid = $_POST['idTheme'];
            $base = $_POST['base'];
            $id = $_POST['id'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res  = $shopify("PUT", $apiVersion . "/themes/" . $themeid . "/assets.json", array('asset' => array('key' => "assets/" . $name, 'attachment' => $base)));
            $sql = db_insert('holiday_events_backgrounds', [
                "url" => $res['public_url'],
                "name" => $name,
                "shop" => $shop,
                "id" => $id,
            ]);
            $data = array("url" => $res['public_url'], "name" => $name);
            echo json_encode($data);
        }

        if ($action == "uploadImage") {
            $name = $_POST['name'];
            $name = vn_to_str($name);
            $id = $_POST['id'];
            $themeid = $_POST['idTheme'];
            $base = $_POST['base'];
            $shop = $_POST['shop'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res  = $shopify("PUT", $apiVersion . "/themes/" . $themeid . "/assets.json", array('asset' => array('key' => "assets/" . $name, 'attachment' => $base)));
            $sql = db_insert('holiday_events_images', [
                "url" => $res['public_url'],
                "name" => $name,
                "shop" => $shop,
                "id" => $id
            ]);
            $data = array("url" => $res["public_url"], "name" => $name);
            echo json_encode($data);
        }
        if ($action == "getAllAssets") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res = $shopify('GET', $apiVersion . '/themes/' . $idTheme . '/assets.json');
            echo json_encode($res);
        }
        if ($action == "deleteImage") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $id = $_POST['id'];
            $image = db_fetch_row("SELECT name FROM holiday_events_images WHERE shop = '$shop' AND id='$id'");
            $name = $image['name'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res = $shopify('DELETE', $apiVersion . '/themes/' . $idTheme . '/assets.json?asset[key]=assets/' . $name);
            db_delete('holiday_events_images', "shop = '$shop'  AND id = $id");
            echo pr($res);
        }
        if ($action == "deleteChooseImages") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $array_id = $_POST['id'];
            foreach ($array_id as $id) {
                $image = db_fetch_row("SELECT name FROM holiday_events_images WHERE shop = '$shop' AND id='$id'");
                $name = $image['name'];
                $shopify = shopifyInit($db, $shop, $appId);
                $res = $shopify('DELETE', $apiVersion . '/themes/' . $idTheme . '/assets.json?asset[key]=assets/' . $name);
                echo json_encode($res);
                db_delete('holiday_events_images', "shop = '$shop'  AND id = $id");
            }
        }
        if ($action == "deleteChooseFrames") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $array_id = $_POST['id'];
            foreach ($array_id as $id) {
                $image = db_fetch_row("SELECT name FROM holiday_events_frames WHERE shop = '$shop' AND id='$id'");
                $name = $image['name'];
                $shopify = shopifyInit($db, $shop, $appId);
                $res = $shopify('DELETE', $apiVersion . '/themes/' . $idTheme . '/assets.json?asset[key]=assets/' . $name);
                echo json_encode($res);
                db_delete('holiday_events_frames', "shop = '$shop'  AND id = $id");
            }
        }
        if ($action == "deleteFrame") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $id = $_POST['id'];
            $image = db_fetch_row("SELECT name FROM holiday_events_frames WHERE shop = '$shop' AND id='$id'");
            $name = $image['name'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res = $shopify('DELETE', $apiVersion . '/themes/' . $idTheme . '/assets.json?asset[key]=assets/' . $name);
            db_delete('holiday_events_frames', "shop = '$shop'  AND id = $id");
            echo pr($res);
        }
        if ($action == "deleteBackground") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $id = $_POST['id'];
            $image = db_fetch_row("SELECT name FROM holiday_events_background WHERE shop = '$shop' AND id='$id'");
            $name = $image['name'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res = $shopify('DELETE', $apiVersion . '/themes/' . $idTheme . '/assets.json?asset[key]=assets/' . $name);
            db_delete('holiday_events_background', "shop = '$shop'  AND id = $id");
            echo pr($res);
        }
    }
}
