<?php
    $url='https://newsdata.io/api/1/news?apikey=pub_1946145e3dca821d1df2b38a61aaa4e7fa932&country='.$_REQUEST['countryCode'];
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    try {
        $result = curl_exec($ch);
        if ($result === false) {
            if(curl_errno($ch) == CURLE_COULDNT_CONNECT || curl_errno($ch) == CURLE_OPERATION_TIMEOUTED) {
                throw new Exception("Couldn't connect to server");
            } else {
                throw new Exception("News for ".$_REQUEST['countryName']." Not Available");
            }
        }

        $decode = json_decode($result, true);
        if ($decode === null) {
            throw new Exception('Couldnt Fetch News Data');
        }

        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['data'] = $decode;
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    } 
    catch (Exception $e) {
        $output['status']['code'] = $e->getCode();
        $output['status']['name'] = "error";
        $output['status']['description'] = $e->getMessage();
        $output['data'] = null;
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }

    curl_close($ch);
?>