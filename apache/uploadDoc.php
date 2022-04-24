<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST' && !empty($_FILES['file']) && $_FILES['file']['error'] == 0  && isset($_POST['sessionId']) && isset($_POST['uploadPath'])) {
  
  ini_set('session.use_cookies', '0');
  session_id($_POST["sessionId"]);
  session_start();
  
  if (!isset($_SESSION['logInfo']['username'])){
    logError("wrong credentials");
    exit();
  }

  if(filesize($_FILES['file']['tmp_name']) > 1000000000){
    logError("file is too big: ".filesize($_FILES['file']['tmp_name']));  
    exit();
  } 

  $uploaddir = getcwd().'/baseDocumentaire';
  $uploadPath = $uploaddir.'/'.$_POST['uploadPath'].'/'.$_FILES['file']['name'];
  $checkPath = realpath(pathinfo($uploadPath)['dirname']);

  if(strpos($checkPath, $uploaddir) !== 0 || strpos($checkPath, $uploaddir) === false){ 
    logError($uploadPath);
    logError($uploaddir);
    logError("invalid upload path");
    exit();
  } 
  

  if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploadPath)){
    logError("File upload failed");
    exit();
  }

logger("upload successful");
exit();
}
logError("invalid request");
exit();
?> 