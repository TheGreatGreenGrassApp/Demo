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
		name:$("#nameInputTag").val().trim(),
		email:$("#emailInputTag").val().trim(),
		phone:$("#phoneInputTag").val().trim(),
		addr:$("#addrInputTag").val().trim(),
		startDate:$("#startDateInputTag").val().trim(),
		endDate:$("#endDateInputTag").val().trim(),
		frequency:$("#frequencyInputTag").val().trim(),
		rate:$("#rateInputTag").val().trim(),
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

		nameTd.html(thisObject.name);
		emailTd.html(thisObject.email);
		phoneTd.html(thisObject.phone);
		addrTd.html(thisObject.addr);
		startDateTd.html(thisObject.startDate);
		endDateTd.html(thisObject.endDate);
		frequencyTd.html(thisObject.frequency);
		rateTd.html(thisObject.rate);
	}
});


    console.log( "ready!" );
});




