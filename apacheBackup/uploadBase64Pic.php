<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
  $json_data = file_get_contents("php://input");

  $php_data = json_decode($json_data);

  if (is_null($php_data)){
    logError("json data could not be decoded");
    exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->filename) || !isset($php_data->uploadPath) || !isset($php_data->contents)){
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

  $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $php_data->contents));

  $uploaddir = getcwd().'/images';
  $uploadPath = $uploaddir.'/'.$php_data->uploadPath.'/'.$php_data->filename;
  $checkPath = realpath(pathinfo($uploadPath)['dirname']);

  if(strpos($checkPath, $uploaddir) !== 0 || strpos($checkPath, $uploaddir) === false){ 
    logError($uploadPath);
    logError($uploaddir);
    logError("invalid upload path");
    exit();
  } 


  if(!file_put_contents($uploadPath, $data)){
    logError("File upload failed");
    exit();
  }

  $files = getDirContents('images');
  echo (json_encode($files));
  exit();

} else {
  logError("invalid request");
}

?>

