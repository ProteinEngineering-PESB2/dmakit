$(document).ready(function() {

	$(function() {

		$('#processJob').change(function(){

			if($('#processJob').val() == 2) {//All
					$('#selectType').show();

			}else{
				$('#selectType').hide();
			}
		});
	});

	$('#initNewJob').bootstrapValidator({
				feedbackIcons: {
						valid: 'glyphicon glyphicon-ok',
						invalid: 'glyphicon glyphicon-remove',
						validating: 'glyphicon glyphicon-refresh'
				},
				fields: {
						nameJob: {
								validators: {
										notEmpty: {
												message: 'The nameJob is required'
										}
								}
						},
						descJob: {
								validators: {
										notEmpty: {
												message: 'The description Job is required'
										}
								}
						}
				}
		}).on('success.form.bv', function(e) {
			e.preventDefault();
			$('#loading').show();
			var nameJob = $("#initNewJob #nameJob").val();
			var descJob = $("#initNewJob #descJob").val();
      var processJob = $("#initNewJob #processJob").val();
			var optionScale = $("#initNewJob #optionScale").val();
			var optionEncode = $("#initNewJob #optionEncode").val();

			if (processJob == 1){//correlation option
				$.ajax({
					method: "POST",
					url: "../php/characteristic/execCorrelation.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"optionScale": optionScale,
						"optionEncode": optionEncode
					}
				}).done( function( info ){
					var response = JSON.parse(info);
					console.log(response);
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
								location.href="responseCorrelation.php?job="+response.job;
							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}else if (processJob == 2) {
				var kindDataSet = $("#initNewJob #kindDataSet").val();//obtenemos el tipo de set de datos...
				$.ajax({
					method: "POST",
					url: "../php/characteristic/createJob.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
					}
				}).done( function( info ){
					var response = JSON.parse(info);

					if (response.exec== "ERROR"){
						$('#loading').hide();
						$('#errorResponse').show();
						setTimeout("location.href=''", 5000);
					}else{
						console.log("OK!!!");
						location.href="selectedFeature.php?job="+response.job+"&scale="+optionScale+"&kind="+kindDataSet;
					}
				});
			}else if (processJob == 4) {
				$.ajax({
					method: "POST",
					url: "../php/characteristic/execMutualInformation.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"optionScale": optionScale
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
								location.href="responseMI.php?job="+response.job;
								console.log("Exec OK!!!");
							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}else if (processJob == 3) {
				$.ajax({
					method: "POST",
					url: "../php/characteristic/execPCA.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"optionScale": optionScale,
						"optionEncode": optionEncode
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
								location.href="responsePCA.php?job="+response.job;
								console.log("Exec OK!!!");
							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}
			else if (processJob == 6) {
				$.ajax({
					method: "POST",
					url: "../php/characteristic/execPCAIncremental.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"optionScale": optionScale
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
								location.href="responseIncrementalPCA.php?job="+response.job;
								console.log("Exec OK!!!");
							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}else if (processJob == 5) {
				$.ajax({
					method: "POST",
					url: "../php/characteristic/execKernelPCA.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"optionScale": optionScale
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
								location.href="responseKPCA.php?job="+response.job;
								console.log("Exec OK!!!");
							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}
    });
});

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
