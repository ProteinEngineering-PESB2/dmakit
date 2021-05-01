$(document).ready(function() {

  var job = getQuerystring('job');
  showDefinitionData();

  $.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);

  var responseImage = "../../../dataStorage/"+response.request+"/"+job+"/plotClusters.png";

  var response = "../../../dataStorage/"+response.request+"/"+job+"/responseClustering.json";


    readTextFile(response, function(text){
      var data = JSON.parse(text);

      showPieChart(data.membersGroup);
      loadDataPanel(data);

      console.log(data);
      if (data.figureClusters == "ERROR"){
        console.log("AQUI!!!");
        $(".messageImage").html( "No data available for this option." );
      }else{
        
        var img = document.getElementById('imageResult');
        img.src= responseImage;
      }
    });
  });
});


//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key, default_) {
  var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var showDefinitionData = function(){

  var algorithm = getQuerystring('algorithm');
  console.log(algorithm);
	var nameFile = "../../../view/user/resourceData/dataDefinitions.json";

	readTextFile(nameFile, function(text){
		var data = JSON.parse(text);

		$(".algorithmName").html(data.clusteringAlgorithm[algorithm].nameAlgorithm);
		$(".description").html(data.clusteringAlgorithm[algorithm].definition);

	});

}

//read document
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var loadDataPanel = function(data){

  var Calinski= data.calinski_harabaz_score;
  var silhouette_score = data.silhouette_score;
  var algorithm = data.algorithm;
  var lengthData = 0;
  for (key in data.membersGroup){

    lengthData++;
  }

  var params = "";

  for (key in data.Params){

    params = params + " " + key + ": " + data.Params[key];
  }

  $(".params").html(params);
  $(".Calinski").html( parseFloat(Calinski).toFixed(2) );
  $(".silhouette_score").html( parseFloat(silhouette_score).toFixed(2) );
  $(".lengthData").html( lengthData );
  $(".algorithm").html( algorithm );

}
var showPieChart = function(valesGraph){

  //con los datos de la informacion... generamos los arreglos asociados a la data y las legends...
  var valuesInput = [];
  var labelsInput = [];
  var index = 0;
  for (key in valesGraph){

    labelsInput[index] = key;
    valuesInput[index] = valesGraph[key];
    index++;
  }

  var data = [{
    values: valuesInput,
    labels: labelsInput,
    type: 'pie'
  }];

  Plotly.newPlot('distributionValues', data);
}
