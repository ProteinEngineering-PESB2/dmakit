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

  $MLP_activation= $_REQUEST['MLP_activation'];
  $MLP_solver= $_REQUEST['MLP_solver'];
  $MLP_alpha= $_REQUEST['MLP_alpha'];
  $MLP_learning_rate= $_REQUEST['MLP_learning_rate'];
  $MLP_hidden_layer_sizes1= $_REQUEST['MLP_hidden_layer_sizes1'];
  $MLP_hidden_layer_sizes2= $_REQUEST['MLP_hidden_layer_sizes2'];
  $MLP_hidden_layer_sizes3= $_REQUEST['MLP_hidden_layer_sizes3'];
  $MLP_max_iter = $_REQUEST['MLP_max_iter'];
  $MLP_shuffle= $_REQUEST['MLP_shuffle'];

  $params = "$MLP_activation-$MLP_solver-$MLP_learning_rate-$MLP_hidden_layer_sizes1-$MLP_hidden_layer_sizes2-$MLP_hidden_layer_sizes3-$MLP_alpha-$MLP_max_iter-$MLP_shuffle";

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
  $command = "python3 /var/www/html/dmakitWeb/model/launcherSupervisedPredictionWeb.py $nameFile $idUSer $job $pathRespone 6 $params $responseFeature $scale";
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
