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
   
   $images = 
   		getDirContents('images');
   	echo (json_encode($images));
   
   exit();

} else {
  logError("invalid request");
}

function getDirContents($dir, &$results = array()){
    $files = scandir($dir);

    foreach($files as $key => $value){
        $path = realpath($dir.DIRECTORY_SEPARATOR.$value);
        if(!is_dir($path)) {
            $results[] = 
            	array('name' => $value
            	     , 'path' => substr($path, 1 + strlen(getcwd()), strlen($path) - 1 - strlen(getcwd())));
        } else if($value != "." && $value != "..") {
            getDirContents($path, $results);
        }
    }

    return $results;
    }

?>

