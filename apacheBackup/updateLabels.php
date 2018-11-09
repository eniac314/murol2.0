<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->labels)){
     logError("wrong input");
 	exit();
  }

  ini_set('session.use_cookies', '0');
  session_id($php_data->sessionId);
  session_start();

  if (!isset($_SESSION['logInfo']['username'])){
    logError("wrong credentials");
    exit();
  }

  if (!file_put_contents('./pages/labels', json_encode($php_data->labels))){
    logError("impossible de mettre à jour les labels du site");
    exit(); 
  }  
  
  logger("success!");
  exit();

 } else {
  logError("invalid request");
  exit();
}

?>