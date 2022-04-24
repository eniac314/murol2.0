<?php
include 'utils.php';
ini_set('session.use_cookies', '0');
session_start();
$id = session_id();

if((getenv('REQUEST_METHOD') == 'POST')) {
  
  $json_data = file_get_contents("php://input");
	
  $php_data = json_decode($json_data);
  
  if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
  }

  if(!isset($php_data->username) || !isset($php_data->password)){
  	logError("wrong input");
   	exit();
  }
    
  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $stmt  = mysqli_stmt_init($db);
  
  $getLogInfoQuery = "SELECT password, salt FROM users WHERE name = ?";
  mysqli_stmt_prepare($stmt, $getLogInfoQuery);
  mysqli_stmt_bind_param($stmt,'s', $php_data->username);
  mysqli_stmt_execute($stmt);
  mysqli_stmt_bind_result($stmt, $hashedPass, $salt);

  if (!mysqli_stmt_fetch($stmt)){
    logError("Wrong username/password");
    mysqli_close($db);
    exit();
  }

  if (hash('sha256', $php_data->username.$php_data->password.$salt) !== $hashedPass){
    sleep (2);
  	logError("Wrong username/password");
  	mysqli_close($db);
  	exit();
  }  
  
  mysqli_close($db);

  $_SESSION['logInfo']['username'] = $php_data->username;
  
  // ini_set('session.use_cookies', '0');
  // session_id($php_data->sessionId);
  // session_start();

  // if (!isset($_SESSION['logInfo']['username'])){
  //   logError("wrong credentials");
  //   exit();
  // }
  
  $result = array('username' => $php_data->username
                 ,'sessionId' => $id
                 );

  $toJson = json_encode($result);
  echo $toJson;
  exit();
} 

elseif((getenv('REQUEST_METHOD') == 'GET') && isset($_SESSION['logInfo']['username'])){
  //check if already logged in
    
  $result = array('username' => $_SESSION['logInfo']['username']
                 ,'sessionId' => session_id()
                 );

  $toJson = json_encode($result);
  echo $toJson;
  exit();
} 

else {
  $result = array('notLoggedIn' => 'true');
  echo (json_encode($result));
  exit();
}
?>