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
    "SELECT uuid, categories, natureActiv, refOt, label, rank, nomEntite, responsables, adresse, telNumber, fax, email, site, pjaun, visuel, description, linkedDocs, ouverture, lastEdit FROM fiches";
    

  mysqli_stmt_prepare($stmt, $query);
  
  mysqli_stmt_execute($stmt);

  mysqli_stmt_bind_result($stmt, $uuid, $categories, $natureActiv, $refOt, $label, $rank, $nomEntite, $responsables, $adresse, $telNumber, $fax, $email, $site, $pjaun, $visuel, $description, $linkedDocs, $ouverture, $lastEdit);

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
                        ,'lastEdit' => $lastEdit
                        ]);
  }

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
      ouverture = VALUES(ouverture),
      lastEdit = VALUES(lastEdit)";

  mysqli_stmt_prepare($stmt, $query);

  foreach ($fiches as $f) {
    $categories = json_encode($f['categories']);
    $natureActiv = json_encode($f['natureActiv']);
    $refOt = json_encode($f['refOt']);
    $label = json_encode($f['label']);
    $rank = json_encode($f['rank']);
    $responsables = json_encode($f['responsables']);
    $telNumber = json_encode($f['telNumber']);
    $email = json_encode($f['email']);
    $site = json_encode($f['site']);
    $description = json_encode($f['description']);
    $linkedDocs = json_encode($f['linkedDocs']);
    $ouverture = json_encode($f['ouverture']);

    mysqli_stmt_prepare($stmt, $query);
    mysqli_stmt_bind_param($stmt, 'sssssssssssssssssss', $f['uuid'], $categories, $natureActiv, $refOt, $label, $rank, $f['nomEntite'], $responsables, $f['adresse'], $telNumber, $f['fax'], $email, $site, $f['pjaun'], $f['visuel'], $description, $linkedDocs, $ouverture, $f['lastEdit']);
    mysqli_stmt_execute($stmt);
  }

  mysqli_close($db);
  exit();


  } else {
  logError("invalid request");
  exit();
}

?>