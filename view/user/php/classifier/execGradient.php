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
  $gradient_loss = $_REQUEST['gradient_loss'];
  $gradient_n_estimators = $_REQUEST['gradient_n_estimators'];
  $gradient_min_samples_split = $_REQUEST['gradient_min_samples_split'];
  $gradient_min_samples_leaf = $_REQUEST['gradient_min_samples_leaf'];
  $params = "$gradient_n_estimators-$gradient_loss-$gradient_min_samples_leaf-$gradient_min_samples_split";

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
  $command = "python3 /var/www/html/dmakitWeb/model/launcherSupervisedClaWeb.py $nameFile $idUSer $job $pathRespone 6 $params $val $responseFeature $scale";
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
