$(window).on('load', function() {

	listar();
	removeJob();

});

$.fn.DataTable.ext.pager.numbers_length = 5;

var listar = function(){
	var t = $('#jobs').DataTable({
		"responsive": true,
		"destroy":true,
		"ajax":{
			"method":"POST",
			"url": "../php/models/showData.php"
		},
		"columns":[
			{"data":"idmodelo"},
			{"data":"idjob"},
			{"data":"tipo_job"},
			{"data":"nameDataset"},
			{"data":"createModel"},
			{"defaultContent": "<button type='button' class='detail btn btn-success'><i class='fa fa-file'></i></button> <button type='button' class='delete btn btn-danger' data-toggle='modal' data-target='#myModalEditar'><i class='fa fa-trash'></i></button>"}
		]
	});

	getID("#jobs tbody", t);
	getIDForDetail("#jobs tbody", t);

}

//metodo para obtener el id y asi generar la edicion del usuario...
var getID = function(tbody, table){
	$(tbody).on("click", "button.delete", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var idjob = $("#frmEditar #idjob").val( data.idmodelo );
	});
}

//metodo para obtener el id y asi generar la edicion del usuario...
var getIDForDetail = function(tbody, table){
	$(tbody).on("click", "button.detail", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var idmodelo = data.idmodelo;
		var idjob = data.idjob;

		location.href="../models/useModel.php?model="+idmodelo+"&job="+idjob;

	});
}


var removeJob = function(){
	$("#editar-user").on("click", function(){

		var idjob = $("#frmEditar #idjob").val();

		$.ajax({
			method: "POST",
			url: "../php/models/removeModels.php",
			data: {
					"idjob"   : idjob
				}

		}).done( function( info ){

			var json_info = JSON.parse( info );
			mostrar_mensaje( json_info );
			location.reload(true);
		});
	});
}

var mostrar_mensaje = function( informacion ){

	var texto = "", color = "";
	if( informacion.response == "BIEN" ){
		texto = "<strong>Ok!</strong> Job deleted successful!.";
		color = "#379911";
	}else{
		texto = "<strong>Error</strong>, It is not feasible delete this job.";
		color = "#C9302C";
	}

	$(".mensaje").html( texto ).css({"color": color });
	$(".mensaje").fadeOut(5000, function(){
		$(this).html("");
		$(this).fadeIn(3000);
	});
}
