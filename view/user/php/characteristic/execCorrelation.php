<?php

  session_start();
  $idUSer = $_SESSION['idUser'];

  include("../connection.php");
  include("../readDocument.php");
  include("../checkResultDB.php");

  #recibimos los parametros...
  $nameJob = $_REQUEST['nameJob'];
  $descJob = $_REQUEST['descJob'];
  $optionScale = $_REQUEST['optionScale'];
  $optionEncode = $_REQUEST['optionEncode'];

  #obtenemos los datos desde la sesion...
  $idJob = time();#sera el id del job...
  $response ['job'] = $idJob;

  $pathRespone = "/var/www/html/dmakitWeb/dataStorage/";
  #obtenemos el nombre del archivo de entrada...
  $pathData = "/var/www/html/dmakitWeb/dataStorage/tmp/characteristic/".$idUSer."_documentCharacteristic.txt";
  $nameDocument = readDocument($pathData);
  $response ['nameFile'] = $nameDocument;

  #hacemos la insercion a la base de datos...
  $query = "insert into job values ($idJob, '$nameJob', '$descJob', NOW(), NOW(), $idUSer, '$nameDocument', 'START', 'CORRELATION', '-')";
  $query2 = "insert into dataSet values ($idJob, '$nameDocument', NOW(), NOW(), $idUSer, 'CORRELATION', $idJob)";
  $resultado = mysqli_query($conexion, $query);
  $resultado2 = mysqli_query($conexion, $query2);
  $requestData = verificar_resultado($resultado);

  $response ['queriesInsert'] = $requestData;

  if ($requestData == "BIEN"){#movemos el archivo de tmp al path del usuario y ejecutamos el proceso solo si la opcion de algorithm es todos...

    #movemos el archivo... creamos directorio
    $path = "/var/www/html/dmakitWeb/dataStorage/$idUSer/$idJob";

    if (!file_exists($path)) {
        mkdir($path, 0777, true);
    }

    #movemos el archivo...
    //movemos el archivo al path de la licitacion...
    $pathActual = "/var/www/html/dmakitWeb/dataStorage/tmp/characteristic/$nameDocument";
    $pathMove = "/var/www/html/dmakitWeb/dataStorage/$idUSer/$idJob/";

    $command = "mv $pathActual $pathMove";
    exec($command);

    //hacemos la ejecucion del script
    $command = "python3 /var/www/html/dmakitWeb/model/launcherWebFeatureAnalysis.py $idUSer $idJob $pathMove$nameDocument $pathRespone 1 $optionScale $optionEncode";
    exec($command);
    $response['command'] = $command;
    $responseFile = "../../../dataStorage/$idUSer/$idJob/responseCorrelation$idJob.json";
    $responseData = file_exists("/var/www/html/dmakitWeb/dataStorage/$idUSer/$idJob/responseCorrelation$idJob.json");

    if ($responseData == true){
      $response['fileResponse'] = $responseFile;
      $response['command'] = $command;
    }else{
      $response['exec'] = "ERROR";

      $query = "update job set job.statusJob = 'ERROR', job.modifiedJob = NOW() where job.idjob = $idJob";
      $resultado = mysqli_query($conexion, $query);
    }

  }else{
    $response['exec'] = "ERROR";
  }

  echo json_encode($response);

?>
