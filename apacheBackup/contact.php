<?php  

include 'utils.php';

if((getenv('REQUEST_METHOD') == 'POST')) {
  
  $json_data = file_get_contents("php://input");
	
  $php_data = json_decode($json_data);
  
  if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
  }

  if(!isset($php_data->message) || !isset($php_data->email) || !isset($php_data->name) || !isset($php_data->company) || !isset($php_data->phone) || !isset($php_data->topic) || !isset($php_data->captchaResponse)){
  	logError("wrong input");
   	exit();
  }
  
  $name    = $php_data->name;
  $company = $php_data->company;
  $phone   = $php_data->phone;
  $topic   = $php_data->topic;
  $message = $php_data->message;
  $email   = $php_data->email;
  $ip      = $_SERVER['REMOTE_ADDR'];
  $captcha = $php_data->captchaResponse;
  $secret  = '6LcasjsUAAAAALAv5y51XZbCAt2ShgdN1JXhHS01';

  function isValid($captcha, $secret) 
  {
      try {
  
          $url = 'https://www.google.com/recaptcha/api/siteverify';
          $data = ['secret'   => $secret,
                   'response' => $captcha,
                   'remoteip' => $_SERVER['REMOTE_ADDR']];

          $options = [
              'http' => [
                  'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                  'method'  => 'POST',
                  'content' => http_build_query($data) 
              ]
          ];

          $context  = stream_context_create($options);
          $result = file_get_contents($url, false, $context);
          return json_decode($result);
      }
      catch (Exception $e) {
          return $e;
      }
  }
  
  $captchaValidation = isValid($captcha, $secret);
  

  if (!($captchaValidation->success)){
    logError("the captcha validation process failed: ");
    exit();
  }

 //  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);

 //  if (mysqli_connect_errno()){
 //    logError('Could not connect to database');
 //    exit();
 //  }

 //  $stmt  = mysqli_stmt_init($db);

 //  $query = "INSERT INTO contact(contactId, message, email, ip) VALUES (UNHEX(REPLACE(UUID(),'-','')),?,?,?)";
 //  mysqli_stmt_prepare($stmt, $query);  
 //  mysqli_stmt_bind_param($stmt,'sss',$message, $email, $ip);
 //  mysqli_stmt_execute($stmt);

 //  if (mysqli_stmt_affected_rows($stmt) == 0){
 //    logError("Data was not inserted into database")s;
 //    mysqli_close($db);
	// exit();
 //  }
  
  $content = "Message: ".$message."\n\n"."Nom: ".$name."\n\n"."Email: ".$email."\n\n"."Société: ".$company."\n\n"."Tel: ".$phone;

  mail("contactsite.murol@orange.fr","message Murol.fr: ". $topic, $content);
  mail("florian.gillard@tutanota.com","message Murol.fr: ". $topic, $content);

  logger("Votre message a bien été pris en compte.");
  // logger((string)(json_encode($captchaValidation)));
  // mysqli_close($db);
  exit();
 }

logError("wrong request");
exit();

?>