<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
  $json_data = file_get_contents("php://input");

  $php_data = json_decode($json_data);

  if (is_null($php_data)){
    logError("json data could not be decoded");
    exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->filename) || !isset($php_data->title) || !isset($php_data->contents)){
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

  $thumbData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $php_data->thumb));



  $baseDir = getcwd().'/images/phototheque';
  $uploaddir = $baseDir.'/'.$php_data->title;

  
  if(!file_exists($uploaddir)){

     $dest = realpath(pathinfo($uploaddir)['dirname']);
      if(strpos($dest, $baseDir) !== 0 || strpos($dest, $baseDir) === false) { 
         logError('invalid folder upload path');
         exit();
      } 
     
     mkdir($uploaddir);
     mkdir($uploaddir.'/thumbs');

     if (!is_null($php_data->HDef)){
        mkdir($uploaddir.'/HQ');
     }
  }

  $uploadPath = $uploaddir.'/'.$php_data->filename;
  $checkPath = realpath(pathinfo($uploadPath)['dirname']);

  if(strpos($checkPath, $uploaddir) !== 0 || strpos($checkPath, $uploaddir) === false){ 
    logError("invalid upload path");
    exit();
  } 


  if(!file_put_contents($uploadPath, $data)){
    logError("File upload failed");
    exit();
  }

  if(!file_put_contents($uploaddir.'/thumbs/'.$php_data->filename, $thumbData)){
    logError("Thumb upload failed");
    exit();
  }

  if (!is_null($php_data->HDef)){
        $HDef = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $php_data->HDef));
        if(!file_put_contents($uploaddir.'/HQ/'.$php_data->filename, $HDef)){
          logError("HDef upload failed");
          exit();
        }
  }

  logger("done!");
  exit();
  
  } else {
  logError("invalid request");
  exit();
}

?>


  

