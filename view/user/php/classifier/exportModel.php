<?php

  session_start();
  $idUSer = $_SESSION['idUser'];

  include("../connection.php");
  include("../checkResultDB.php");

  #recibimos los parametros...
  $idjob = $_REQUEST['idjob'];
  $idModel = time();

  #hacemos la consulta para insertar el modelo
  $query = "insert into modelo values ($idModel, $idjob, NOW(), NOW())";
  $resultado = mysqli_query($conexion, $query);

  $response['response'] = verificar_resultado($resultado);

  echo json_encode($response);

?>
