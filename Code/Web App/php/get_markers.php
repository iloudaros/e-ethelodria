<?php
include 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM Vehicle";
$result = $conn->query($sql);

$markers = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $markers[] = array(
            'id' => $row['id'],
            'lat' => $row['latitude'],
            'lng' => $row['longitude']
        );
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($markers);
?>
