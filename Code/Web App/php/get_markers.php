<?php

include 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM places_of_interest";
$result = $conn->query($sql);

$markers = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $markers[] = array(
            'name' => $row['name'],
            'lat' => $row['latitude'],
            'lng' => $row['longitude']
        );
    }
}

echo json_encode($markers);

$conn->close();
?>
