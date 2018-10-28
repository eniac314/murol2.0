<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->content) || !isset($php_data->contentId)){
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
  
  $allowedPath = getcwd().'/pages/contents';
  $savePath = $allowedPath.'/'.$php_data->contentId;
  $checkPath = realpath(pathinfo($savePath)['dirname']);
  
  if(strpos($checkPath, $allowedPath) !== 0 || strpos($checkPath, $allowedPath) === false){ 
    logError($checkPath);
    logError($savePath);
    logError("invalid save path");
    exit();
  } 
  

  if (!file_put_contents($savePath, json_encode($php_data->content))){
    logError("impossible de sauvegarder la page");
    exit(); 
  }  
  
  logger("success!");
  exit();

 } else {
  logError("invalid request");
  exit();
}

?>