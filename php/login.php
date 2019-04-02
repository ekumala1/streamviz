<?php 
  $servername = "localhost:3306";
  $username = "root";
  $password = "password";
  $login_username = $_POST['username'];
  $login_password = $_POST['password'];
  
  // Create connection
  $conn = new mysqli($servername, $username, $password, "stream_viz");
  
  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  $myArray = array();
  $query = sprintf("select username, fname, password from users where username like '%s' and password = '%s'", $login_username, $login_password);
  if ($result = $conn->query($query)) {
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
      $myArray[] = $row;
    }
    if (count($myArray) == 1) {
      // success, handle session
      session_start();
      $_SESSION['logged'] = true;
      $_SESSION['username'] = $login_username;
      $_SESSION['name'] = $myArray[0]['fname'];
      
      $result = array('result' => 'success', 'name' => $_SESSION['name']);
      echo json_encode($result);
    } else if (count($myArray) == 0) {
      // invalid login, return no
      $result = array('result' => 'failure');
      echo json_encode($result);
    } else {
      // should never happen
    }
  }
?>