<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
  $json_data = file_get_contents("php://input");

  $php_data = json_decode($json_data);

  if (is_null($php_data)){
    logError("json data could not be decoded");
    exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->delib)){
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

  $date  = $php_data->delib->date;
  $index = json_encode($php_data->delib->index);

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $query = 
    "INSERT INTO delibs( date, index_) VALUES 
    (?,?)
    ON DUPLICATE KEY UPDATE
     index_ = VALUES(index_)";
     
  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_bind_param($stmt,'is', $date, $index);
  mysqli_stmt_execute($stmt);

  if (mysqli_stmt_affected_rows($stmt) == 0){
    logError("impossible de sauvegarder delib");
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