<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
    }

    if(!isset($php_data->sessionId) || !isset($php_data->root) || !isset($php_data->path)){
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

      $baseDir = getcwd().'/';
    
    } else if ($php_data->root == 'baseDocumentaire'){
      
      $baseDir = getcwd().'/';
    
    } else {
      logError("invalid root");
      exit();
    }    

    $path = realpath($baseDir . $php_data->path); 

    if(strpos($path, $baseDir) !== 0 || strpos($path, $baseDir) === false) { 
      logError($path);
      logError("invalid path");
      exit();
    
    } elseif(file_exists($path)) { 
        
        if(is_dir($path)){
          deleteDir($path);
        } else {
          unlink($path);
        }
        
        $files = getDirContents($php_data->root);
        echo (json_encode($files));
        exit();

    } else { 
      logError("requested file not found");
      exit(); 
    } 


} else {
  logError("invalid request");
}

?>