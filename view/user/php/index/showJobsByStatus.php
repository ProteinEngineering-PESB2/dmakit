<?php

	header("content-type: application/json");

	session_start();
  $iduser = $_SESSION['idUser'];

	#incluimos la conexion a la base de datos
	include ("../connection.php");

	#consulta para obtener los pacientes anormales segun el criterio chileno
	$query = "select COUNT(job.statusJob) as cantidad, job.statusJob from job where user = $iduser group by job.statusJob";
	$resultado = mysqli_query($conexion, $query);

	$responseData = [];

	if (!$resultado){
		die("Error");
	}else{

		while($data = mysqli_fetch_assoc($resultado)){

			$responseData[] = $data;

		}
	}

	echo json_encode($responseData);

	mysqli_free_result($resultado);
	mysqli_close($conexion);

?>
