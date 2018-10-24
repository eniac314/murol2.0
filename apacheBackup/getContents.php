<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId)){
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
  
  $contents = scandir('./pages/contents');
  
  $results = [];

  foreach ($contents as $value) {
    $path = realpath('./pages/contents/'.$value);
    if(!is_dir($path)){
      $content = file_get_contents($path);
      
      if(!$content){
        logError("impossible de charger la page");
        exit(); 
      }

      $contentId = $value;

      $results[] = 
        array('contentId' => $contentId
             ,'jsonContent' => json_decode($content)
             );
    }
  }

  echo (json_encode($results));

  exit();

 } else {
  logError("invalid request");
}

?>