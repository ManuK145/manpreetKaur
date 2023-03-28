<?php
$req_url = 'https://v6.exchangerate-api.com/v6/f8a923e10ede2bd3b17f3497/latest/USD';
$response_json = file_get_contents($req_url);
$currencyCode = $_REQUEST['currencyCode'];
$response = json_decode($response_json);
$base_price = 1;
$conversion = round(($base_price * $response->conversion_rates->$currencyCode),2);
$output['data'] = $conversion;
echo json_encode($output);
?>