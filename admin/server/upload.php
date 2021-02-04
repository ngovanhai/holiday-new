<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods:  GET, POST");
date_default_timezone_set('UTC');
header('Content-Type: application/json');
require '../../vendor/autoload.php';
require '../../help.php';


if (isset($_FILES['uploadframe'])) {
    $fileName = $_FILES['uploadframe']['name'];
    $tempname = $_FILES["uploadframe"]["tmp_name"];
    $folder = "image/" . $fileName;
    move_uploaded_file($tempname, $folder);
    $sql = db_insert('holiday_events_frames', [
        "url" => $folder,
        "name" => $fileName,
        "shop" => "ngo-van-hai.myshopify.com",
    ]);
    echo json_encode("upload frame success !");
}
