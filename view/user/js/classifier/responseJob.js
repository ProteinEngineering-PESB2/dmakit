$(document).ready(function() {

	loadInfoAlgorithm();
	showDefinitionData();
	loadImagenes();

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

function loadImagenes(){

	var job = getQuerystring('job');
	$.ajax({
		method: "POST",
		url: "../php/requestValues.php"
	}).done( function( info ){
		var response = JSON.parse(info);

		var nameFile = "../../../dataStorage/"+response.request+"/"+job+"/responseTraining"+job+".json";

		readTextFile(nameFile, function(text){
			var data = JSON.parse(text);

			if (data.errorExec.curveLearning == "ok"){
				var img = document.getElementById('learningCurveImg');
	    	img.src= "../../../dataStorage/"+response.request+"/"+job+"/curveLearning_"+job+".svg";
			}else{
				var img = document.getElementById('learningCurveImg');
	    	img.src= "../../../view/user/resourceData/error.png";
			}

			var params_values = JSON.stringify(data.Params).replace(new RegExp("{", 'g'), "");
			var params_values = params_values.replace(new RegExp("}", 'g'), "");
			var params_values = params_values.replace(new RegExp("\"", 'g'), "");
			var params_values = params_values.replace(new RegExp(",", 'g'), " ");
			console.log(params_values);


			$(".precision").html(parseFloat(data.Performance.precision).toFixed(4)*100+"%");
			$(".accuracy").html(parseFloat(data.Performance.accuracy).toFixed(4)*100+"%");
			$(".recall").html(parseFloat(data.Performance.recall).toFixed(4)*100+"%");
			$(".f1_score").html(parseFloat(data.Performance.f1).toFixed(4)*100);
			$(".fbeta").html(parseFloat(data.Performance.fbeta).toFixed(4)*100);
			$(".negloss").html(parseFloat(data.Performance.neg_log_loss).toFixed(2));

			//creamos el text para los params...
			$(".algorithm").html(data.algorithm);
			$(".params_values").html(params_values);
			$(".validation").html(data.Validation);
			$(".transform").html(JSON.stringify(data.classTransform));



						//hacemos el grafico de fiabilidad y bakanosidad
						var xData = data.matrixConfusionResponse.header;

						var trace1 = {
							x: xData,
							y: data.matrixConfusionResponse.fiabilidad,
							name: 'Specificity',
							type: 'bar'
						};

						var trace2 = {
							x: xData,
							y: data.matrixConfusionResponse.bakanosidad,
							name: 'Sensitivity',
							type: 'bar'
						};

						var dataLa = [trace1, trace2];

						var layout = {
							barmode: 'group',

							yaxis:{
								title:'Values in %'
							},

							xaxis:{
								title:'Class in dataset'
							}

						};

						Plotly.newPlot('fiabilidad', dataLa, layout);

						//hacemos el heat map de la matriz de confusion
						var colorscaleValue = [
							[0, '#3D9970'],
							[1, '#001f3f']
						];
						var dataHeat = [
							{
								z: data.matrixConfusionResponse.matrix,
								x: xData,
								y: xData,
								type: 'heatmap',
								colorscale: colorscaleValue
							}
						];

						var layout = {

							annotations: [],
							xaxis: {
								title: 'Prediction Values',
							}

						};

						for ( var i = 0; i < xData.length; i++ ) {
							for ( var j = 0; j < xData.length; j++ ) {
								var currentValue = data.matrixConfusionResponse.matrix[i][j];
								if (currentValue != 0.0) {
									var textColor = 'white';
								}else{
									var textColor = 'black';
								}
								var result = {
									xref: 'x1',
									yref: 'y1',
									x: xData[j],
									y: xData[i],
									text: data.matrixConfusionResponse.matrix[i][j],
									font: {
										family: 'Arial',
										size: 16,
										color: 'rgb(50, 171, 96)'
									},
									showarrow: false,
									font: {
										color: textColor
									}
								};
								layout.annotations.push(result);
							}
						}

						Plotly.newPlot('confusionMatrixGraph', dataHeat, layout);
		});
	});
}
function showDefinitionData(){

  var algorithm = getQuerystring('algorithm');
  console.log(algorithm);
	var nameFile = "../../../view/user/resourceData/dataDefinitions.json";

	readTextFile(nameFile, function(text){
		var data = JSON.parse(text);

		$(".confusionMatrixDef").html(data.curveRepresentation[0].definition);
		$(".learningCurveDef").html(data.curveRepresentation[2].definition);

		$(".precisionDef").html(data.definitionPerformanceCla[0].definition);
		$(".accuracyDef").html(data.definitionPerformanceCla[1].definition);
    $(".recallDef").html(data.definitionPerformanceCla[2].definition);
		$(".f1_scoreDef").html(data.definitionPerformanceCla[4].definition);

	});

}

//funcion para cargar la definicion del algoritmo
function loadInfoAlgorithm(){

	var job = getQuerystring('job');
	var nameFile = "../../../view/user/resourceData/dataDefinitions.json";
	var algorithm = getQuerystring('alg');

	readTextFile(nameFile, function(text){

		var data = JSON.parse(text);
		$(".algorithmValue").html(data.classificationAlgorithm[algorithm].nameAlgorithm);
		$(".explanation").html(data.classificationAlgorithm[algorithm].definition);
		$(".paramsDefinition").html(data.classificationAlgorithm[algorithm].params);

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
