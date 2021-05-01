$(document).ready(function() {

  //creamos los histogramas
  histogramFunction('R_Score', 'rscore');
  histogramFunction('Pearson', 'pearson');
  histogramFunction('Spearman', 'spearman');
  histogramFunction('Kendalltau', 'kendall');

  //cargamos las definiciones de las medidas
  definitionsProcess();
});

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
  var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};

var histogramFunction = function(key, plot){

  var job = getQuerystring('job');
  $.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);

    var url = "../../../dataStorage/"+response.request+"/"+job+"/summaryProcessJob_"+job+".csv";
    Plotly.d3.csv(url, function(err, rows){

      function unpack(rows, key) {
          return rows.map(function(row) {
            return row[key.replace('.',' ')];
          });
      }

      var trace1 = {
        x: unpack(rows,key),
        name: 'Performance',
        autobinx: true,
        histnorm: "count",
        marker: {
          color: "rgba(100, 150, 102, 0.7)",
          line: {
            color:  "rgba(100, 150, 102, 1)",
            width: 1
          }
        },
        opacity: 0.5,
        type: "histogram",
      };

      var data = [trace1];
      var layout = {
        bargap: 0.05,
        bargroupgap: 0.2,
        barmode: "overlay",
        xaxis: {title: "Value"},
        yaxis: {title: "Frequence"}
      };
      Plotly.newPlot(plot, data, layout);

    });
  });
}

var definitionsProcess = function loadDefinitionProcess() {

  var job = getQuerystring('job');
  $.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);

    var urlFile = "../../../dataStorage/"+response.request+"/"+job+"/summaryProcess_"+job+".json";
  	readTextFile(urlFile, function(text){
  		var data = JSON.parse(text);

      var duration = parseFloat(data.ejecucion)/(60*60);

  		$(".start").html(data.inicio);
  		$(".end").html(data.termino);
      $(".correct").html(data.iteracionesCorrectas);
  		$(".incorrect").html(data.iteracionesIncorrectas);
      $(".duration").html(duration);
  	});
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
