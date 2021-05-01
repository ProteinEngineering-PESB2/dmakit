$(window).on('load', function() {

	processModel();

});

var processModel = function(){
	$("#processJob").on("click", function(){

		$('#loading').show();
		var idmodel = getQuerystring("model");
		var idjob = getQuerystring("job");

		$.ajax({
			method: "POST",
			url: "../php/models/tryModel.php",
			data: {
					"idmodel"   : idmodel,
					"idjob" : idjob
				}

		}).done( function( info ){

			$('#loading').hide();
			var json_info = JSON.parse( info );

			if (json_info.response == "OK"){
				$('#viewResponse').show();
			}else{
				$('#errorResponse').show();
				setTimeout("location.href=''", 5000);
			}
		});
	});
}

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};
