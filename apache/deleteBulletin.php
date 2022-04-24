<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
  $json_data = file_get_contents("php://input");

  $php_data = json_decode($json_data);

  if (is_null($php_data)){
    logError("json data could not be decoded");
    exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->issue) || !isset($php_data->name) || !isset($php_data->cover)){
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

  $issue = $php_data->issue;
  $cover = $php_data->cover;
  $name  = $php_data->name; 

  $baseDir =  getcwd().'/baseDocumentaire/publications/bulletins';

  $path = $baseDir.'/'.$name;
  $checkPath = realpath(pathinfo($path)['dirname']);

  if(strpos($checkPath, $baseDir) !== 0 || strpos($checkPath, $baseDir) === false){ 
    logError("invalid path");
    exit();
  }

  if(file_exists($path)) {
    unlink($path);
  } else { 
    logError("requested file not found");
    exit(); 
  } 

  $baseDir =  getcwd().'/baseDocumentaire/publications/bulletins/miniatures';

  $path = $baseDir.'/'.$cover;
  $checkPath = realpath(pathinfo($path)['dirname']);

  if(strpos($checkPath, $baseDir) !== 0 || strpos($checkPath, $baseDir) === false){ 
    logError("invalid path");
    exit();
  }

  if(file_exists($path)) {
    unlink($path);
  } else { 
    logError("requested file not found");
    exit(); 
  } 

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $query = "DELETE FROM bulletins WHERE issue = ?";
  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_bind_param($stmt,'s', $issue);
  mysqli_stmt_execute($stmt);

  if (mysqli_stmt_affected_rows($stmt) == 0){
    logError("impossible d'effacer le bulletin");
    mysqli_close($db);
    exit();
  }
  
  logger("success!");
  mysqli_close($db);
  exit();



} else {
  logError("invalid request");
  exit();
}

?>