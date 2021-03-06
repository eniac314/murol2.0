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

  $query = 
    "SELECT issue, date, topics FROM murolInfos";

  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $issue, $date, $topics);

  $murolInfos = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($murolInfos, ['issue' => $issue
                            ,'date' => $date
                            ,'topics' => json_decode($topics)
                            ]);
  }

  $query = 
    "SELECT date, index_ FROM delibs";

  mysqli_stmt_prepare($stmt, $query);
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $date, $index_);
  
  $delibs = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($delibs, ['date' => $date
                        ,'index' => json_decode($index_)
                        ]);
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
                           ,'index' => json_decode($index_)
                           ]);
  }

  $result = 
      ['murolInfos' => $murolInfos 
      ,'delibs' => $delibs
      ,'bulletins' => $bulletins
      ];

  $toJson = json_encode($result);
  echo $toJson;
  
  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>






