<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->contentId)){
     logError("wrong input");
  exit();
  }
  
  $allowedPath = getcwd().'/pages/contents';
  $destPath = realpath('./pages/contents'.$php_data->contentId);
  
  if(strpos($destPath, $allowedPath) !== 0 || strpos($destPath, $allowedPath) === false){ 
    logError("invalid path");
    exit();
  } 

  $content = file_get_contents($destPath);

  if (!$content){
    logError("impossible de charger la page");
    exit(); 
  }  
  
  $res = array('contentId' => $php_data->contentId
              ,'jsonContent' => json_decode($content)
              );


  echo (json_encode($res));
  exit();

 } else {
  logError("invalid request");
  exit();
}

?>