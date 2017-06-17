


$(document).one('gapiLoaded', function () {
	console.log('gapi ready, can now interact with the users calendar');
});

$(document).one('calendarAuthorized', function(){

});
// calendarAuthorized

function checkIfGoogleApiLoaded() {

	setTimeout(function () {
		if (window.gapi) {
			$(document).trigger('gapiLoaded');
		} else {
			checkIfGoogleApiLoaded();
		}
	}, 250);

}

checkIfGoogleApiLoaded();