<?php
  session_start();
  if ($_SESSION['logged']) {
    $result = array('result' => 'success', 'name' => $_SESSION['name']);
    echo json_encode($result);
  } else {
    $result = array('result' => 'failure');
    echo json_encode($result);
  }
?>