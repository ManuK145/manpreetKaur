<?php
$url='https://newsdata.io/api/1/news?apikey=pub_1946145e3dca821d1df2b38a61aaa4e7fa932&country='.$_REQUEST['countryCode'];
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);
$result=curl_exec($ch);
curl_close($ch);
$decode = json_decode($result,true);	
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data'] = $decode;
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>