<?php
$servername = "localhost:3306";
$database = "jobs";
$username = "root";
$password = "root";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully<br>";

$json = file_get_contents('companydata.json');
echo "Hi";
echo $json;
// Check if JSON data is valid
if ($json === false) {
    die("Error reading JSON data from the file.");
}

// Convert JSON data to PHP array
$decodedData = json_decode($json, true);
echo $decodedData;

// Check if JSON decoding was successful
if ($decodedData === null) {
    die("Error decoding JSON data.");
}

// Check if the "opportunities" key exists in the decoded data
if (!isset($decodedData['opportunities'])) {
    die("JSON data does not contain the 'opportunities' key.");
}

$opportunities = $decodedData['opportunities'];

// Prepare and execute the insert query for each opportunity
foreach ($opportunities as $opportunity) {
    $company = $conn->real_escape_string($opportunity['company']);
    $location = $conn->real_escape_string($opportunity['location']);
    $program = $conn->real_escape_string($opportunity['program']);
    $link = isset($opportunity['link']) ? $conn->real_escape_string($opportunity['link']) : '';

    $sql = "INSERT INTO cs_internships (company, location, program, link)
            VALUES ('$company', '$location', '$program', '$link')";

    if ($conn->query($sql) === true) {
        echo "Record inserted successfully for $company - $program<br>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close the database connection
mysqli_close($conn);
?>