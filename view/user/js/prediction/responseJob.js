$(document).ready(function() {

	loadInfoAlgorithm();
	loadTables();
	savemodel();

});

function savemodel(){

	$("#export").on("click", function(){

			var idjob = getQuerystring('job');

			$.ajax({
				method: "POST",
				url: "../php/classifier/exportModel.php",
				data: {
						"idjob"   : idjob
					}

			}).done( function( info ){

				var json_info = JSON.parse( info );
				console.log(json_info);
				mostrar_mensaje( json_info );
				//location.reload(true);
			});

	});
}

var mostrar_mensaje = function( informacion ){

	var texto = "", color = "";
	if( informacion.response == "BIEN" ){
		texto = "<strong>Ok!</strong> Model saved successful!.";
		color = "#379911";
	}else{
		texto = "<strong>Error</strong>, Error during save job.";
		color = "#C9302C";
	}

	$(".responseExportModel").html( texto ).css({"color": color });
	$(".responseExportModel").fadeOut(5000, function(){
		$(this).html("");
		$(this).fadeIn(3000);
	});
}

//funcion para cargar las performance y summary process
function loadTables(){

	var job = getQuerystring('job');
	$.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);
		var nameFile = "../../../dataStorage/"+response.request+"/"+job+"/responseTraining"+job+".json";

		readTextFile(nameFile, function(text){
			var data = JSON.parse(text);

			var params_values = JSON.stringify(data.Params).replace(new RegExp("{", 'g'), "");
			var params_values = params_values.replace(new RegExp("}", 'g'), "");
			var params_values = params_values.replace(new RegExp("\"", 'g'), "");
			var params_values = params_values.replace(new RegExp(",", 'g'), " ");

			//creamos el text para los params...
			$(".algorithm").html(data.algorithm);
			$(".params_values").html(params_values);
			$(".r_score").html(JSON.stringify(data.Performance.r_score));
			$(".pearson").html(JSON.stringify(data.Performance.pearson));
			$(".spearman").html(JSON.stringify(data.Performance.spearman));
			$(".kendalltau").html(JSON.stringify(data.Performance.kendalltau));


			//obtenemos los valores de las predicciones y los reales...
			var valuesPredict = data.Performance.predict_values;
			var valuesReal = data.Performance.real_values;
			var xValues = [];
			var errorGraphic = [];

			//generamos el array con las x...
			for (i=0;i<valuesReal.length; i++){
				xValues.push(i+1);
				errorGraphic[i] = valuesReal[i]-valuesPredict[i];

			}

			//generamos el grafico...
			createGraphicData(valuesReal, valuesPredict, xValues);
			createGraphicDataOnlyTrace(errorGraphic, xValues);


		});
	});
}

//funcion para cargar el grafico
function createGraphicData(valuesReal, valuesPredict, xValues){

	var trace1 = {
		x: valuesReal,
	  y: valuesPredict,
	  mode: 'markers',
	  type: 'scatter',
    marker: {
      color: 'rgb(219, 64, 82)',
      size: 12
    }
	};

  var layout = {
    xaxis:{
      title: "Real Values"
    },

    yaxis:{
      title: "Predicted Values"
    }
  }
	var data = [trace1];

	Plotly.newPlot('predictionData', data, layout);

}

//funcion para cargar el grafico
function createGraphicDataOnlyTrace(values, xValues){

	//formamos la trace...
	var trace2 = {
		x: values,
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
/*
	var trace2 = {
		x: xValues,
		  y: values,
		  mode: 'markers',
		name: 'Error Values',
		line: {
		      line: {shape: 'spline'}
    		},
		marker: {
      color: 'rgb(219, 64, 82)',
      size: 12
    }


	};
*/
	var data = [trace2];

	Plotly.newPlot('errorGraphic', data);

}


//funcion para cargar la definicion del algoritmo
function loadInfoAlgorithm(){

	var algorithm = getQuerystring('alg');
	console.log(algorithm);
	var nameFile = "../../../view/user/resourceData/dataDefinitions.json";

	readTextFile(nameFile, function(text){
		var data = JSON.parse(text);
		$(".algorithmName").html(data.predictionAlgorithm[algorithm].nameAlgorithm);
		$(".explanation").html(data.predictionAlgorithm[algorithm].definition);

	});

}
//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};

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
