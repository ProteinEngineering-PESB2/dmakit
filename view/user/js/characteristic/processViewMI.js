$(document).ready(function() {

	var job = getQuerystring('job');

	var processed_json = new Array();

  var url = "../php/characteristic/loadMatrixMI.php?job="+job;
	$.getJSON(url, function(data) {

		var array = data.data;
		var x = data.keys;
		var y = data.keys;
		var data = [{
	    z:array,

	    x: x,
	    y: y,
	    type: 'heatmap'
		}];

		Plotly.newPlot('mutualInformationResponse', data);
	});
});

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};
