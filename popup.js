/* call Clarifai API */
$(function () {
    $('#checkURL').click(function() {
    	var url = $('#theURL').val();
    	run(url);
    });
});
/* end */