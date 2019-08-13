<?php
include 'utils.php';


$restore_file  = "/var/www/html/backup-12-08-2019.sql-6";
$server_name   = $mysql_server;
$username      = $mysql_user;
$password      = $mysql_password;
$database_name = $mysql_db;

$cmd = 'mysql -h ' .$server_name .' -u ' .$username .' -p' .$password .' ' .$database_name .' < ' .$restore_file;

echo $cmd;
$output = array();
exec($cmd, $output, $worked);

echo implode(" ", $output);

switch($worked){
case 0:
echo 'The data from the file <b>' .$restore_file .'</b> were successfully imported into the database <b>' .$database_name .'</b>';
break;
case 1:
echo 'An error occurred during the import. Please check if the file is in the same folder as this script. Also check the following data again:<br/><br/><table><tr><td>MySQL Database Name:</td><td><b>' .$database_name .'</b></td></tr><tr><td>MySQL User Name:</td><td><b>' .$username .'</b></td></tr><tr><td>MySQL Password:</td><td><b>NOTSHOWN</b></td></tr><tr><td>MySQL Host Name:</td><td><b>' .$server_name .'</b></td></tr><tr><td>MySQL Import Dateiname:</td><td><b>' .$restore_file .'</b></td></tr></table>';
break;
}
?>