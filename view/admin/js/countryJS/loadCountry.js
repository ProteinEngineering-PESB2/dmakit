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
			"url": "../php/country/showData.php"
		},
		"columns":[
			{"data":"idcountry"},
			{"data":"name"},
			{"data":"createdCountry"},
			{"data":"modifiedCountry"},
			{"defaultContent": "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#myModalEditar'><i class='fa fa-pencil-square-o'></i></button>	<button type='button' class='eliminar btn btn-danger' data-toggle='modal' data-target='#modalEliminar' ><i class='fa fa-trash-o'></i></button>"}
		]
	});

	obtener_id_eliminar("#users tbody", t);
	obtener_data_editar("#users tbody", t);
}

var obtener_id_eliminar = function(tbody, table){
	$(tbody).on("click", "button.eliminar", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var idcategoryReport = $("#frmEliminar #idcountry").val( data.idcountry );
	});
}


var obtener_data_editar = function(tbody, table){
	$(tbody).on("click", "button.editar", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var name = $("#frmEditar #name").val(data.name);
		var idcountry = $("#frmEditar #idcountry").val( data.idcountry );

	});
}

var eliminar = function(){
	$("#eliminar-country").on("click", function(){
		var idcountry = $("#frmEliminar #idcountry").val();
		$.ajax({
			method:"POST",
			url: "../php/country/removeData.php",
			data: {
					"idcountry": idcountry
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

		var name = $("#frmEditar #name").val();
		var idcountry = $("#frmEditar #idcountry").val();

		$.ajax({
			method: "POST",
			url: "../php/country/editData.php",
			data: {
				"name"   : name,
				"idcountry" : idcountry
			}

		}).done( function( info ){

			var json_info = JSON.parse( info );
			//mostrar_mensaje( json_info );
			location.reload(true);
		});
	});
}
