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
      var optionScale = $("#initNewJob #optionScale").val();

      $.ajax({
        method: "POST",
        url: "../php/prediction/createJob.php",
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
          location.href="selectedFeature.php?job="+response.job+"&scale="+optionScale;
        }
      });
  });
});
