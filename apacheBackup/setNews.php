<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->news)){
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

  

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $uuid = $php_data->uuid;
  $date = $php_data->date;
  $title = $php_data->title;
  $content = serialize($php_data->content);
  $pic = is_null($php_data->pic) ? null : serialize($php_data->pic);
  $expiry = $php_data->expiry;

  $query = 
    "INSERT INTO news(uuid, date, title, content, pic, expiry) VALUES (?,?,?,?,?,?,?)";
    mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_bind_param($stmt,'sdsssd', $uuid, $date, $content, $pic, $expiry);
  mysqli_stmt_execute($stmt);

  if (mysqli_stmt_affected_rows($stmt) == 0){
    logError("impossible de créer l'actualité");
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