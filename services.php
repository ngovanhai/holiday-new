<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
require 'vendor/autoload.php';
use sandeepshetty\shopify_api;
require 'conn-shopify.php';
require 'help.php';

if (!defined("APP_PATH")) {
    define("APP_PATH",dirname(__FILE__)) ;
}
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "getAllEvents") {
        $lists = getAllEvents($shop);
        echo json_encode($lists);
    }
    if ($action == "getShopCustomImages") {
        $images = getShopCustomImages($shop);
        echo json_encode($images);
    }   
    if ($action == "getStorePlanChange") {
        $webhookContent = "";
        $webhook = fopen('php://input' , 'rb');
        while (!feof($webhook)) {
            $webhookContent .= fread($webhook, 4096);
        }
        fclose($webhook);
        $data = json_decode($webhookContent, true);
        if($data["plan_name"] == 'closed' || $data["plan_name"] == 'cancelled' || $data["plan_name"] == 'fraudulent') {
            $db->query("update tbl_usersettings set status = '".$data["plan_name"]."' where shop = '$shop' and app_id = $appId");
        } else {
            $db->query("update tbl_usersettings set status = 'active' where shop = '$shop' and app_id = $appId");
        }
    }
}

if (isset($_POST['action'])) {
    $action     = $_POST['action'];
    $shop       = $_POST["shop"];
    $shopify    = shopifyInit($db, $shop, $appId);
    if ($action == 'addEvent') {
        $newevent = $_POST['newevent'];
        if(!isset($newevent["choose_icons"]) || $newevent["choose_icons"] == NULL){
            $newevent["choose_icons"] = array();
        }
        if(!isset($newevent["choose_images"]) || $newevent["choose_images"] == NULL){
            $newevent["choose_images"] = array();
        }
        if(!isset($newevent["custom_images"]) || $newevent["custom_images"] == NULL){
            $newevent["custom_images"] = array();
        }

        $data_insert = [
            'event_name'        => $newevent["event_name"],
            'number_of_icons'   => $newevent["number_of_icons"],
            'animation_speed'   => $newevent["animation_speed"],
            'icon_size'         => $newevent["icon_size"],
            'image_size'        => $newevent["image_size"],
            'icon_color'        => $newevent["icon_color"],
            'choose_icons'      => json_encode($newevent["choose_icons"]),
            'choose_images'     => json_encode($newevent["choose_images"]),
            'custom_images'     => json_encode($newevent["custom_images"]),
            'frames'            => $newevent["frames"],
            'effect_time'       => $newevent["effect_time"],
            'frame_time'        => $newevent["frame_time"],
            'frame_position'    => $newevent["frame_position"],
            'only_home'         => returnBooleanData($newevent['only_home']),
            'start_date'        => date("Y-m-d H:i:s", strtotime($newevent["start_date"])),
            'end_date'          => date("Y-m-d H:i:s", strtotime($newevent["end_date"])),
            'shop'              => $shop,
        ];
        $id = db_insert('holiday_events_effects', $data_insert);
    }
    if ($action == 'saveEvent') {
        $event = $_POST['event'];
        if(!isset($event["choose_icons"]) || $event["choose_icons"] == NULL){
            $event["choose_icons"] = array();
        }
        if(!isset($event["choose_images"]) || $event["choose_images"] == NULL){
            $event["choose_images"] = array();
        }
        if(!isset($event["custom_images"]) || $event["custom_images"] == NULL){
            $event["custom_images"] = array();
        }
        $data = array(
            'event_name'        => $event["event_name"],
            'number_of_icons'   => $event["number_of_icons"],
            'animation_speed'   => $event["animation_speed"],
            'icon_size'         => $event["icon_size"],
            'image_size'        => $event["image_size"],
            'icon_color'        => $event["icon_color"],
            'choose_icons'      => json_encode($event["choose_icons"]),
            'choose_images'     => json_encode($event["choose_images"]),
            'custom_images'     => json_encode($event["custom_images"]),
            'frames'            => $event["frames"],
            'effect_time'       => $event["effect_time"],
            'frame_time'        => $event["frame_time"],
            'frame_position'    => $event["frame_position"],
            'only_home'         => returnBooleanData($event['only_home']),
            'start_date'        => date("Y-m-d H:i:s", strtotime($event["start_date"])),
            'end_date'          => date("Y-m-d H:i:s", strtotime($event["end_date"])),
        );  
        db_update("holiday_events_effects",$data,"id = " . $event["id"]);
    }
    if ($action == "deleteEvent") {
        $id = $_POST["id"];
        $sql = "delete from holiday_events_effects WHERE id = $id";
        $db->query($sql);
    }
    if ($action == "publishEvent") {
        $id = $_POST["id"];
        $db->query("UPDATE holiday_events_effects SET publish='1' WHERE id = '$id'");
    }
    if ($action == "unpublishEvent") {
        $id = $_POST["id"];
        $db->query("UPDATE holiday_events_effects SET publish='0' WHERE id = '$id'");
    }
    if ($action == "deleteCustomImage") {
        $image = $_POST["image"];
        $id = $image["id"];
        $name = $image["name"];
        deleteCustomImage($db, $shop, $shopify, $id, $name);
    }
}
if (isset($_POST['newShopImage'])) {
    $shop = $_POST['newShopImage'];
    $shopify = shopifyInit($db, $shop, $appId);
    $themeId = getMainTheme($shopify);
    $url = array();
    $success = false;
    if (isset($_FILES['image']["name"])) {
        $filename = $_FILES['image']['name'];
        $tmpname = $_FILES['image']['tmp_name'];
        $filename = FixSpecialChars($filename);
        $tmpname = FixSpecialChars($tmpname);
        $target_file =  "/upload/" . basename($filename);
        move_uploaded_file ( $tmpname, APP_PATH. $target_file );

        $rand = rand(0, 10000);
        $imgUrl = $rootLink.$target_file;
        $result = $shopify('PUT', '/admin/themes/'.$themeId.'/assets.json', array('asset' => array('key' => 'assets/'.$rand.'_'.$filename.'', 'src' => $imgUrl)));
        unlink(APP_PATH . $target_file);
        if(isset($result['public_url'])) {
            $url = $result['public_url'];
            $sql = "insert into holiday_events_images(url, name, shop) values('".$url."', '".$filename."', '".$shop."')";
            $db->query($sql);
            $success = true;
        }
        echo json_encode($success);
    } else {
        echo json_encode($success);
    }
}
function deleteCustomImage($db, $shop, $shopify, $id, $name) {
    $sql = 'delete from holiday_events_images where id = "'. $id.'" and shop = "'.$shop.'"';
    $db->query($sql);
    $themeId = getMainTheme($shopify);
    if ($id) {
        $result = $shopify('DELETE', '/admin/themes/' . $themeId . '/assets.json', array('asset' => array('key' => 'assets/' . $name)));
    }
}
function getShopSettings($db, $shop) {
    $sql = "SELECT * FROM holiday_effects_settings WHERE shop = '$shop'";
    $query = $db->query($sql);
    $settings = array();
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            $settings = $row;
        }
    }
    return $settings;
}
function getAllEvents($shop) {
    $data = db_fetch_array("SELECT * FROM holiday_events_effects WHERE shop = '$shop'");
    if (!empty($data)) {
        foreach ($data as $key => &$row) {
            $row["event_name"] = $row["event_name"];
            $row["start_date"] = date("m/d/Y H:i", strtotime($row["start_date"]));
            $row["end_date"] = date("m/d/Y H:i", strtotime($row["end_date"]));
        }
        return $data;
    } else {
        return array();
    }
}
function getShopCustomImages($shop) {
    $data = db_fetch_array("SELECT * FROM holiday_events_images WHERE shop = '$shop'");
    if (!empty($data)) {
        return $data;
    } else {
        return array();
    }
}