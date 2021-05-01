$(document).ready(function() {

	$(function() {

    $('#algorithm').change(function(){

				if($('#algorithm').val() == 1) {//All
						$('#kData').hide();
						$('#linkageValues').hide();
						$('#affinityValues').hide();
				}

				if($('#algorithm').val() == 5) {//Affinity
						$('#kData').hide();
						$('#linkageValues').hide();
						$('#affinityValues').hide();
				}

				if($('#algorithm').val() == 6) {//Mean
						$('#kData').hide();
						$('#linkageValues').hide();
						$('#affinityValues').hide();
				}

				if($('#algorithm').val() == 7) {//DBScan
						$('#kData').hide();
						$('#linkageValues').hide();
						$('#affinityValues').hide();
				}

				if($('#algorithm').val() == 2) {//K-Means
            $('#kData').show();
						$('#linkageValues').hide();
						$('#affinityValues').hide();
				}
				if($('#algorithm').val() == 3) {//Birch
		            $('#kData').show();
								$('#linkageValues').hide();
								$('#affinityValues').hide();
        }

				if($('#algorithm').val() == 4) {//Agglomerative
            $('#kData').show();
						$('#linkageValues').show();
						$('#affinityValues').show();
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
			$('#errorResponse').hide();
			var nameJob = $("#initNewJob #nameJob").val();
			var descJob = $("#initNewJob #descJob").val();
      var algorithm = $("#initNewJob #algorithm").val();
			var optionScale = $("#initNewJob #optionScale").val();
			var optionEncode = $("#initNewJob #encodingOption").val();

			kValues = $("#initNewJob #kValues").val();
			linkageValues = $("#initNewJob #linkage").val();
			affinityValues = $("#initNewJob #affinity").val();

			$.ajax({
				method: "POST",
				url: "../php/clustering/createJobOneProcess.php",
				data: {
					"nameJob"   : nameJob,
					"descJob"   : descJob,
	         "algorithm"   : algorithm,
					"kValues"   : kValues,
					"linkageValues"   : linkageValues,
	        "affinityValues"   : affinityValues,
					"optionScale" : optionScale,
					"optionEncode": optionEncode
				}
			}).done( function( info ){
				var parse = JSON.parse(info);

				if (parse.response == "BIEN"){
					var job=parse.job;
					//manejamos el valor del algorithm...
					
					if (algorithm == 2){
						location.href="viewResult.php?job="+job+"&algorithm=0";
					}

					if (algorithm == 3){
						location.href="viewResult.php?job="+job+"&algorithm=1";
					}

					if (algorithm == 4){
						location.href="viewResult.php?job="+job+"&algorithm=2";
					}

					if (algorithm == 5){
						location.href="viewResult.php?job="+job+"&algorithm=3";
					}

					if (algorithm == 6){
						location.href="viewResult.php?job="+job+"&algorithm=4";
					}

					if (algorithm == 7){
						location.href="viewResult.php?job="+job+"&algorithm=5";
					}

				}else{
					$('#loading').hide();
					$('#errorResponse').show();
					setTimeout("location.href=''", 5000);
				}
			});
    });

});
