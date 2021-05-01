$(document).ready(function() {

	listValues();
});

$.fn.DataTable.ext.pager.numbers_length = 5;

//listamos los datos...
var listValues = function(){
	var job = getQuerystring('job');
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
		var data = table.row( $(this).parents("tr") ).data();
		var feature = data.nameFeature;
		var kind = data.kind;
		var job = getQuerystring('job');
		var option = getQuerystring('process');
		console.log(option);
		console.log("selected option");
		//hacemos el redireccionamiento dependiento de lo seleccionado...
		if (option == 0){//view continous data

			//evaluamos si selecciono un tipo de dato continuo...
			if (kind =="CONTINUA"){
				location.href="viewContinuosData.php?job="+job+"&feature="+feature;
			}else{
				$('#errorResponseContinue').show();
				setTimeout("location.href=''", 5000);
			}
		}else if (option == 1) {//distribution
			//evaluamos si selecciono un tipo de dato continuo...
			if (kind =="CONTINUA"){
				location.href="viewDistribution.php?job="+job+"&feature="+feature;
			}else{
				$('#errorResponseContinue').show();
				setTimeout("location.href=''", 5000);
			}
		}else if (option == 3) {//frequence
			//evaluamos si selecciono un tipo de dato continuo...
			if (kind =="DISCRETA"){
				location.href="viewFrequence.php?job="+job+"&feature="+feature;
			}else{
				$('#errorResponseDiscrete').show();
				setTimeout("location.href=''", 5000);
			}
		}else if (option == 4) {//parallels
			//evaluamos si selecciono un tipo de dato continuo...
			if (kind =="DISCRETA"){
				location.href="viewParallel.php?job="+job+"&feature="+feature;
			}else{
				$('#errorResponseDiscrete').show();
				setTimeout("location.href=''", 5000);
			}
		}else if (option == 5) {//sploms

			//evaluamos si selecciono un tipo de dato continuo...
			if (kind =="DISCRETA"){
				location.href="viewSploms.php?job="+job+"&feature="+feature;
			}else{
				$('#errorResponseDiscrete').show();
				setTimeout("location.href=''", 5000);
			}
		}
	});
}

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};
