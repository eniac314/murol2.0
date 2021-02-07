<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'GET') {

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $query = 
    "SELECT issue, date, topics FROM murolInfos";

  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $issue, $date, $topics);

  $murolInfos = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($murolInfos, ['issue' => $issue
                            ,'date' => $date
                            ,'topics' => unserialize($topics)
                            ]);
  }



  $query = 
    "INSERT INTO murolInfos(issue, date, topics) VALUES 
    (?,?,?)
    ON DUPLICATE KEY UPDATE
     date = VALUES(date),
     topics = VALUES(topics)";
     
  mysqli_stmt_prepare($stmt, $query);

  foreach ($murolInfos as $mi) {
    $newTopics = json_encode($mi['topics']);
    mysqli_stmt_bind_param($stmt,'sis', $mi['issue'], $mi['date'], $newTopics);
    mysqli_stmt_execute($stmt);
  }


  $query = 
    "SELECT date, index_ FROM delibs";

  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $date, $index_);
  
  $delibs = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($delibs, ['date' => $date
                        ,'index' => unserialize($index_)
                        ]);
  }

  $query = 
    "INSERT INTO delibs( date, index_) VALUES 
    (?,?)
    ON DUPLICATE KEY UPDATE
     index_ = VALUES(index_)";
     
  mysqli_stmt_prepare($stmt, $query);

  foreach ($delibs as $d) {
    $newIndex = json_encode($d['index']);
    mysqli_stmt_bind_param($stmt,'is', $d['date'], $newIndex);
    mysqli_stmt_execute($stmt);
  }


  $query = 
    "SELECT issue, date,  index_ FROM bulletins";

  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $issue, $date, $index_);

  $bulletins = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($bulletins, ['issue' => $issue
                           ,'date' => $date
                           ,'index' => unserialize($index_)
                           ]);
  }

  $query = 
    "INSERT INTO bulletins( issue, date, index_) VALUES 
    (?,?,?)
    ON DUPLICATE KEY UPDATE
     date = VALUES(date),
     index_ = VALUES(index_)";
     
  mysqli_stmt_prepare($stmt, $query);

  foreach ($bulletins as $b) {
    $newIndex = json_encode($b['index']);
    mysqli_stmt_bind_param($stmt,'sis', $b['issue'], $b['date'], $newIndex);
    mysqli_stmt_execute($stmt);
  }

  
  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>






