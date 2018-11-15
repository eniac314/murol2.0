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
  $categories = serialize($fiche->categories);
  $natureActiv = serialize($fiche->natureActiv);
  $refOt = is_null($fiche->refOt) ? null : serialize($fiche->refOt);
  $label = serialize($fiche->label);
  $rank = serialize($fiche->rank);
  $nomEntite = $fiche->nomEntite;
  $responsables = serialize($fiche->responsables);
  $adresse = $fiche->adresse;
  $telNumber = is_null($fiche->telNumber) ? null : serialize($fiche->telNumber);
  $fax = $fiche->fax;
  $email = serialize($fiche->email);
  $site = is_null($fiche->site) ? null : serialize($fiche->site);
  $pjaun = $fiche->pjaun;
  $visuel = $fiche->visuel;
  $description = serialize($fiche->description);
  $linkedDocs = serialize($fiche->linkedDocs);
  $ouverture = is_null($fiche->ouverture) ? null : serialize($fiche->ouverture);
  $lastEdit = $fiche->lastEdit;

  $query = 
    "INSERT INTO fiches(uuid, categories, natureActiv, refOt, label, rank, nomEntite, responsables, adresse, telNumber, fax, email, site, pjaun, visuel, description, linkedDocs, ouverture,lastEdit)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      categories = VALUES(categories),
      natureActiv = VALUES(natureActiv),
      refOt = VALUES(refOt),
      label = VALUES(label),
      rank = VALUES(rank),
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
      ouverture = VALUES(ouverture)
      lastEdit = VALUES(lastEdit)";

    mysqli_stmt_prepare($stmt, $query);
    mysqli_stmt_bind_param($stmt, 'ssssssssssssssssss', $uuid, $categories, $natureActiv, $refOt, $label, $rank, $nomEntite, $responsables, $adresse, $telNumber, $fax, $email, $site, $pjaun, $visuel, $description, $linkedDocs, $ouverture,$lastEdit);
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