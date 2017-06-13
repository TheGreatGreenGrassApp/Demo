
    <!-- Bootswatch Cosmos -->
    < script src = "http://code.jquery.com/jquery-2.1.3.min.js" > < /script>
    <!-- Bootswatch Cosmos -->
    < script type = "text/javascript" >
    // Weather API key
    var APIKey = "c3c6ec4b696245c5675ec13e3dfcd644";

// Here we are building the URL we need to query the database
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&appid=" + APIKey;

// We then created an AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).done(function(response) {

    // Create CODE HERE to Log the queryURL

    console.log(queryURL);

    // Create CODE HERE to log the resulting object
    console.log(response);

    // Create CODE HERE to transfer content to HTML
    $(".city").append("<p> City: " + response.name + "</p>");
    $(".wind").append("<p> Wind: " + response.wind.speed + "</p>");
    $(".humidity").append("<p> Humidity: " + response.main.humidity + "</p>");
    $(".temp").append("<p> Temp (K): " + response.main.temp + "</p>");


    // Create CODE HERE to calculate the temperature (converted from Kelvin)
    // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
    var Fahrenheit = (response.main.temp - 273.15) * 1.80 + 32;

    // Create CODE HERE to dump the temperature content into HTML
    $(".temp").append("<p> Temp (F): " + Fahrenheit + "</p>");


}); < /script>


