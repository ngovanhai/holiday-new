<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
require 'vendor/autoload.php';

use sandeepshetty\shopify_api;

require 'help.php';

$app_settings = db_fetch_row("SELECT * FROM tbl_appsettings WHERE id = $appId");
if (!empty($_GET['shop'])) {
    $shop = $_GET['shop']; //shop-name.myshopify.com
    $select_store = db_fetch_row("SELECT * FROM tbl_usersettings WHERE store_name = '$shop' and app_id = $appId");
    echo $select_store;
    if (count($select_store) > 0) {
        //   check check_expired
        $check = check_expired($shop, $appId);
        if ($check == 1) {
            header('Location: ' . $rootLink . '/chargeRequire.php');
        }
        echo $rootLink . '/admin/client/build?shop=' . $shop;
        if (shopify_api\is_valid_request($_GET, $app_settings['shared_secret'])) { //check if its a valid request from Shopify  
            // header('Location: ' . $rootLink . '/admin/client/build?shop=' . $shop);
            header('Location: ' . $rootLink . '/admin/client/build?shop=' . $shop);
        }
    } else {

        $permissions = $app_settings['permissions'];

        //get the permission url
        $permission_url = shopify_api\permission_url(
            $_GET['shop'],
            $app_settings['api_key'],
            $permissions
        );
        $permission_url .= '&redirect_uri=' . $app_settings['redirect_url'];
        header('Location: ' . $permission_url); //redirect to the permission url
    }
}
