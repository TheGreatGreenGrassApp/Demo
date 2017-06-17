//////// MAP JS ////////

// Firebase call
var config = {
    apiKey: "AIzaSyA21cA43E8JvGw-nZrN2ZgSMU6IJWjKiUQ",
    authDomain: "project1-work-space.firebaseapp.com",
    databaseURL: "https://project1-work-space.firebaseio.com",
    projectId: "project1-work-space",
    storageBucket: "project1-work-space.appspot.com",
    messagingSenderId: "777786429739"
};

firebase.initializeApp(config);
var ref = firebase.database();

// Geocode addresses from customer data table on index.html
function geocodeAddress(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': location.street1 + ' ' + location.city + ' ' + location.state + ' ' + location.zip
    }, function(results, status) {
        // Drop a pin on map for each geocoded address
        if (status == 'OK') {
            window.mapInstance.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: window.mapInstance,
                position: results[0].geometry.location
            });
            // Error alert
        } else {
            alert("geocode of " + address + " failed:" + status);
        }
    });
}

// Location array
ref.ref().on("value", function(snapshot) {
    var locations = snapshot.val();
    for (var key in locations) {
        var location = locations[key];

        geocodeAddress(location);
    }
})

// Map settings
function initAutocomplete(Lat, Long) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: Lat, lng: Long },
        zoom: 11,
        mapTypeId: 'roadmap'
    });
    window.mapInstance = map;
};

//////// CALENDAR JS ////////

/// FUNCTION TO RUN DARK SKY IFRAME WEATHER EMBED
function weatherForecast() {

    // queryURL variables
    var city = "Cleveland";
    var apiKey = "AIzaSyDkBhwarrOwSenjAYgGyBi9wUplJnM2JW0";
    var lat = 0;
    var lon = 0;

    // queryURL for JSON request
    var queryURL = "//maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=" + apiKey;

    console.log(queryURL);

    // ajax request to find lat and long of city variable
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(results) {

        console.log(results);

        lat = results.results[0].geometry.location.lat;
        long = results.results[0].geometry.location.lng;

        console.log(lat);
        console.log(long);

        initAutocomplete(lat, long);

        // create weatherURL
        var weatherURL = "//forecast.io/embed/#lat=" + lat + "&lon=" + long + "&name=" + city;
        console.log(weatherURL);

        // Add weather URL to iframe
        $("#forecast_embed").attr("src", weatherURL);
    }); // close ajax request

} // Close weather function


weatherForecast();
