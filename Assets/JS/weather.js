
/// FUNCTION TO RUN DARK SKY IFRAME WEATHER IMBED


function checkIfGoogleMapsApiLoaded(){
    setTimeout(function () {
        if (window.google) {
            /// CALLS WEATHER FORECAST FUNCTION
            weatherForecast();
        } else {
            checkIfGoogleMapsApiLoaded();
        }
    }, 250);
}



function weatherForecast() {
    var geocoder = new google.maps.Geocoder();
    var city = "Cleveland";
    geocoder.geocode({ 'address': city }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // finds latitude and longitude of city
           var lat = results[0].geometry.location.lat();
           var lon = results[0].geometry.location.lng();
            // create weatherURL
            var weatherURL = "http://forecast.io/embed/#lat=" + lat + "&lon=" + lon + "&name=" + city;
            // Add weather URL to iframe
            $("#forecast_embed").attr("src", weatherURL);
        } else {
            alert("Something got wrong " + status);
        }
    })

}


/// Poll to see if google maps api is loaded
checkIfGoogleMapsApiLoaded();
