<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
    }

    if(!isset($php_data->sessionId) || !isset($php_data->root)){
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

      $images = 
  		  getDirContents('images');
      
      echo (json_encode($images));
      exit();
    
    } else if ($php_data->root == 'baseDocumentaire'){
    	$docs = 
    	  getDirContents('baseDocumentaire');
     	
     	echo (json_encode($docs));
     	exit();
    } else {
      logError("invalid root");
      exit();
    }

} else {
  logError("invalid request");
  exit();
}

?>

