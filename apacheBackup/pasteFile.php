<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->root) || !isset($php_data->srcPath) || !isset($php_data->destPath)){
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

  if($php_data->root == 'images'){

    $baseDir = getcwd().'/images';
  
  } else if ($php_data->root == 'baseDocumentaire'){
    
    $baseDir = getcwd().'/baseDocumentaire';
    
  } else {
    logError("invalid root");
    exit();
  } 

  $src = substr($php_data->srcPath, strlen($php_data->root));
  $src = realpath($baseDir . $src); 

  if(strpos($src, $baseDir) !== 0 || strpos($src, $baseDir) === false) { 
    logError("invalid src path");
    exit();
  } 

  $dest = substr($php_data->destPath, strlen($php_data->root));
  $dest = realpath($baseDir . $dest); 

  if(strpos($dest, $baseDir) !== 0 || strpos($dest, $baseDir) === false) { 
    logError("invalid dest path");
    exit();
  } 


  if(file_exists($src) && file_exists($dest)) { 
      
      rename($src,$dest.'/'.basename($src));
      
      $files = getDirContents($php_data->root);
      echo (json_encode($files));
      exit();

  } else { 
    logError("requested file not found");
    exit(); 
  } 


} else {
  logError("invalid request");
  exit();
}

?>