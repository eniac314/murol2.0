<?php
include 'utils.php';
session_start();
session_unset();
session_destroy(); 

$result = array('notLoggedIn' => true);
echo (json_encode($result));
exit();

?>
