<?php
$url='https://calendarific.com/api/v2/holidays?&api_key=cd88897097552e4674aa9ad068b7b4ec7612675b&country='.$_REQUEST['countryCode'].'&year='.date("Y");
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