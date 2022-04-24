<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->contentId)){
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
  
  $allowedPath = getcwd().'/pages/contents';
  $contentPath = realpath($allowedPath.'/'.$php_data->contentId);
  
  if(strpos($contentPath, $allowedPath) !== 0 || strpos($contentPath, $allowedPath) === false){ 
    logError("invalid  path");
    mysqli_close($db);
    exit();
  } 
  
  if(file_exists($contentPath)){
    unlink($contentPath);
    
    $query = "DELETE FROM keywords WHERE contentId = ?";
    mysqli_stmt_prepare($stmt, $query);
    mysqli_stmt_bind_param($stmt,'s', $php_data->contentId);
    mysqli_stmt_execute($stmt);
    mysqli_close($db);

    logger("success!");
    exit();
  }

  logError("pas de fichier correspondant");
  mysqli_close($db);
  exit();

 } else {
  logError("invalid request");
  exit();
}

?>