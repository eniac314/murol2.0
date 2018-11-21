<?php
include 'utils.php';

if(getenv('REQUEST_METHOD') == 'POST') {
	$json_data = file_get_contents("php://input");
	
	$php_data = json_decode($json_data);

	if (is_null($php_data)){
  	logError("json data could not be decoded");
  	exit();
   }

   if(!isset($php_data->fichesIds)){
     logError("wrong input");
 	exit();
   }

   $db = mysqli_connect($mysql_server, $mysql_user, $mysql_password, $mysql_db);
   $stmt  = mysqli_stmt_init($db);

  if (mysqli_connect_errno()){
    logError('Could not connect to database');
    exit();
  }

  $fiches = [];

  $query = 
    "SELECT uuid, categories, natureActiv, refOt, label, rank, nomEntite, responsables, adresse, telNumber, fax, email, site, pjaun, visuel, description, linkedDocs, ouverture, lastEdit FROM fiches WHERE uuid = ?";
  mysqli_stmt_prepare($stmt, $query);

  
  foreach ($php_data->fichesIds as $ficheId){
  	mysqli_stmt_bind_param($stmt,'s', $ficheId);
    mysqli_stmt_execute($stmt);

    mysqli_stmt_bind_result($stmt, $uuid, $categories, $natureActiv, $refOt, $label, $rank, $nomEntite, $responsables, $adresse, $telNumber, $fax, $email, $site, $pjaun, $visuel, $description, $linkedDocs, $ouverture, $lastEdit);
    
    mysqli_stmt_fetch($stmt); 
    
    if (mysqli_stmt_affected_rows($stmt) == 0){
       logError("chargements données fiche");
       mysqli_close($db);
       exit();
    }

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
                        ,'lastEdit' => $lastEdit
                        ]);
  }

  $toJson = json_encode($fiches);
  echo $toJson;


  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>