$(document).ready(function() {

	listValues();
});

$.fn.DataTable.ext.pager.numbers_length = 5;

//listamos los datos...
var listValues = function(){
	var job = getValuesURL('job');
	var url = "../php/statistical/showFeatures.php?job="+job;
	console.log(url);
  var t = $('#features').DataTable({

      "responsive": true,
      "dom": '<"newtoolbar">frtip',
      "destroy":true,
      "ajax":{
        "method":"POST",
        "url": url
      },

      "columns":[
        {"data":"nameFeature"},
				{"data":"kind"},
        {"defaultContent":"<button type='button' class='processJob btn btn-success'><i class='fa fa-list'></i></button>"}
      ]
  });
  $('#demo-custom-toolbar2').appendTo($("div.newtoolbar"));

	get_values_params("#features tbody", t);

}

var get_values_params = function(tbody, table){
	$(tbody).on("click", "button.processJob", function(){

		$('#loading').show();

		var data = table.row( $(this).parents("tr") ).data();
		var feature = data.nameFeature;
		var kindSelected = data.kind;
		var job = getValuesURL('job');
		var option = getValuesURL('scale');
		var kind = getValuesURL('kind');

		//hacemos el redireccionamiento dependiento de lo seleccionado...
		if (kind == "CLASS"){//view continous data

			//evaluamos si selecciono un tipo de dato continuo...
			if (kindSelected =="DISCRETA"){

				$.ajax({
					method: "POST",
					url: "../php/characteristic/execSpatial.php",
					data: {
						"job"   : job,
						"option"   : option,
						"kindDataSet" : kind,
						"feature" : feature
					}
				}).done( function( info ){
					var response = JSON.parse(info);

					if (response.exec== "ERROR"){
						$('#loading').hide();
						$('#errorResponse').show();
						setTimeout("location.href=''", 5000);
					}else{
						responseData = response.fileResponse;
						console.log(response);
						readTextFile(responseData, function(text){
							var data = JSON.parse(text);
							console.log(data);
							//trabajamos con la respuesta...
							if (data.Response == "OK"){
								location.href="responseSpatial.php?job="+job;

							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});

			}else{
				$('#errorResponseDiscrete').show();
				setTimeout("location.href=''", 5000);
			}
		}else {

			//evaluamos si selecciono un tipo de dato continuo...
			if (kindSelected =="CONTINUA"){
				$.ajax({
					method: "POST",
					url: "../php/characteristic/execSpatial.php",
					data: {
						"job"   : job,
						"option"   : option,
						"kindDataSet" : kind,
						"feature" : feature
					}
				}).done( function( info ){
					var response = JSON.parse(info);

					if (response.exec== "ERROR"){
						$('#loading').hide();
						$('#errorResponse').show();
						setTimeout("location.href=''", 5000);
					}else{
						responseData = response.fileResponse;
						console.log(response);
						readTextFile(responseData, function(text){
							var data = JSON.parse(text);
							console.log(data);
							//trabajamos con la respuesta...
							if (data.Response == "OK"){
								location.href="responseSpatial.php?job="+job;

							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}else{
				$('#errorResponseContinue').show();
				setTimeout("location.href=''", 5000);
			}
		}
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
