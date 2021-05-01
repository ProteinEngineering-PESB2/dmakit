$(document).ready(function() {

	var job = getQuerystring('job');

	$.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);

		var nameDocument = "../../../dataStorage/"+response.request+"/"+job+"/PCTPCA_"+job+".csv";

		Plotly.d3.csv(nameDocument, function(err, rows){

			function unpack(rows, key) {
					return rows.map(function(row) { return row[key.replace('.',' ')]; });
			}

			var attributes = unpack(rows,'Component');

			var importance = unpack(rows,'Relevance');


			//make color...
			colorValues = [];
			for (i=0; i<importance.length; i++){
				if (i<3){
					colorValues[i] = 'rgba(222,45,38,0.8)';
				}else{
					colorValues[i] = 'rgba(204,204,204,1)';
				}
			}
			var trace1 = {
			  x: attributes,
			  y: importance,
			  marker:{
			    color: colorValues
			  },
			  type: 'bar'
			};

			var layout = {
			  yaxis: {
			    title: 'Explanation of variance for components (%)',
			  }
			};
			var data = [trace1];


			Plotly.newPlot('relevance', data, layout);

		});
	});
});

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};
