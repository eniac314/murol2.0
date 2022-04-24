<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

  if(!isset($php_data->sessionId) || !isset($php_data->fiche)){
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
  
  $fiche = $php_data->fiche;

  $uuid = $fiche->uuid;
  $categories = json_encode($fiche->categories);
  $natureActiv = json_encode($fiche->natureActiv);
  $refOt = is_null($fiche->refOt) ? null : json_encode($fiche->refOt);
  $label = json_encode($fiche->label);
  $rank = json_encode($fiche->rank);
  $nomEntite = $fiche->nomEntite;
  $responsables = json_encode($fiche->responsables);
  $adresse = $fiche->adresse;
  $telNumber = is_null($fiche->telNumber) ? null : json_encode($fiche->telNumber);
  $fax = $fiche->fax;
  $email = json_encode($fiche->email);
  $site = is_null($fiche->site) ? null : json_encode($fiche->site);
  $pjaun = $fiche->pjaun;
  $visuel = $fiche->visuel;
  $description = json_encode($fiche->description);
  $linkedDocs = json_encode($fiche->linkedDocs);
  $ouverture = is_null($fiche->ouverture) ? null : json_encode($fiche->ouverture);
  $lastEdit = $fiche->lastEdit;

  $query = 
    "INSERT INTO fiches(uuid, categories, natureActiv, refOt, label, ranking, nomEntite, responsables, adresse, telNumber, fax, email, site, pjaun, visuel, description, linkedDocs, ouverture,lastEdit)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      categories = VALUES(categories),
      natureActiv = VALUES(natureActiv),
      refOt = VALUES(refOt),
      label = VALUES(label),
      ranking = VALUES(ranking),
      nomEntite = VALUES(nomEntite),
      responsables = VALUES(responsables),
      adresse = VALUES(adresse),
      telNumber = VALUES(telNumber),
      fax = VALUES(fax),
      email = VALUES(email),
      site = VALUES(site),
      pjaun = VALUES(pjaun),
      visuel = VALUES(visuel),
      description = VALUES(description),
      linkedDocs = VALUES(linkedDocs),
      ouverture = VALUES(ouverture),
      lastEdit = VALUES(lastEdit)";

    mysqli_stmt_prepare($stmt, $query);
    mysqli_stmt_bind_param($stmt, 'sssssssssssssssssss', $uuid, $categories, $natureActiv, $refOt, $label, $rank, $nomEntite, $responsables, $adresse, $telNumber, $fax, $email, $site, $pjaun, $visuel, $description, $linkedDocs, $ouverture,$lastEdit);
    mysqli_stmt_execute($stmt);

    if (mysqli_stmt_affected_rows($stmt) == 0){
       logError("insertion données impossible");
       echo (mysqli_error($db));
       mysqli_close($db);
       exit();
    }

    logger("success!");
    mysqli_close($db);
    exit();


  } else {
  logError("invalid request");
  exit();
}

?>