<?php
$url = 'https://userclub.opendatasoft.com/api/records/1.0/search/?dataset=world-heritage-list&q='.$_REQUEST['countryName'].'&lang=en&sort=date_inscribed&facet=category&facet=region&facet=states';
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
$output['data']['unescoSites'] = $decode;
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>