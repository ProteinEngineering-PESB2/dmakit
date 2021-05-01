<?php

	#script para hacer la carga de informacion desde la base de datos a la tabla
	include ("../connection.php");

	$informacion = [];

	#hacemos la consulta
	$idinstitution = $_REQUEST['idinstitution'];
	$nameInstitution = $_REQUEST['nameInstitution'];


	$query = "update institution set institution.nameInstitution='$nameInstitution', institution.modifiedInstitution=NOW() where institution.idinstitution=$idinstitution";
	$response['query'] = $query;

	$resultado = mysqli_query($conexion, $query);
	verificar_resultado( $resultado, $response );
	cerrar( $conexion );

	mysqli_free_result($resultado);

	function verificar_resultado($resultado, $response){

		if (!$resultado) $informacion["respuesta"] = "ERROR";
		else $informacion["respuesta"] ="BIEN";
		$response['response'] = $informacion;
		echo json_encode($response);
	}

	function cerrar($conexion){
		mysqli_close($conexion);
	}


?>
