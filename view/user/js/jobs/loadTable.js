$(window).on('load', function() {

	listar();
	removeJob();

});

$.fn.DataTable.ext.pager.numbers_length = 5;

var listar = function(){
	var t = $('#jobs').DataTable({
		"responsive": true,
		"destroy":true,
		"order": [[ 5, "desc" ]],
		"ajax":{
			"method":"POST",
			"url": "../php/jobs/showJobs.php"
		},
		"columns":[
			{"data":"idjob"},
			{"data":"nameJob"},
			{"data":"descriptionJob"},
			{"data":"tipo_job"},
			{"data":"statusJob"},
			{"data":"createdJob"},
			{"data":"modifiedJob"},
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
		var idjob = $("#frmEditar #idjob").val( data.idjob );
	});
}

//metodo para obtener el id y asi generar la edicion del usuario...
var getIDForDetail = function(tbody, table){
	$(tbody).on("click", "button.detail", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var idjob = data.idjob;
		var tipo = data.tipo_job;

		var statusJob = data.statusJob;

		if (statusJob != "ERROR" && statusJob != "START" &&  statusJob != "PROCESING"){

			//opciones relacionadas con el analisis de caracteristicas
			if (tipo == "CORRELATION"){
				location.href="../characteristic/responseCorrelation.php?job="+idjob;
			}else if (tipo == "MUTUAL-INFORMATION") {
				location.href="../characteristic/responseMI.php?job="+idjob;
			}else if (tipo == "PCA" ) {
				location.href="../characteristic/responsePCA.php?job="+idjob;
			}else if (tipo == "PCA-INCREMENTAL") {
				location.href="../characteristic/responseIncrementalPCA.php?job="+idjob;
			}else if (tipo == "KERNEL-PCA") {
				location.href="../characteristic/responseKPCA.php?job="+idjob;
			}else if (tipo == "SPATIAL DEFORMATION") {
				location.href="../characteristic/responseSpatial.php?job="+idjob;
			}

			//opciones relacionadas con el analisis estadistico
			else if (tipo == "VIEW CONTINUOS DATA") {
				location.href="../statistic/selectedFeature.php?job="+idjob+"&process=0";
			}else if (tipo == "DISTRIBUTION") {
				location.href="../statistic/selectedFeature.php?job="+idjob+"&process=1";
			}else if (tipo == "DISPERSION") {
				location.href="../statistic/responseDispersion.php?job="+idjob;
			}else if (tipo == "FREQUENCE") {
				location.href="../statistic/selectedFeature.php?job="+idjob+"&process=3";
			}else if (tipo == "PARALLEL-COORDINATES") {
				location.href="../statistic/selectedFeature.php?job="+idjob+"&process=4";
			}else if (tipo == "SPLOM") {
				location.href="../statistic/selectedFeature.php?job="+idjob+"&process=5";
			}else if (tipo == "STATISTIC SUMMARY") {
				location.href="../statistic/responseStatistical.php?job="+idjob;
			}

			//opciones relacionadas con clustering
			else if (tipo == "CLUSTERING-FULL") {
				location.href="../clustering/responseJob.php?job="+idjob+"&scale=1";
			}else if (tipo == "CLUSTERING K-MEANS") {
				location.href="../clustering/viewResult.php?job="+idjob+"&algorithm=0";
			}else if (tipo == "CLUSTERING BIRCH") {
				location.href="../clustering/viewResult.php?job="+idjob+"&algorithm=1";
			}else if (tipo == "CLUSTERING AGGLOMERATIVE") {
				location.href="../clustering/viewResult.php?job="+idjob+"&algorithm=2";
			}else if (tipo == "CLUSTERING AFFINITY PROPAGATION") {
				location.href="../clustering/viewResult.php?job="+idjob+"&algorithm=3";
			}else if (tipo == "CLUSTERING MEAN-SHIFT") {
				location.href="../clustering/viewResult.php?job="+idjob+"&algorithm=4";
			}else if (tipo == "CLUSTERING DBScan") {
				location.href="../clustering/viewResult.php?job="+idjob+"&algorithm=5";
			}

			//opciones relacionadas con clasificacion
			else if (tipo == "CLASSIFICATION") {
				location.href="../training/selectedFeature.php?job="+idjob+"&scale=1";
			}

			//opciones relacionadas con prediccion
			else if (tipo == "PREDICTION") {
				location.href="../prediction/selectedFeature.php?job="+idjob+"&scale=1";
			}else if ("LINEAR-MODELS") {
				location.href="../linearModels/selectedFeature.php?job="+idjob+"&scale=1";
			}else{
				$('#STATISTICAL-ANALYSIS').show();
				setTimeout("location.href=''", 3000);
			}
		}else{

			$('#errorResponse').show();
			setTimeout("location.href=''", 5000);
		}
	});
}


var removeJob = function(){
	$("#editar-user").on("click", function(){

		var idjob = $("#frmEditar #idjob").val();

		$.ajax({
			method: "POST",
			url: "../php/jobs/dropJob.php",
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
