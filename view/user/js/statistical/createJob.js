$(document).ready(function() {

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

			if (processJob == 2){
				$.ajax({
					method: "POST",
					url: "../php/statistical/execDispersion.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"optionScale" : optionScale

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
							if (data.exec == "OK"){
								location.href="responseDispersion.php?job="+response.job;
								console.log("OK Job!");
							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}else if (processJob == 6) {//statical process

				$.ajax({
					method: "POST",
					url: "../php/statistical/execStatistical.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"optionScale" : optionScale

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
							if (data.exec == "OK"){
								location.href="responseStatistical.php?job="+response.job;
								console.log("OK Job!");
							}else{
								$('#loading').hide();
								$('#errorResponse').show();
								setTimeout("location.href=''", 5000);
							}
						});
					}
				});
			}else{

				$.ajax({
					method: "POST",
					url: "../php/statistical/createJob.php",
					data: {
						"nameJob"   : nameJob,
						"descJob"   : descJob,
						"option" : processJob

					}
				}).done( function( info ){
					var response = JSON.parse(info);
					console.log(response);
					if (response.exec== "ERROR"){
						$('#loading').hide();
						$('#errorResponse').show();
						setTimeout("location.href=''", 5000);
					}else{
						//hacemos el redireccionamiento a la vista previa para que seleccione el atributo a visualizar
						location.href="selectedFeature.php?job="+response.job+"&process="+processJob;

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
