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

  $categoriesMeta = file_get_contents('./pages/categories');

  if (!$categoriesMeta){
    logError("impossible de charger les categories du site");
    exit(); 
  }

  $activites = file_get_contents('./pages/activites');

  if (!$activites){
    logError("impossible de charger les activites du site");
    exit(); 
  }  

  $labels = file_get_contents('./pages/labels');

  if (!$labels){
    logError("impossible de charger les labels du site");
    exit(); 
  }

  $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
  $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }
  
  

  $query = 
    "SELECT uuid, categories, natureActiv, refOt, label, rank, nomEntite, responsables, adresse, telNumber, fax, email, site, pjaun, visuel, description, linkedDocs, ouverture FROM fiches";
    

    mysqli_stmt_prepare($stmt, $query);
    
    mysqli_stmt_execute($stmt);

    mysqli_stmt_bind_result($stmt, $uuid, $categories, $natureActiv, $refOt, $label, $rank, $nomEntite, $responsables, $adresse, $telNumber, $fax, $email, $site, $pjaun, $visuel, $description, $linkedDocs, $ouverture);

    $fiches = [];

    while(mysqli_stmt_fetch($stmt)){
      array_push($fiches, [ 'uuid' => $uuid
                          , 'categories' => unserialize($categories)
                          , 'natureActiv' => unserialize($natureActiv)
                          , 'refOt' => is_null($refOt) ? null : unserialize($refOt) 
                          , 'label' => unserialize($label)
                          , 'rank' => unserialize($rank)
                          , 'nomEntite' => $nomEntite
                          , 'responsables' => unserialize($responsables)
                          , 'adresse' => $adresse
                          , 'telNumber' => is_null($telNumber) ? null : unserialize($telNumber)
                          , 'fax' => $fax
                          , 'email' => unserialize($email)
                          , 'site' => is_null($site) ? null : unserialize($site)
                          , 'pjaun' => $pjaun
                          , 'visuel' => $visuel
                          , 'description' => unserialize($description)
                          , 'linkedDocs' => unserialize($linkedDocs)
                          , 'ouverture' => is_null($ouverture) ? null : unserialize($ouverture) 
                          ]);
    }

    $genDirData = 
      array('fiches' => $fiches
           ,'categories' => json_decode($categoriesMeta)
           ,'activites' => json_decode($activites)
           ,'labels' => json_decode($labels)
           );

    $toJson = json_encode($genDirData);
    echo $toJson;


    mysqli_close($db);
    exit();


  } else {
  logError("invalid request");
  exit();
}

?>