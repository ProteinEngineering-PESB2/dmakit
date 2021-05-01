<?php

	#script para hacer la carga de informacion desde la base de datos a la tabla
	include("../connection.php");
  include("../readDocument.php");
  include("../checkResultDB.php");


	session_start();
  $idUSer = $_SESSION['idUser'];
	$idmodel = $_REQUEST['idmodel'];
	$idJob = $_REQUEST['idjob'];

	$idpath = time();

	$pathRespone = "/var/www/html/dmakitWeb/dataStorage/";
  #obtenemos el nombre del archivo de entrada...
  $pathData = "/var/www/html/dmakitWeb/dataStorage/tmp/tryModel/".$idUSer."_documentTryModel.txt";
  $nameDocument = readDocument($pathData);
  $response ['nameFile'] = $nameDocument;

	#movemos el archivo... creamos directorio
	$path = "/var/www/html/dmakitWeb/dataStorage/$idUSer/$idmodel";

	if (!file_exists($path)) {
			mkdir($path, 0777, true);
	}

	#movemos el archivo...
	//movemos el archivo al path de la licitacion...
	$pathActual = "/var/www/html/dmakitWeb/dataStorage/tmp/tryModel/$nameDocument";
	$pathMove = "/var/www/html/dmakitWeb/dataStorage/$idUSer/$idmodel/";

	$command = "mv $pathActual $pathMove";
	exec($command);

	$dataSet = $pathMove.$nameDocument;
	$pathRespone = $pathMove;
	$model = "/var/www/html/dmakitWeb/dataStorage/$idUSer/$idJob/modelExport$idJob.joblib";

	#ejecutamos el comando...
	$command = "python3 /var/www/html/dmakitWeb/model/launcherTryModels.py $dataSet $model $pathRespone";
	exec($command);

	#evaluamos si existe el archivo correspondiente
	$responseFile = $pathRespone."responseModel.csv";
  $responseData = file_exists($pathRespone);

	if ($responseData == true){
		$response["response"] = "OK";
	}else{
		$response["response"] = "ERROR";
	}

	echo json_encode($response);
?>
