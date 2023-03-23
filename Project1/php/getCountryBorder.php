<?php
   $result = file_get_contents("../countryBorders.geo.json");
   $decode = json_decode($result,true);
   $countryBorder;
   for ($i = 0; $i < count($decode[0]['features']); $i++) {
       if($decode[0]['features'][$i]['properties']['iso_a2'] == $_REQUEST['iso']){
           $countryBorder = $decode[0]['features'][$i];//['geometry'];
		   /*$output['data'] = $countryBorder;
		   header('Content-Type: application/json; charset=UTF-8');
		   echo json_encode($output);
		   exit;*/
       }
   }
   $output['data'] = $countryBorder;
   header('Content-Type: application/json; charset=UTF-8');
   echo json_encode($output); 
?>