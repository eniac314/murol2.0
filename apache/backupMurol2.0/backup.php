<?php
include '../murol2.0/utils.php';

$folderPath = './'.date("d-m-Y");

$DBSERVER=$mysql_server;
$DBUSER=$mysql_user;
$DBPASSWD=$mysql_password;
$DATABASE=$mysql_db;

$filename = $folderPath."/backup-" . date("d-m-Y") . ".sql.gz";

$cmd = "mysqldump -h $DBSERVER -u $DBUSER --password=$DBPASSWD $DATABASE | gzip --best > $filename";

if (!file_exists($folderPath)) {
    mkdir($folderPath, 0777, true);
    exec(`cp -r ../murol2.0/pages $folderPath`);
    exec($cmd);
}

?>