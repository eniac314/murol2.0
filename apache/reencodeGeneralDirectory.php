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
    "SELECT uuid, categories, natureActiv, refOt, label, ranking, nomEntite, responsables, adresse, telNumber, fax, email, site, pjaun, visuel, description, linkedDocs, ouverture, lastEdit FROM fiches";
    

  mysqli_stmt_prepare($stmt, $query);
  
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $uuid, $categories, $natureActiv, $refOt, $label, $ranking, $nomEntite, $responsables, $adresse, $telNumber, $fax, $email, $site, $pjaun, $visuel, $description, $linkedDocs, $ouverture, $lastEdit);

  $fiches = [];

  while(mysqli_stmt_fetch($stmt)){
    array_push($fiches, [ 'uuid' => $uuid
                        , 'categories' => ($categories)
                        , 'natureActiv' => ($natureActiv)
                        , 'refOt' => ($refOt) 
                        , 'label' => ($label)
                        , 'ranking' => ($ranking)
                        , 'nomEntite' => Encoding::fixUTF8($nomEntite)
                        , 'responsables' => ($responsables)
                        , 'adresse' => $adresse
                        , 'telNumber' => ($telNumber)
                        , 'fax' => $fax
                        , 'email' => ($email)
                        , 'site' => ($site)
                        , 'pjaun' => $pjaun
                        , 'visuel' => $visuel
                        , 'description' => ($description)
                        , 'linkedDocs' => ($linkedDocs)
                        , 'ouverture' => ($ouverture) 
                        ,'lastEdit' => $lastEdit
                        ]);
  }

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

  foreach ($fiches as $f) {

    mysqli_stmt_prepare($stmt, $query);
    mysqli_stmt_bind_param($stmt, 'sssssssssssssssssss', $f['uuid'], $f['categories'], $f['natureActiv'], $f['refOt'], $f['label'], $f['ranking'], $f['nomEntite'], $f['responsables'], $f['adresse'], $f['telNumber'], $f['fax'], $f['email'], $f['site'], $f['pjaun'], $f['visuel'], $f['description'], $f['linkedDocs'], $f['ouverture'], $f['lastEdit']);
    mysqli_stmt_execute($stmt);
  }

  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>