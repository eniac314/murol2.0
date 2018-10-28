<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  $pageTree = file_get_contents('./pages/pageTree');

  if (!$pageTree){
    logError("impossible de charger l'arborescence du site");
    mysqli_close($db);
    exit(); 
  }  
  
  echo $pageTree;
  exit();

 } else {
  logError("invalid request");
  exit();
}

?>