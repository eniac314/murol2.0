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

  

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $query = 
    "SELECT uuid, date, title, content, pic, expiry FROM news";

  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $uuid, $date, $title, $content, $pic, $expiry);

  $news = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($news, ['uuid' => $uuid
                      ,'date' => $date
                      ,'title' => $title
                      ,'content' => is_null($content) ? $content : json_decode($content)
                      ,'pic' => is_null($pic) ? $pic : json_decode($pic)
                      ,'expiry' => $expiry
                      ]);
  }

  $toJson = json_encode($news);
  echo $toJson;
  
  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>
