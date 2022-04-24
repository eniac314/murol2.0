<?php
include 'utils.php';

$DBSERVER=$mysql_server;
$DBUSER=$mysql_user;
$DBPASSWD=$mysql_password;
$DATABASE=$mysql_db;

$filename = "backup-" . date("d-m-Y") . ".sql.gz";
$mime = "application/x-gzip";

header( "Content-Type: " . $mime );
header( 'Content-Disposition: attachment; filename="' . $filename . '"' );

$cmd = "mysqldump -h $DBSERVER -u $DBUSER --password=$DBPASSWD $DATABASE | gzip --best";   

passthru( $cmd );

exit(0);
?>