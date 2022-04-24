<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }
  
  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $query = "SELECT keyword, contentId FROM keywords";
  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);
  mysqli_stmt_bind_result($stmt, $keyword, $contentId);
  
  $keywords = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($keywords, [ 'keyword' => $keyword
                          , 'contentId' => $contentId 
                          ]);

  }

  $toJson = json_encode($keywords);
  echo $toJson;

  mysqli_close($db);
  exit();
  
 } else {
  logError("invalid request");
  exit();
}

?>