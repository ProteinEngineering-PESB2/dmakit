<?php

  session_start();
  $idUSer = $_SESSION['idUser'];

  include("../connection.php");
  include("../readDocument.php");
  include("../checkResultDB.php");

  #recibimos los parametros...
  $job = $_REQUEST['job'];
  $responseFeature = $_REQUEST['response'];
  $scale = $_REQUEST['scale'];
  $algorithm = $_REQUEST['algorithm'];
  $val = $_REQUEST['val'];
  $knn_neighbors = $_REQUEST['knn_neighbors'];
  $knn_metric = $_REQUEST['knn_metric'];
  $knn_weight = $_REQUEST['knn_weight'];
  $knn_algorithm = $_REQUEST['knn_algorithm'];
  $params = "$knn_neighbors-$knn_algorithm-$knn_metric-$knn_weight";

  #obtenemos los datos desde la sesion...
  $response = [];

  #obtenemos el nombre del set de datos desde la bd segun el job
  $query = "select dataSet.nameDataSet as name from dataSet where dataSet.job = $job";
	$resultado = mysqli_query($conexion, $query);

	$nameData = "";
	if (!$resultado){
		die("Error");
	}else{

		while($data = mysqli_fetch_assoc($resultado)){

			$nameData = $data['name'];
		}
		$response['nameFile'] = $nameData;
	}

  //hacemos la ejecucion del script
  $nameFile = "/var/www/html/dmakitWeb/dataStorage/$idUSer/$job/$nameData";
  $pathRespone = "/var/www/html/dmakitWeb/dataStorage/";

  //hacemos la ejecucion del script
  $command = "python3 /var/www/html/dmakitWeb/model/launcherSupervisedClaWeb.py $nameFile $idUSer $job $pathRespone 7 $params $val $responseFeature $scale";
  $response['command'] = $command;
  exec($command);

  //preguntamos si este archivo existe...
  $responseFile = "../../../dataStorage/$idUSer/$job/responseTraining$job.json";
  $responseData = file_exists("/var/www/html/dmakitWeb/dataStorage/$idUSer/$job/responseTraining$job.json");

  if ($responseData == true){
    $response['fileResponse'] = $responseFile;
    $response['exec'] = "OK";
  }else{
    $response['exec'] = "ERROR";

    $query = "update job set job.statusJob = 'ERROR', job.modifiedJob = NOW() where job.idjob = $job";
    $resultado = mysqli_query($conexion, $query);
  }

  echo json_encode($response);

?>
