$(window).on('load', function() {

	listar();
	editar();
	eliminar();
	
});

$.fn.DataTable.ext.pager.numbers_length = 5;

var listar = function(){
	var t = $('#users').DataTable({
		"responsive": true,
		"destroy":true,
		"ajax":{
			"method":"POST",
			"url": "../php/users/showData.php"
		},
		"columns":[
			{"data":"fullName"},
			{"data":"emailUser"},
			{"data":"statusUser"},
			{"data":"createdUser"},
			{"data":"modifiedUser"},
			{"data":"nameInstitution"},
			{"data":"name"},
			{"defaultContent": "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#myModalEditar'><i class='fa fa-pencil-square-o'></i></button> <button type='button' class='eliminar btn btn-danger' data-toggle='modal' data-target='#modalEliminar'><i class='fa fa-trash-o'></i></button> <button type='button' class='jobsUser btn btn-success'><i class='fa fa-code-fork'></i></button>"}
		]
	});

	getID("#users tbody", t);
	obtener_id_eliminar("#users tbody", t);
	getIDredirect("#users tbody", t);
}

var obtener_id_eliminar = function(tbody, table){
	$(tbody).on("click", "button.eliminar", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var iduser = $("#frmEliminar #iduser").val( data.iduser );
	});
}

//metodo para obtener el id y asi generar la edicion del usuario...
var getID = function(tbody, table){
	$(tbody).on("click", "button.editar", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var iduser = $("#frmEditar #iduserMOSST").val( data.iduser );
	});
}

//metodo para obtener el id y redireccionar a
var getIDredirect = function(tbody, table){
	$(tbody).on("click", "button.jobsUser", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var iduserMOSST = data.iduser;
		location.href="../jobsUser?data="+iduserMOSST;
	});
}

var editar = function(){
	$("#editar-user").on("click", function(){

		var iduserMOSST = $("#frmEditar #iduserMOSST").val();
		var status = $("#frmEditar #status").val();

		$.ajax({
			method: "POST",
			url: "../php/users/editData.php",
			data: {
					"iduserMOSST"   : iduserMOSST,
					"status" : status
				}

		}).done( function( info ){

			var json_info = JSON.parse( info );
			//mostrar_mensaje( json_info );
			location.reload(true);
		});
	});
}

var eliminar = function(){
	$("#eliminar-user").on("click", function(){
		var iduser = $("#frmEliminar #iduser").val();
		$.ajax({
			method:"POST",
			url: "../php/users/removeData.php",
			data: {
					"iduser": iduser
			}
		}).done( function( info ){
			var json_info = JSON.parse( info );
			//mostrar_mensaje( json_info );
			location.reload(true);
		});
	});
}
