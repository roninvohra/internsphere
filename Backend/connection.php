<?php
$servername = "localhost:3306";
$database = "jobs";
$username = "root";
$password ="root";

// Create connection

$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection

if ($conn->connect_error) {
die("Connection failed: " . $conn->connect_error);
}

echo "connected successfully";

mysqli_close($conn);

?>