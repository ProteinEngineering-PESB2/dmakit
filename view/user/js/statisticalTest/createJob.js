$(document).ready(function() {

	var algorithms = ["Pearson Coeficient", "Spearman Coeficient", "Kendall Tau Coeficient", "Mann-Whitney Test", "Kolmogorov-Smirnov", "Shapiro Test", "ANOVA", "T test"];
	var definitions = ["1", "2", "3", "4", "5", "6", "7", "8"];



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

			$.ajax({
			  method: "POST",
			  url: "../php/statisticalTest/createJob.php",
			  data: {
			    "nameJob"   : nameJob,
			    "descJob"   : descJob,
			    "processJob": processJob
			  }
			}).done( function( info ){
			  var response = JSON.parse(info);
			  var parse = JSON.parse(response.result);

			  if (response.exec== "ERROR"){
			    $('#loading').hide();
			    $('#errorResponse').show();
			    setTimeout("location.href=''", 5000);
			  }else if (parse.exec != "OK") {
			    $('#loading').hide();
			    $('#errorResponse').show();
			    setTimeout("location.href=''", 5000);
			  }else{
					location.href="responseJob.php?pvalue="+parse.p_value+"&statistic="+parse.stadistic+"&option="+processJob;			    
			  }
			});
    });
});
