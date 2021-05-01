$(window).on('load', function() {

	listar();
	eliminar();
	editar();
	
});

$.fn.DataTable.ext.pager.numbers_length = 5;

var listar = function(){
	var t = $('#users').DataTable({
		"responsive": true,
		"destroy":true,
		"ajax":{
			"method":"POST",
			"url": "../php/institution/showData.php"
		},
		"columns":[
			{"data":"idinstitution"},
			{"data":"nameInstitution"},
			{"data":"name"},
			{"data":"createdInstitution"},
			{"data":"modifiedInstitution"},
			{"defaultContent": "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#myModalEditar'><i class='fa fa-pencil-square-o'></i></button>	<button type='button' class='eliminar btn btn-danger' data-toggle='modal' data-target='#modalEliminar' ><i class='fa fa-trash-o'></i></button>"}
		]
	});

	obtener_id_eliminar("#users tbody", t);
	obtener_data_editar("#users tbody", t);
}

var obtener_id_eliminar = function(tbody, table){
	$(tbody).on("click", "button.eliminar", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var idinstitution = $("#frmEliminar #idinstitution").val( data.idinstitution );
	});
}


var obtener_data_editar = function(tbody, table){
	$(tbody).on("click", "button.editar", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var nameInstitution = $("#frmEditar #nameInstitution").val(data.nameInstitution);
		var idinstitution = $("#frmEditar #idinstitution").val( data.idinstitution );

	});
}

var eliminar = function(){
	$("#eliminar-country").on("click", function(){
		var idinstitution = $("#frmEliminar #idinstitution").val();
		$.ajax({
			method:"POST",
			url: "../php/institution/removeData.php",
			data: {
					"idinstitution": idinstitution
			}
		}).done( function( info ){
			var json_info = JSON.parse( info );
			//mostrar_mensaje( json_info );
			location.reload(true);
		});
	});
}

var editar = function(){
	$("#editar-country").on("click", function(){

		var nameInstitution = $("#frmEditar #nameInstitution").val();
		var idinstitution = $("#frmEditar #idinstitution").val();

		$.ajax({
			method: "POST",
			url: "../php/institution/editData.php",
			data: {
				"nameInstitution"   : nameInstitution,
				"idinstitution" : idinstitution
			}

		}).done( function( info ){

			var json_info = JSON.parse( info );
			//mostrar_mensaje( json_info );
			location.reload(true);
		});
	});
}
