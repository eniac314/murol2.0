<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
  $json_data = file_get_contents("php://input");

  $php_data = json_decode($json_data);

  if (is_null($php_data)){
    logError("json data could not be decoded");
    exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->bulletin) || !isset($php_data->name)){
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
  
  $name  = $php_data->name; 
  $issue = $php_data->bulletin->issue;
  $date  = $php_data->bulletin->date;
  $index = json_encode($php_data->bulletin->index);

  if(!is_null($php_data->bulletin->cover)){

    $cover = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $php_data->bulletin->cover));

    $baseDir =  getcwd().'/baseDocumentaire/publications/bulletins/miniatures';

    $uploadPath = $baseDir.'/'.$name;
    $checkPath = realpath(pathinfo($uploadPath)['dirname']);

    if(strpos($checkPath, $baseDir) !== 0 || strpos($checkPath, $baseDir) === false){ 
      logError("invalid upload path");
      exit();
    }

    if(!file_put_contents($uploadPath, $cover)){
      logError("File upload failed");
      exit();
    }
  }

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $query = 
    "INSERT INTO bulletins( issue, date, index_) VALUES 
    (?,?,?)
    ON DUPLICATE KEY UPDATE
     date = VALUES(date),
     index_ = VALUES(index_)";
     
  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_bind_param($stmt,'sis', $issue, $date, $index);
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