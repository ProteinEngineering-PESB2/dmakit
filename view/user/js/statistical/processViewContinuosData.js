$(document).ready(function() {

	createScatterView();

});


function createScatterView() {

	var job = getValuesURL('job');
	var feature = getValuesURL('feature');

	console.log(feature);

	//hago la llamada a php para obtener la data...
	$.ajax({
			method:"POST",
			url: "../php/statistical/getDataSet.php?job="+job

		}).done( function(info){

			//obtenemos el nombre del set de datos
			var response = JSON.parse(info);
			console.log(response.nameFile);

			//formamos el nombre del csv...
			$.ajax({
				method: "POST",
				url: "../php/requestValues.php"
			}).done( function( info ){
				var responseS = JSON.parse(info);
				var nameCSV = "../../../dataStorage/"+responseS.request+"/"+job+"/"+response.nameFile;
				Plotly.d3.csv(nameCSV, function(err, rows){

			    function unpack(rows, key) {
						console.log(key);
			        return rows.map(function(row) { return row[key]; });
			    }

					//obtenemos la data
			    var valuesData = unpack(rows, feature);
					console.log(valuesData);

					//formamos la trace...
					var trace = {
						y : valuesData,
						mode: 'lines+markers',
					  name: feature,
					  line: {
							shape: 'spline'
						},
					  type: 'scatter'
					};

					var dataGraphic = [trace];
					var layout = {
					  legend: {
					    y: 0.5,
					    traceorder: 'reversed',
					    font: {size: 16},
					    yref: 'paper'
					  }};

			    Plotly.newPlot('continuosData', dataGraphic, layout)

				});
			});
		});
}
//funcion para recuperar la clave del valor obtenido por paso de referencia
function getValuesURL(key) {

	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;

}
