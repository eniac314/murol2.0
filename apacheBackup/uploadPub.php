<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST' && !empty($_FILES['file']) && $_FILES['file']['error'] == 0  && isset($_POST['sessionId']) && isset($_POST['pubType'])) {
  
  ini_set('session.use_cookies', '0');
  session_id($_POST["sessionId"]);
  session_start();

  if (!isset($_SESSION['logInfo']['username'])){
    logError("wrong credentials");
    exit();
  }

  $pubType = $_POST['pubType'];
  $file = $_FILES['file']['tmp_name'];
  $name = $_POST['name'];

  
  if ($pubType == 'murolInfo'){
    $baseDir =  getcwd().'/baseDocumentaire/publications/murolInfos';
  } else if ($pubType == 'delib'){
    $baseDir =  getcwd().'/baseDocumentaire/publications/delibs';
  } else if ($pubType == 'bulletin'){
    $baseDir =  getcwd().'/baseDocumentaire/publications/bulletins';
  } else {
    logError("wrong pubType");
    exit();
  }

  $uploadPath = $baseDir.'/'.$name;
  $checkPath = realpath(pathinfo($uploadPath)['dirname']);

  if(strpos($checkPath, $baseDir) !== 0 || strpos($checkPath, $baseDir) === false){ 
    logError("invalid upload path");
    exit();
  } 

  if(!move_uploaded_file($file, $uploadPath)){
    logError("file upload failed");
    exit();
  }

  logger("done!");
  exit();

  } else {
  logError($_FILES['file']['error']);
  exit();
}

?>