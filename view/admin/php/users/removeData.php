<?php

	include("../connection.php");#incluimos la base de datos

	$iduser = $_REQUEST['iduser'];

	$query = "delete from user where user.iduser=$iduser";

	$resultado = mysqli_query($conexion, $query);
	verificar_resultado( $resultado, $iduserMOSST, $status);
	cerrar( $conexion );

	function verificar_resultado($resultado, $iduserMOSST, $status){

		if (!$resultado) $informacion["respuesta"] = "ERROR";
		else{
			$informacion["respuesta"] ="BIEN";

			//enviamos el correo electronico para notificar la accion...
			$command = "rm -rf /var/www/html/dmakitWeb/dataStorage/$iduser";			
			exec($command);
		}
		echo json_encode($informacion);
	}

	function cerrar($conexion){
		mysqli_close($conexion);
	}
?>
