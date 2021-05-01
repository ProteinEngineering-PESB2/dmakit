$(document).ready(function() {

	loadBoxPlot();
});

//funcion que permite cargar el boxplot
function loadBoxPlot(){

	var job = getQuerystring('job');

	$.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var responseS = JSON.parse(info);
		var docFile = "../../../dataStorage/"+responseS.request+"/"+job+"/responseDispersion"+job+".json";
		readTextFile(docFile, function(text){
			var dataResponse = JSON.parse(text);

			var data = [];
			var dataViolin = [];

			//comenzamos a crear las key
			for (i=0;i<dataResponse.keys.length; i++){
				data[i] = createTrace(dataResponse.data[i], dataResponse.keys[i]);
				dataViolin[i] = createTraceForViolin(dataResponse.data[i], dataResponse.keys[i]);
			}

			//formamos el grafico box plot...
			var layout = {
			  title: 'Features dispersion in box plot view for submit data set'
			};

			var layoutViolin = {
			  title: 'Features dispersion in violin plot view for submit data set'
			};

			Plotly.newPlot('boxplot', data, layout);

			Plotly.newPlot('violinPlot', dataViolin, layoutViolin);

		});
	});
}

//funcion que permite crear un trace
function createTrace(data, key){

	var trace = {
		y: data,
		type: 'box',
		name: key,
		marker: {
			color: 'rgb(8,81,156)',
			outliercolor: 'rgba(219, 64, 82, 0.6)',
			line: {
				outliercolor: 'rgba(219, 64, 82, 1.0)',
				outlierwidth: 2
			}
		},
		boxpoints: 'suspectedoutliers'
	};

	return trace;
}

//funcion que permite crear un trace
function createTraceForViolin(data, key){

	var trace = {
		y: data,
		type: 'violin',
		name: key,
		marker: {
			color: 'rgb(8,81,156)',
			outliercolor: 'rgba(219, 64, 82, 0.6)',
			line: {
				outliercolor: 'rgba(219, 64, 82, 1.0)',
				outlierwidth: 2
			}
		},
		boxpoints: 'suspectedoutliers'
	};

	return trace;
}

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

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};
