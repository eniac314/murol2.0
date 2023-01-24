<?php
include 'utils.php';
require './vendor/autoload.php';
error_reporting(E_ERROR | E_PARSE);
use \ForceUTF8\Encoding;

if(getenv('REQUEST_METHOD') == 'GET') {

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
    array_push($keywords, [ 'keyword' => Encoding::fixUTF8($keyword)
                          , 'contentId' => $contentId 
                          ]);
    
  }

  $query = "DELETE FROM keywords";
  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  $query = "INSERT INTO keywords(keyword, contentId) VALUES (?,?)
    ON DUPLICATE KEY UPDATE
    keyword = VALUES(keyword),
    contentId = VALUES(contentId)
    ";
  // mysqli_stmt_prepare($stmt, $query);

  foreach ($keywords as $k) {
    mysqli_stmt_prepare($stmt, $query);
    mysqli_stmt_bind_param($stmt, 'ss', $k['keyword'], $k['contentId']);
  mysqli_stmt_execute($stmt);
  }

  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>