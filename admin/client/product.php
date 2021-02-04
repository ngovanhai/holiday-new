<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods:  GET, POST");
date_default_timezone_set('UTC');
header('Content-Type: application/json');
require '../../vendor/autoload.php';
require '../../help.php';
require 'regex.php';

use sandeepshetty\shopify_api;

// CONST
// CONST LIMIT_PRODUCT_PER_PAGE = 250;
// CONST MAX_LIMIT_PRODUCT_PER_PAGE = 50;
// END CONST


if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET['shop'];
    if ($action == "getEvent") {
        $events = db_fetch_array("SELECT * FROM holiday_events_effects WHERE shop = '$shop'");
        echo json_encode($events);
        exit();
    }
    if ($action == "active") {
        if (!isset($_GET['id'])) return false;
        $id = $_GET['id'];
        $publish = db_fetch_row("SELECT publish FROM holiday_events_effects WHERE shop = '$shop' AND id = $id");
        $newPublish;
        if ($publish['publish'] == 1) {
            $newPublish = 0;
        } else {
            $newPublish = 1;
        }
        try {
            $res =  db_update("holiday_events_effects", [
                "publish" => $newPublish
            ], "shop = '$shop'  AND id = $id");
            echo "success !";
        } catch (Exception $e) {
            echo $e->getMessage();
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
    if ($action == "getIdTheme") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res = $shopify('GET', '/admin/api/2020-10/themes.json');
        echo json_encode($res);
    }
    if ($action == "getAssets") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res = $shopify('GET', '/admin/api/2020-10/themes.json');
        echo json_encode($res);
    }
    if ($action == "getScript") {
        $shopify = shopifyInit($db, $shop, $appId);
        $res = $shopify('GET', '/admin/api/2020-10/script_tags.json');
        echo json_encode($res);
    }
    if ($action == "postScript") {
        $script_array = array(
            'script_tag' => array(
                'event' => 'onload',
                'src' => 'https://hailocal.omegatheme.com/holiday-app2/Front-end/effect.js?v=' . $version
            )
        );
        echo ("$rootLink . '/Front-end/effect.js'");
        $shopify = shopifyInit($db, $shop, $appId);
        $scriptTag = $shopify('POST', '/admin/api/2020-10/script_tags.json', $script_array);
        echo json_encode($scriptTag);
    }
    if ($action == "deleteScript") {
        $idScript = $_GET['id'];
        $shopify = shopifyInit($db, $shop, $appId);
        $scriptTag = $shopify("DELETE", '/admin/api/2020-10/script_tags/' . $idScript . '.json');
        echo pr('DELETE', '/admin/api/2020-10/script_tags/' . $idScript . '.json');
        echo pr($scriptTag);
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
}

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);
if (isset($_POST)) {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        if ($action == "create") {
            try {
                $res = db_insert("holiday_events_effects", [
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
                echo $_POST['choose_images'];
                $res = db_update("holiday_events_effects", [
                    "shop" => $shop,
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
                ], "shop = '$shop'  AND id = $id");
                echo $_POST['choose_images'];
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }
        if ($action == "updateSample") {
        }
        if ($action == "uploadframe") {
            $name = $_POST['name'];
            $name = vn_to_str($name);
            $shop = $_POST['shop'];
            $themeid = $_POST['idTheme'];
            $base = $_POST['base'];
            $id = $_POST['id'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res  = $shopify("PUT", "/admin/api/2020-10/themes/" . $themeid . "/assets.json", array('asset' => array('key' => "assets/" . $name, 'attachment' => $base)));
            $sql = db_insert('holiday_events_frames', [
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
            $res  = $shopify("PUT", "/admin/api/2020-10/themes/" . $themeid . "/assets.json", array('asset' => array('key' => "assets/" . $name, 'attachment' => $base)));
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
            $res = $shopify('GET', '/admin/api/2020-10/themes/' . $idTheme . '/assets.json');
            echo json_encode($res);
        }
        if ($action == "deleteImage") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $id = $_POST['id'];
            $image = db_fetch_row("SELECT name FROM holiday_events_images WHERE shop = '$shop' AND id='$id'");
            $name = $image['name'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res = $shopify('DELETE', '/admin/api/2020-10/themes/' . $idTheme . '/assets.json?asset[key]=assets/' . $name);
            db_delete('holiday_events_images', "shop = '$shop'  AND id = $id");
            echo pr($res);
        }
        if ($action == "deleteFrame") {
            $shop = $_POST['shop'];
            $idTheme = $_POST['idTheme'];
            $id = $_POST['id'];
            $image = db_fetch_row("SELECT name FROM holiday_events_frames WHERE shop = '$shop' AND id='$id'");
            $name = $image['name'];
            $shopify = shopifyInit($db, $shop, $appId);
            $res = $shopify('DELETE', '/admin/api/2020-10/themes/' . $idTheme . '/assets.json?asset[key]=assets/' . $name);
            db_delete('holiday_events_frames', "shop = '$shop'  AND id = $id");
            echo pr($res);
        }
    }
}
