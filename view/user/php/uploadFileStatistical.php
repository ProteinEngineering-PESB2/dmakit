<?php

session_start();
$idUSer = $_SESSION['idUser'];

	#$idUSer = $_SESSION['userName'];
	$archivo = $_FILES['file'];

	$templocation = $archivo["tmp_name"];
	$name = $archivo["name"];

	$pathMove = "/var/www/html/dmakitWeb/dataStorage/tmp/statistical/".$name;


	if(!$templocation){
		die('NO ha seleccionado ningun archivo');
	}

	if(move_uploaded_file($templocation, $pathMove)){
		echo "Archivo guardado correctamente";
	}else{
		echo "Error al guardar el archivo";
	}

	$pathData = "/var/www/html/dmakitWeb/dataStorage/tmp/statistical/".$idUSer."_documentStatistical.txt";
	//finalmente escribimos un archivo de texto con el nombre de la imagen...
	$file = fopen($pathData, "w");

	fwrite($file, "$name");

	fclose($file);

 ?>