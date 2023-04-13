<?php
$url='https://airlabs.co/api/v9/airports?country_code='.$_REQUEST['countryCode'].'&api_key=3c2f24e5-0a6e-4664-9cdf-cd0a3fd6a870';
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