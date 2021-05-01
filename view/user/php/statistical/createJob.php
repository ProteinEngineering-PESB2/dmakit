<?php

session_start();
$idUSer = $_SESSION['idUser'];

  include("../connection.php");
  include("../readDocument.php");
  include("../checkResultDB.php");

  #recibimos los parametros...
  $nameJob = $_REQUEST['nameJob'];
  $descJob = $_REQUEST['descJob'];
  $option = $_REQUEST['option'];

  $tipoJob = "";

  if ($option == 0){
    $tipoJob = "VIEW CONTINUOS DATA";
  }

  if ($option == 1){
    $tipoJob = "DISTRIBUTION";
  }

  if ($option == 3){
    $tipoJob = "FREQUENCE";
  }

  if ($option == 4){
    $tipoJob = "PARALLEL-COORDINATES";
  }

  if ($option == 5){
    $tipoJob = "SPLOM";
  }

  #obtenemos los datos desde la sesion...
  $idJob = time();#sera el id del job...
  $response ['job'] = $idJob;

  $pathRespone = "/var/www/html/dmakitWeb/dataStorage/";
  #obtenemos el nombre del archivo de entrada...
  $pathData = "/var/www/html/dmakitWeb/dataStorage/tmp/statistical/".$idUSer."_documentStatistical.txt";
  $nameDocument = readDocument($pathData);
  $response ['nameFile'] = $nameDocument;

  #hacemos la insercion a la base de datos...
  $query = "insert into job values ($idJob, '$nameJob', '$descJob', NOW(), NOW(), $idUSer, '$nameDocument', 'START', '$tipoJob', '-')";
  $query2 = "insert into dataSet values ($idJob, '$nameDocument', NOW(), NOW(), $idUSer, 'STATISTICAL', $idJob)";
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
    $pathActual = "/var/www/html/dmakitWeb/dataStorage/tmp/statistical/$nameDocument";
    $pathMove = "/var/www/html/dmakitWeb/dataStorage/$idUSer/$idJob/";

    $command = "mv $pathActual $pathMove";
    exec($command);

    //ejecutamos el script que permite agrear las features del set de datos a la base de datos
    $command = "python3 /var/www/html/dmakitWeb/model/launcherCheckFeature.py $pathMove$nameDocument $idJob";
    exec($command);

    //hacemos la modificacion al estado del job...
    $query = "update job set job.statusJob= 'FINISH' where job.idjob = $idJob";
    $resultado = mysqli_query($conexion, $query);

  }else{
    $response['exec'] = "ERROR";
  }

  echo json_encode($response);

?>
