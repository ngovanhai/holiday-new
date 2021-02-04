<?php
header('Set-Cookie: same-site-cookie=foo; SameSite=Lax');
header('Set-Cookie: cross-site-cookie=bar; SameSite=None; Secure');
use sandeepshetty\shopify_api;
require 'vendor/autoload.php';
require 'conn-shopify.php';

if (isset($_GET['shop'])) {
    $shop = $_GET['shop'];
} else {
    ?>
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <script src="https://cdn.shopify.com/s/assets/external/app.js"></script>

    </head>
    <div class="container">
        <h1 class="page-heading">Input your shop name to continue: </h1>
        <form class="form-inline">
            <input type="text" style="width: 500px" class="inputShop form-control">
            <button class="btn btn-primary submitShop" type="submit">Continue</button>
        </form>
    </div>
    <script>
        $('.submitShop').click(function (e) {
        e.preventDefault();
        window.location = 'https://' + $('.inputShop').val() + '/admin/api/auth?api_key=<?php echo $apiKey; ?>';
        });</script>
    <?php
    die();
}

$shop_data = $db->query("select * from tbl_usersettings where store_name = '" . $shop . "' and app_id = $appId");
$shop_data = $shop_data->fetch_object();
$installedDate = $shop_data->installed_date;
$confirmation_url = $shop_data->confirmation_url;
$clientStatus = $shop_data->status;

$date1 = new DateTime($installedDate);
$date2 = new DateTime("now");
$interval = date_diff($date1, $date2);
$diff = (int) $interval->format('%R%a');
if ($clientStatus != 'active') {
    header('Location: ' . $rootLink . '/chargeRequire.php?shop=' . $shop);
} else {

    $select_settings = $db->query("SELECT * FROM tbl_appsettings WHERE id = $appId");
    $app_settings = $select_settings->fetch_object();
    $shop_data = $db->query("select * from tbl_usersettings where store_name = '" . $shop . "' and app_id = $appId");
    $shop_data = $shop_data->fetch_object();
    $shopify = shopify_api\client(
            $shop, $shop_data->access_token, $app_settings->api_key, $app_settings->shared_secret
    );
    $shopInfo = $shopify("GET", "/admin/shop.json");
    ?>
    <!DOCTYPE html>
    <head>
        <title>Holiday Effects Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css'>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,300|Roboto:300,400,500,700,400italic|Material+Icons&font-display=swap">
        <link rel="stylesheet" href="admin/lib/vue-material.min.css">
        <link rel="stylesheet" href="admin/lib/vue2Dropzone.css">
        <link rel="stylesheet" href="admin/lib/default.css">
        <link rel="stylesheet" href="admin/lib/flatpickr.min.css">
        <link rel="stylesheet" href="admin/lib/buefy.min.css">
        <link rel="stylesheet" type="text/css" href="admin/styles/appStyles.css?v=<?php echo time(); ?>">
        <script async src="https://apps.omegatheme.com/helpdesk/plugin.js?appId=34&v=<?php echo time(); ?>"></script>
        <script src="admin/lib/jquery.min.js"></script>
    </head>
    <body>
        <p class="noteWrap"><span style="color:red"><strong>Note:</strong></span> You must configure the application before use, please refer to how to configure <a href="guide.html" target="_blank">here</a>, or contact us  <a href="mailto:contact@omegatheme.com" target="_top">contact@omegatheme.com</a> to get help for free!<a href="#" class="closeNote">Close X</a></p>
        <?php require 'admin/review/star.php'; ?>
        <div layout-padding style="width: 100%">
            <toaster-container></toaster-container>
            <div id="holidayEffectApp">
                <div class="page-container">
                    <event-lists :choose-icons='chooseIcons' :choose-images='chooseImages' :booktake-images="booktakeImages" :choose-frames='chooseFrames'></event-lists>
                </div>
            </div>
            <div class="app-footer">
                <div class="footer-header">Some other sweet <strong>Omega</strong> apps you might like! <a target="_blank" href="https://apps.shopify.com/partners/developer-30c7ea676d888492">(View all app)</a></div>
                <div class="omg-more-app">
                    <div>
                        <p><a href="https://apps.shopify.com/quantity-price-breaks-limit-purchase" target="_blank"><img alt="Quantity Price Breaks by Omega" src="https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/5143/splash.png?1452220345"></a></p>
                    </div>
                    <div>
                        <p><a href="https://apps.shopify.com/facebook-reviews-1" target="_blank"><img alt="Facebook Reviews by Omega" src="https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/13331/splash.png?1499916138"></a></p>
                    </div>
                    <div>
                        <p><a href="https://apps.shopify.com/order-tagger-by-omega" target="_blank"><img alt="Order Tagger by Omega" src="https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/17108/splash.png?1510565540"></a></p>
                    </div>
                </div>
                <div class="footer-copyright">©2018 <a href="https://www.omegatheme.com/" target="_blank">Omegatheme</a> All Rights Reserved.</div>
            </div>
        </div>
        <?php include 'facebook-chat.html'; ?>
        <script src="https://cdn.shopify.com/s/assets/external/app.js"></script>
        <script type="text/javascript" src="admin/lib/bootstrap.min.js"></script>

        <script type="text/javascript">
            ShopifyApp.init({
              apiKey: '<?php echo $apiKey; ?>',
              shopOrigin: 'https://<?php echo $shop; ?>',
            });
            ShopifyApp.ready(function(){
                ShopifyApp.Bar.initialize({
                });
            });
        </script>
        <script>
            $(".closeNote").click(function (e) {
                e.preventDefault();
                $(".noteWrap").hide();
            });
            $(".refreshCharge").click(function (e) {
                e.preventDefault();
                $.get("recharge.php?shop=<?php echo $shop; ?>", function (result) {
                    location.href = result;
                });
            });
            window.shop = "<?php echo $shop; ?>";
            window.rootLink = "<?php echo $rootLink; ?>";
        </script>
        <script type="text/javascript" src="admin/lib/flatpickr.js"></script>
        <script type="text/javascript" src="admin/lib/vue.js"></script>
        <script type="text/javascript" src="admin/lib/vue-flatpickr.js"></script>
        <script type="text/javascript" src="admin/lib/httpVueLoader.js"></script>
        <script type="text/javascript" src="admin/lib/vue-resource.min.js"></script>
        <script type="text/javascript" src="admin/lib/vue-material.min.js"></script>
        <script type="text/javascript" src="admin/lib/axios.min.js"></script>
        <script type="text/javascript" src="admin/lib/buefy.min.js"></script>
        <script type="text/javascript" src="admin/lib/vue2Dropzone.js"></script>
        <script type="text/javascript" src="admin/scripts/main.js?v=<?php echo time(); ?>"></script>
    </body>
<?php } ?>

