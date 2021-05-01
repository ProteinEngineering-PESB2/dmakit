<?php

	#script para hacer la carga de informacion desde la base de datos a la tabla
	include ("../connection.php");
	include ("../checkResultDB.php");

	session_start();
  $user = $_SESSION['idUser'];

	$idjob = $_REQUEST['idjob'];


	$query = "delete from modelo where modelo.idmodelo=$idjob";#query job
	$resultado = mysqli_query($conexion, $query);

	$response['query'] = $query;
	$response['response'] = verificar_resultado($resultado);

	mysqli_close($conexion);

	echo json_encode($response);
?>
