$(window).on('load', function() {

	listarData();

});

$.fn.DataTable.ext.pager.numbers_length = 5;

var listarData = function(){

	$.ajax({
			method:"POST",
			url: "../php/profile/showData.php",

		}).done( function( info ){

			var info = JSON.parse(info);
			$(".nameUser").html( info.nameUser );
			$(".fullName").html( info.fullName );
			$(".emailUser").html( info.emailUser );
			$(".institution").html( info.nameInstitution );
			$(".country").html( info.name );

		});

}
