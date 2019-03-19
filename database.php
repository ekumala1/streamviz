<?php 
  $servername = "localhost:3306";
  $username = "root";
  $password = "password";
  
  // Create connection
  $conn = new mysqli($servername, $username, $password, "stream_viz");
  
  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  $myArray = array();
  if ($result = $conn->query("select * from stream_viz.stream")) {
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
      $myArray[] = $row;
    }
    echo json_encode($myArray);
  }
?>