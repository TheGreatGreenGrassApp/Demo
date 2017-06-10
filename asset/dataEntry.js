$( document ).ready(function() {
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBfVb_K7kzA1Hee9Y8lBdI3spp9lnxhb48",
  authDomain: "project1-work-space.firebaseapp.com",
  databaseURL: "https://project1-work-space.firebaseio.com",
  projectId: "project1-work-space",
  storageBucket: "project1-work-space.appspot.com",
  messagingSenderId: "777786429739"
};
firebase.initializeApp(config);

var database=firebase.database();

$("#addCustomer").on("click", function(snap){
	event.preventDefault();
	database.ref().push({
		name:$("#name_id").val().trim(),
		street1:$("#street1_id").val().trim(),
		street2:$("#street2_id").val().trim(),
		city:$("#city_id").val().trim(),
		state:$("#state_id").val().trim(),
		zip:$("#zip_id").val().trim(),
		email:$("#email_id").val().trim(),
		phone:$("#phone_id").val().trim(),
		startDate:$("#startDate_id").val().trim(),
		endDate:$("#endDate_id").val().trim(),
		frequency:$("#frequency_id").val().trim(),
		rate:$("#rate_id").val().trim(),
	});
	
});


database.ref().on("value", function(snap){
	$("#displayCustomerInfo").empty();
	var sv=snap.val();
	for (var key in sv) {
		var customerInfoTr = $("<tr>");
		var nameTd = $("<td>");
		var emailTd = $("<td>");
		var phoneTd = $("<td>");
		var addrTd = $("<td>");
		var startDateTd = $("<td>");
		var endDateTd = $("<td>");
		var frequencyTd = $("<td>");
		var rateTd = $("<td>");

		customerInfoTr.append(nameTd);
		customerInfoTr.append(emailTd);
		customerInfoTr.append(phoneTd);
		customerInfoTr.append(addrTd);
		customerInfoTr.append(startDateTd);
		customerInfoTr.append(endDateTd);
		customerInfoTr.append(frequencyTd);
		customerInfoTr.append(rateTd);


		$("#displayCustomerInfo").append(customerInfoTr);
		var thisObject=sv[key];
		var addrFormat = thisObject.street1+ ' ' + thisObject.street2+', ' +thisObject.city+', ' +thisObject.state+' ' +thisObject.zip;

		nameTd.html(thisObject.name);
		emailTd.html(thisObject.email);
		phoneTd.html(thisObject.phone);
		addrTd.html(addrFormat);
		startDateTd.html(thisObject.startDate);
		endDateTd.html(thisObject.endDate);
		frequencyTd.html(thisObject.frequency);
		rateTd.html(thisObject.rate);
	}
});



    console.log( "ready!" );
});




