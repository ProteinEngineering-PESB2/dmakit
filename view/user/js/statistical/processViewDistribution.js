$(document).ready(function() {

	createScatterView();
	applyShapiro();
});


function createScatterView() {

	var job = getValuesURL('job');
	var feature = getValuesURL('feature');

	//hago la llamada a php para obtener la data...
	$.ajax({
			method:"POST",
			url: "../php/statistical/getDataSet.php?job="+job

		}).done( function(info){

			//obtenemos el nombre del set de datos
			var response = JSON.parse(info);

			//formamos el nombre del csv...
			$.ajax({
				method: "POST",
				url: "../php/requestValues.php"
			}).done( function( info ){
				var responseS = JSON.parse(info);
				var nameCSV = "../../../dataStorage/"+responseS.request+"/"+job+"/"+response.nameFile;
				Plotly.d3.csv(nameCSV, function(err, rows){

			    function unpack(rows, key) {

			       return rows.map(function(row) { return row[key]; });
			    }

					//obtenemos la data
			    var valuesData = unpack(rows, feature);

					//formamos la trace...
					var trace = {
					  x: valuesData,
					  name: 'control',
					  autobinx: true,
					  histnorm: "count",
					  marker: {
					    color: "rgba(128, 0, 0, 1)",
					     line: {
					      color:  "rgba(128, 0, 0, 1)",
					      width: 1
					    }
					  },
					  
					  type: "histogram"
					};

					var dataGraphic = [trace];
					var layout = {
					  bargap: 0.05,
					  bargroupgap: 0.2,
					  barmode: "overlay",
					  xaxis: {title: "Values in Feature"},
					  yaxis: {title: "Frequence in distribution"}
					};
			    Plotly.newPlot('histogram', dataGraphic, layout);

				});
			});
		});
}

//funcion que permite generar la distribucion acumulada...
function normalcdf(mean, sigma, to){
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0){
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}
//funcion para recuperar la clave del valor obtenido por paso de referencia
function getValuesURL(key) {

	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;

}

//funcion para aplicar el test de shapiro...
function applyShapiro() {

	var job = getValuesURL('job');
	var feature = getValuesURL('feature');

	//hago la llamada a php para obtener la data...
	$.ajax({
			method:"POST",
			url: "../php/statistical/applyShapiro.php?job="+job+"&feature="+feature

		}).done( function(info){

			//obtenemos el nombre del set de datos
			var response = JSON.parse(info);

			//ahora modificamos los valores de la tabla...
			$(".statisticValue").html(parseFloat(response.statistic).toFixed(4));
			$(".pvalue").html(parseFloat(response.pvalue).toFixed(4));

		});
}
