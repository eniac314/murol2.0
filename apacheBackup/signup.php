<?php
include 'utils.php';
ini_set('session.use_cookies', '0');
session_start();
$id = session_id();

if(getenv('REQUEST_METHOD') == 'POST') {

	if (isset($_SESSION['logInfo']['username'])){
	      logError("You are already logged in!");
	      exit();
	}

	$json_data = file_get_contents("php://input");

	$php_data = json_decode($json_data);

	if (is_null($php_data)){
		  logError("json data could not be decoded");
	  exit();
	}

	if(!isset($php_data->username)  || !isset($php_data->password)){
			logError("wrong input");
			exit();
		}

	$db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);

	if (mysqli_connect_errno()){
		logError('Could not connect to database');
	exit();
		}

	$username = $php_data->username;
	$password = $php_data->password;

	$salt = md5(uniqid(mt_rand(), true));
	$hash = hash('sha256', $username.$password.$salt);
	$ip   = $_SERVER['REMOTE_ADDR'];
    
    $stmt  = mysqli_stmt_init($db);
  
	$query = "SELECT name FROM users WHERE name = ?";
	mysqli_stmt_prepare($stmt, $query);
	mysqli_stmt_bind_param($stmt,'s', $username);
	mysqli_stmt_execute($stmt);
	 
	if (mysqli_stmt_fetch($stmt)){
	  logError("This username is already in use");
	  mysqli_close($db);
	  exit();
	}

	$query = "INSERT INTO users(name, password, salt, ip) VALUES (?, ?, ?, ?)";

    mysqli_stmt_prepare($stmt, $query);
    mysqli_stmt_bind_param($stmt,'ssss',$username, $hash, $salt, $ip);
    mysqli_stmt_execute($stmt);

    if (mysqli_stmt_affected_rows($stmt) == 0){
	  logError("Data was not inserted into database");
	  mysqli_close($db);
      exit();
    }

    $result = array('signUpComplete' => true);
    echo (json_encode($result));


    mysqli_close($db);
    exit();

}
