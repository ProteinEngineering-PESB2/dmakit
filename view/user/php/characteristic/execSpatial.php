<?php

  session_start();
  $idUSer = $_SESSION['idUser'];

  include("../connection.php");
  include("../readDocument.php");
  include("../checkResultDB.php");

  #recibimos los parametros...
  $job = $_REQUEST['job'];
  $kind = $_REQUEST['kindDataSet'];
  $optionScale = $_REQUEST['option'];
  $feature = $_REQUEST['feature'];

  #obtenemos los datos desde la sesion...

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

  $command = "python3 /var/www/html/dmakitWeb/model/launcherWebFeatureAnalysis.py $idUSer $job $nameFile $pathRespone 2 1 1 $feature $kind";
  exec($command);
  $responseFile = "../../../dataStorage/$idUSer/$job/responseCorrelation$job.json";
  $responseData = file_exists("/var/www/html/dmakitWeb/dataStorage/$idUSer/$job/responseCorrelation$job.json");

  if ($responseData == true){
    $response['fileResponse'] = $responseFile;
    $response['command'] = $command;
  }else{
    $response['exec'] = "ERROR";

    $query = "update job set job.statusJob = 'ERROR', job.modifiedJob = NOW() where job.idjob = $job";
    $resultado = mysqli_query($conexion, $query);
  }

  echo json_encode($response);

?>
