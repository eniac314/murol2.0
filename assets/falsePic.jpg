 <html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
 <?
/*
// This file will run a test on your server to determine the location and versions of ImageMagick. 
//It will look in the most commonly found locations. The last two are where most popular hosts (including "Godaddy") install ImageMagick.
//
// Upload this script to your server and run it for a breakdown of where ImageMagick is.
//
*/
echo '<h2>Test for versions and locations of ImageMagick</h2>';
echo '<b>Path: </b> convert<br>';
function alist ($array) {  //This function prints a text array as an html list.
    $alist = "<ul>";
    for ($i = 0; $i < sizeof($array); $i++) {
        $alist .= "<li>$array[$i]";
    }
    $alist .= "</ul>";
    return $alist;
}
exec("convert -version", $out, $rcode); //Try to get ImageMagick "convert" program version number.
echo "Version return code is $rcode <br>"; //Print the return code: 0 if OK, nonzero if error.
echo alist($out); //Print the output of "convert -version"
echo '<br>';
echo '<b>This should test for ImageMagick version 5.x</b><br>';
echo '<b>Path: </b> /usr/bin/convert<br>';
exec("/usr/bin/convert -version", $out, $rcode); //Try to get ImageMagick "convert" program version number.
echo "Version return code is $rcode <br>"; //Print the return code: 0 if OK, nonzero if error.
echo alist($out); //Print the output of "convert -version"
echo '<br>';
echo '<b>This should test for ImageMagick version 6.x</b><br>';
echo '<b>Path: </b> /usr/local/bin/convert<br>';
exec("/usr/local/bin/convert -version", $out, $rcode); //Try to get ImageMagick "convert" program version number.
echo "Version return code is $rcode <br>"; //Print the return code: 0 if OK, nonzero if error.
echo alist($out); //Print the output of "convert -version";
?>

 
 </body>
</html>