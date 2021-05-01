$(window).on('load', function() {

	listarDBScan();
	listarMeanShift();
	listarAffinity();
	listarKMeans();
	listarBirch();
	listarAgglomerative();

});

$.fn.DataTable.ext.pager.numbers_length = 5;

//funcion para recuperar la clave del valor obtenido por paso de referencia
function getQuerystring(key) {
	var url_string = window.location;
	var url = new URL(url_string);
	var c = url.searchParams.get(key);
	return c;
};

//listamos los datos...
var listarDBScan = function(){
	var job = getQuerystring('job');
	var url = "../php/clustering/loadDataCSV.php?job="+job+"&algorithm=DBScan";
	console.log(url);
  var t = $('#summaryMean').DataTable({

      "responsive": true,
      "dom": '<"newtoolbar">frtip',
			"order": [[ 3, "desc" ]],
      "destroy":true,
      "ajax":{
        "method":"POST",
        "url": url
      },

      "columns":[
        {"data":"algorithm"},
        {"data":"params"},
        {"data":"groups"},
        {"data":"calinski_harabaz_score"},
        {"data":"silhouette_score"}
      ]
  });
  $('#demo-custom-toolbar2').appendTo($("div.newtoolbar"));

	get_values_params("#summaryMean tbody", t);
}

//listamos los datos...
var listarMeanShift = function(){
	var job = getQuerystring('job');
	var url = "../php/clustering/loadDataCSV.php?job="+job+"&algorithm=Mean";
	console.log(url);
  var t = $('#summaryDBScan').DataTable({

      "responsive": true,
      "dom": '<"newtoolbar">frtip',
			"order": [[ 3, "desc" ]],
      "destroy":true,
      "ajax":{
        "method":"POST",
        "url": url
      },

      "columns":[
        {"data":"algorithm"},
        {"data":"params"},
        {"data":"groups"},
        {"data":"calinski_harabaz_score"},
        {"data":"silhouette_score"}
      ]
  });
  $('#demo-custom-toolbar2').appendTo($("div.newtoolbar"));

	get_values_params("#summaryDBScan tbody", t);
}

//listamos los datos...
var listarAffinity = function(){
	var job = getQuerystring('job');
	var url = "../php/clustering/loadDataCSV.php?job="+job+"&algorithm=Affinity";
	console.log(url);
  var t = $('#summaryAffinity').DataTable({

      "responsive": true,
      "dom": '<"newtoolbar">frtip',
			"order": [[ 3, "desc" ]],
      "destroy":true,
      "ajax":{
        "method":"POST",
        "url": url
      },

      "columns":[
        {"data":"algorithm"},
        {"data":"params"},
        {"data":"groups"},
        {"data":"calinski_harabaz_score"},
        {"data":"silhouette_score"}
      ]
  });
  $('#demo-custom-toolbar2').appendTo($("div.newtoolbar"));

	get_values_params("#summaryAffinity tbody", t);
}

//listamos los datos...
var listarKMeans = function(){
	var job = getQuerystring('job');
	var url = "../php/clustering/loadDataCSV.php?job="+job+"&algorithm=Kmeans";
	console.log(url);
  var t = $('#summaryKMeans').DataTable({

      "responsive": true,
      "dom": '<"newtoolbar">frtip',
			"order": [[ 3, "desc" ]],
      "destroy":true,
      "ajax":{
        "method":"POST",
        "url": url
      },

      "columns":[
        {"data":"algorithm"},
        {"data":"params"},
        {"data":"groups"},
        {"data":"calinski_harabaz_score"},
        {"data":"silhouette_score"}
      ]
  });
  $('#demo-custom-toolbar2').appendTo($("div.newtoolbar"));

	get_values_params("#summaryKMeans tbody", t);
}

//listamos los datos...
var listarBirch = function(){
	var job = getQuerystring('job');
	var url = "../php/clustering/loadDataCSV.php?job="+job+"&algorithm=birch";
	console.log(url);
  var t = $('#summaryBirch').DataTable({

      "responsive": true,
      "dom": '<"newtoolbar">frtip',
			"order": [[ 3, "desc" ]],
      "destroy":true,
      "ajax":{
        "method":"POST",
        "url": url
      },

      "columns":[
        {"data":"algorithm"},
        {"data":"params"},
        {"data":"groups"},
        {"data":"calinski_harabaz_score"},
        {"data":"silhouette_score"}
      ]
  });
  $('#demo-custom-toolbar2').appendTo($("div.newtoolbar"));

	get_values_params("#summaryBirch tbody", t);
}

//listamos los datos...
var listarAgglomerative = function(){
	var job = getQuerystring('job');
	var url = "../php/clustering/loadDataCSV.php?job="+job+"&algorithm=agglo";
	console.log(url);
  var t = $('#summaryAgglomerative').DataTable({

      "responsive": true,
      "dom": '<"newtoolbar">frtip',
			"order": [[ 3, "desc" ]],
      "destroy":true,
      "ajax":{
        "method":"POST",
        "url": url
      },

      "columns":[
        {"data":"algorithm"},
        {"data":"params"},
        {"data":"groups"},
        {"data":"calinski_harabaz_score"},
        {"data":"silhouette_score"}
      ]
  });
  $('#demo-custom-toolbar2').appendTo($("div.newtoolbar"));

	get_values_params("#summaryAgglomerative tbody", t);
}

var get_values_params = function(tbody, table){
	$(tbody).on("click", "button.detail", function(){
		var data = table.row( $(this).parents("tr") ).data();
		var algorithm = data.algorithm;
		var params = data.params;
		var job = getQuerystring('job');
		var scale=getQuerystring('scale');

		//hacemos la llamada mediante ajax al script php

		$.ajax({
			method: "POST",
			url: "../php/clustering/createJobSelected.php",
			data: {
				"algorithm"   : algorithm,
				"job"   : job,
				"params"   : params,
				"optionScale": scale
			}
		}).done( function( info ){
			var parse = JSON.parse(info);

			if (algorithm == "MeanShift"){
				location.href="viewResult.php?job="+job+"&algorithm=4";
			}

			if (algorithm == "DBSCAN"){
				location.href="viewResult.php?job="+job+"&algorithm=5";
			}

			if (algorithm == "K-Means"){
				location.href="viewResult.php?job="+job+"&algorithm=0";
			}

			if (algorithm == "AffinityPropagation"){
				location.href="viewResult.php?job="+job+"&algorithm=3";
			}

			if (algorithm == "Birch"){
				location.href="viewResult.php?job="+job+"&algorithm=1";
			}

			if (algorithm == "AgglomerativeClustering"){
				location.href="viewResult.php?job="+job+"&algorithm=2";
			}
		});
	});
}
