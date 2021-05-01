$(document).ready(function() {

	execAlgorithm();
});

function execAlgorithm() {

	$("#processJob").on("click", function(){
		$('#loading').show();

		var job = getValuesURL('job');
		var scale = getValuesURL('scale');
		var response = getValuesURL('response');
		var algorithm = $("#initNewJob #algorithm").val();

		//hacemos la llamada por ajax para ejecutar el algoritmo...
		$.ajax({
			method: "POST",
			url: "../php/linearModels/execAlgorithm.php",
			data: {
				"algorithm"   : algorithm,
				"job" : job,
				"response" : response,
				"scale" : scale
			}
		}).done( function( info ){
			var response = JSON.parse(info);
			console.log(response);

			if (response.exec == "ERROR"){
				$('#loading').hide();
				$('#errorResponse').show();
				//setTimeout("location.href=''", 5000);
			}else{
			responseData = response.fileResponse;

				readTextFile(responseData, function(text){
					var data = JSON.parse(text);
					console.log(data);
					//trabajamos con la respuesta...
					if (data.errorExec.Process == "OK"){
						location.href="responseTraining.php?job="+job+"&alg="+algorithm;
					}else{
						$('#loading').hide();
						$('#errorResponse').show();
						//setTimeout("location.href=''", 5000);
					}
				});
			}
		});
	});
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
function getValuesURL(key) {

	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
}
