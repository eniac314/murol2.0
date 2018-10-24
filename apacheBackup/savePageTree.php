<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->pageTree)){
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

  if (!file_put_contents('./pages/pageTree', json_encode($php_data->pageTree))){
    logError("impossible de mettre à jour l'arborescence du site");
    exit(); 
  }  
  
  logger("success!");
  exit();

 } else {
  logError("invalid request");
}

?>