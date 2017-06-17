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



function geocodeAddress(location) {
  
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
            'address': location.street1 + ' ' +location.city + ' ' +location.state + ' ' +location.zip
     }
, function(results, status) {
      if (status == 'OK') {
        window.mapInstance.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: window.mapInstance,
            position: results[0].geometry.location
        });     


            } else {
                alert("geocode of " + address + " failed:" + status);
            }
        });
}


ref.ref().on("value", function(snapshot) {
    var locations = snapshot.val();
    for (var key in locations) {
        var location = locations[key];

        geocodeAddress(location);
    }
})

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.505493, lng: -81.681290 },
        zoom: 11,
        mapTypeId: 'roadmap'
    });
    window.mapInstance = map;
    

    };
