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

    // Array to hold response data
    var responseArray = [];
    var weatherArray = [];

    // For loop to push forecast data into an array
    for (var i = 0; i < response.list.length; i++) {
        console.log(response.list[i]);

        // Push response data into responseArray
        responseArray.push(response.list[i]);
        console.log(responseArray);

        // Grab only the weather variables we need and push to weatherArray
        weatherArray.push({
            date: moment.unix(response.list[i].dt).format("MM/DD/YYYY"),
            min_temp: response.list[i].main.temp_min,
            max_temp: response.list[i].main.temp_max,
            description: response.list[i].weather[0].description,
            icon: response.list[i].weather[0].icon
        });

        console.log(weatherArray);

    } // Close fill array for loop


    // For loop to look through array and remove duplicate forecast data
    // Only need one forecast object per day (5 days total)
    for (var i = 0; i < weatherArray.length; i++) {

        var reduce = function(arr, prop) {
            var result = [],
                filterVal,
                filters,
                filterByVal = function(n) {
                    if (n[prop] === filterVal) return true;
                };
            for (var i = 0; i < arr.length; i++) {
                filterVal = arr[i][prop];
                filters = result.filter(filterByVal);
                if (filters.length === 0) result.push(arr[i]);
            }
            return result;
        };

        forecastArray = reduce(weatherArray, 'date');
        console.log(forecastArray);

    } // Close reduce for loop

    // Append weather forecast into 5 panel display

    for (var i = 0; i < forecastArray.length; i++) {

        // Append date to panel header
        $("." + i).html(forecastArray[i].date);

        // Convert temps to Farenheit
        // Celsius to Fahrenheit : (°C × 1.8) + 32 = °F
        minTempF = Math.round(parseInt(forecastArray[i].min_temp - 273.15) * 1.8 + 32);
        maxTempF = Math.round(parseInt(forecastArray[i].max_temp - 273.15) * 1.8 + 32);

        // http://openweathermap.org/img/w/10d.png
        // Create link to weather icon
        var iconLink = "http://openweathermap.org/img/w/" + forecastArray[i].icon + ".png";


        // Create a panel div to hold day's forecast info
        var weatherDiv = "<div class= " + i + "" + "</div";

        var imgDiv = ("<img src=" + iconLink + ">");

        var descDiv = ("<h2>" + forecastArray[i].description + "</h2>");

        var minDiv = ("<p> Min Temp:  " + minTempF + "</p>");
        var maxDiv = ("<p> Max Temp:  " + maxTempF + "</p>");

        // Append the weatherDiv to the panel body
        $("#forecast-" + i).html('');
        $("#forecast-" + i).append(imgDiv, descDiv, minDiv, maxDiv);

    } // Close weather forecast append for loop

    console.log(forecastArray);

}); // Close AJAX Call function