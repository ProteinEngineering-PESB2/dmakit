<?php

	#script para hacer la carga de informacion desde la base de datos a la tabla
	include ("../connection.php");

	$job = $_REQUEST['job'];
	$feature = $_REQUEST['feature'];

	$query = "select dataSet.nameDataSet as name from dataSet where dataSet.job = $job";
	$resultado = mysqli_query($conexion, $query);
	$response = [];

	$nameData = "";
	if (!$resultado){
		die("Error");
	}else{

		while($data = mysqli_fetch_assoc($resultado)){

			$nameData = $data['name'];
		}
		$response['nameFile'] = $nameData;

	}

	#hacemos la segunda consulta para obtener solamente las caracteristicas del tipo continuo desde el set de datos...
	$query = "select feature.nameFeature from feature where feature.dataSet = $job AND feature.kind = 'CONTINUA'";
	$resultado = mysqli_query($conexion, $query);

	$nameFeatures = [];
	if (!$resultado){
		die("Error");
	}else{
		$cont=0;
		while($data = mysqli_fetch_assoc($resultado)){

			$nameFeatures[$cont] = $data['nameFeature'];
			$cont+=1;
		}
		$response['features'] = $nameFeatures;

	}


	echo json_encode($response);
	mysqli_free_result($resultado);
	mysqli_close($conexion);
?>
