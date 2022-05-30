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

  $query = 
    "SELECT uuid, date, title, content, pic, expiry FROM news";

  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $uuid, $date, $title, $content, $pic, $expiry);

  $news = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($news, ['uuid' => $uuid
                      ,'date' => $date
                      ,'title' => Encoding::fixUTF8($title)
                      ,'content' => $content
                      ,'pic' => $pic
                      ,'expiry' => $expiry
                      ]);
  }

  $query = 
    "INSERT INTO news(uuid, date, title, content, pic, expiry) VALUES (?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        date = VALUES(date),
        title = VALUES(title),
        content = VALUES(content),
        pic = VALUES(pic),
        expiry = VALUES(expiry)";

  mysqli_stmt_prepare($stmt, $query);

  foreach ($news as $n) {

    $newContent = json_encode($n['content']);
    $newPic = json_encode($n['pic']);
    
    mysqli_stmt_bind_param($stmt,'sisssi', $n['uuid'], $n['date'], $n['title'], $n['content'], $n['pic'], $n['expiry']);
    mysqli_stmt_execute($stmt);
  }

  
  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>
