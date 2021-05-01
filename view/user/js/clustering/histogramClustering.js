$(document).ready(function() {

  histogramSiluetas();
  histogramCalinski();

});

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
  var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};

var histogramSiluetas = function(){

  var job = getQuerystring('job');
  $.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);

    var url = "../../../dataStorage/"+response.request+"/"+job+"/ResponseProcess_Job_Clustering.csv";
    console.log(url);
    Plotly.d3.csv(url, function(err, rows){

      function unpack(rows, key) {
          return rows.map(function(row) {
            return row[key.replace('.',' ')];
          });
      }

      var trace1 = {
        x: unpack(rows,'silhouette_score'),
        name: 'control',
        autobinx: true,
        histnorm: "count",
        marker: {
          color: "rgba(100, 150, 102, 0.7)",
          line: {
            color:  "rgba(100, 150, 102, 1)",
            width: 1
          }
        },
        
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
      Plotly.newPlot('histogramSiluetas', data, layout);

    });
  });
}

var histogramCalinski = function(){

  var job = getQuerystring('job');
  $.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);

    var url = "../../../dataStorage/"+response.request+"/"+job+"/ResponseProcess_Job_Clustering.csv";

    Plotly.d3.csv(url, function(err, rows){

      function unpack(rows, key) {
          return rows.map(function(row) {
            return row[key.replace('.',' ')];
          });
      }

      var trace1 = {
        x: unpack(rows,'calinski_harabaz_score'),
        name: 'control',
        autobinx: true,
        histnorm: "count",
        marker: {
          color: "rgba(255, 100, 102, 0.7)",
          line: {
            color:  "rgba(255, 100, 102, 1)",
            width: 1
          }
        },
        
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
      Plotly.newPlot('histogramCalinski', data, layout);

    });
  });
}
