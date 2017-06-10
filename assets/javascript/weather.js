// Weather API key
var APIKey = "c3c6ec4b696245c5675ec13e3dfcd644";
var city = "Cleveland";

// Query URL to access weather data
var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

// AJAX call
$.ajax({
	url: queryURL,
	method: "GET"
}).done(function(response) {

	console.log(queryURL);
	console.log(response);

	// For loop to find 0:00:00 forecasts for five days

	for (var i=0; i<response.list.length; i++) {
		console.log(response.list[i]);

	}







}); // Close AJAX Call function