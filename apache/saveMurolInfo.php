<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
  $json_data = file_get_contents("php://input");

  $php_data = json_decode($json_data);

  if (is_null($php_data)){
    logError("json data could not be decoded");
    exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->murolInfo)){
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

  $issue = $php_data->murolInfo->issue;
  $date  = $php_data->murolInfo->date;
  $topics = json_encode($php_data->murolInfo->topics);

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $query = 
    "INSERT INTO murolInfos(issue, date, topics) VALUES 
    (?,?,?)
    ON DUPLICATE KEY UPDATE
     date = VALUES(date),
     topics = VALUES(topics)";
     
  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_bind_param($stmt,'sis', $issue, $date, $topics);
  mysqli_stmt_execute($stmt);

  if (mysqli_stmt_affected_rows($stmt) == 0){
    logError("impossible de sauvegarder murol info");
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


