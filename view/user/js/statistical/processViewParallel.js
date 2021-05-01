$(document).ready(function() {

	createParallelCurve();

});


function createParallelCurve() {

	var job = getValuesURL('job');
	var feature = getValuesURL('feature');

	//hago la llamada a php para obtener la data...
	$.ajax({
			method:"POST",
			url: "../php/statistical/getDataSetAndFeatures.php?job="+job

		}).done( function(info){

			//obtenemos el nombre del set de datos
			var response = JSON.parse(info);
			var featuresContinues = response.features;
			console.log(featuresContinues);

			//formamos el nombre del csv...
			$.ajax({
				method: "POST",
				url: "../php/requestValues.php"
			}).done( function( info ){
				var responseS = JSON.parse(info);
				var nameCSV = "../../../dataStorage/"+responseS.request+"/"+job+"/"+response.nameFile;
				Plotly.d3.csv(nameCSV, function(err, rows){

			    function unpack(rows, key) {
						return rows.map(function(row) {
							return row[key];
						});
			    }

					var dimensionsData = [];
					//formamos el array de las dimensiones...
					for (i=0; i<featuresContinues.length; i++){

						var dataResponse = {label:featuresContinues[i], values:unpack(rows, featuresContinues[i])};
						console.log(dataResponse);
						dimensionsData.push(dataResponse)
					}

					//obtenemos los elementos unicos del feature
					var uniqueValuesFeature = unpack(rows, feature);
					uniqueValuesFeature = uniqueValuesFeature.unique();

					//definimos los colores por cada tipo de valor existente en el
					colors = []
			    for (i=0; i < unpack(rows, feature).length; i++) {

						for (j=0; j<uniqueValuesFeature.length;j++){
							if (unpack(rows, feature)[i] == uniqueValuesFeature[j]){
								colors.push(j);
							}
						}
			    }
					var pl_colorscale=[
	               [0.0, '#19d3f3'],
	               [0.333, '#19d3f3'],
	               [0.333, '#e763fa'],
	               [0.666, '#e763fa'],
	               [0.666, '#636efa'],
	               [1, '#636efa']
			    ]

					var data = [{
			      type: 'parcoords',
			      dimensions: dimensionsData,

						pad: [80,80,80,80],
					  line: {
					    color: colors,
					    colorscale: pl_colorscale
					  },
			    }]

			    var layout = {
			      width: 1050
			    }

			    Plotly.react('parallelData', data, layout)

				});
			});
		});
}

Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getValuesURL(key) {

	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;

}
