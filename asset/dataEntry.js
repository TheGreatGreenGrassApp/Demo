$( document ).ready(function() {
// Initialize Firebase
var isEdit =0;
var dataKeyForEdit ;

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

$("#phone_id").mask('(000) 000-0000', {clearIfNotMatch: true});
$("#zip_id").mask('00000', {clearIfNotMatch: true});

$("#saveCustomerInfo").on("click", function(snap){
	snap.preventDefault();
	var showSaved = $("<p><font color='red'>Saved Successfully!</font></p>").delay(1000).fadeOut(500);
  	$(".modal-footer").prepend(showSaved);
  	var customerData = {
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
		period:$("#period_id").val().trim(),
		rate:$("#rate_id").val().trim(),
	};

  	if (isEdit==0) {
		database.ref().push(customerData);
		prepareEventData(customerData);
		$(".modal-form input, .modal-form textarea").val('');
	}
	else {
		database.ref().child(dataKeyForEdit).set();
	}
});


database.ref().on("value", function(snap){
	$("#displayCustomerInfo").empty();
	var sv=snap.val();
	for (var key in sv) {
		var thisObject=sv[key];
		var name = thisObject.name;
		var street1 = thisObject.street1;
		var street2 = thisObject.street2;
		var city = thisObject.city;
		var state = thisObject.state;
		var zip = thisObject.zip;
		var email = thisObject.email;
		var phone = thisObject.phone;
		var startDate= thisObject.startDate;
		var endDate = thisObject.endDate;
		var period = thisObject.period;
		var rate = thisObject.rate;

		var customerInfoTr = $("<tr>");
		var nameTd = $("<td>");
		var emailTd = $("<td>");
		var phoneTd = $("<td>");
		var addrTd = $("<td>");
		var street1Sp = $("<span>");
		var street2Sp = $("<span>");
		var citySp = $("<span>");
		var stateSp = $("<span>");
		var zipSp = $("<span>");
		var startDateTd = $("<td>");
		var endDateTd = $("<td>");
		var periodTd = $("<td>");
		var rateTd = $("<td>");

		nameTd.attr("data-name", name);
		emailTd.attr("data-name", email);
		phoneTd.attr("data-name", phone);
		street1Sp.attr("data-name", street1);
		street2Sp.attr("data-name", street2);
		citySp.attr("data-name", city);
		stateSp.attr("data-name", state);
		zipSp.attr("data-name", zip);
		startDateTd.attr("data-name", startDate );
		endDateTd.attr("data-name", endDate);
		periodTd.attr("data-name",period);
		rateTd.attr("data-name", rate);

		addrTd.append(street1Sp);
		addrTd.append(street2Sp);
		addrTd.append($("<br>"));
		addrTd.append(citySp);
		addrTd.append(stateSp);
		addrTd.append(zipSp);

		var editTd = $ ("<button> Edit </button>");
		var removeTd = $("<button> Remove </button>");
		editTd.addClass("editClass");
		editTd.attr("data-toggle","modal");
		editTd.attr("data-target","#addCustomerModal");
		removeTd.addClass("removeClass");

		customerInfoTr.append(nameTd);
		customerInfoTr.append(emailTd);
		customerInfoTr.append(phoneTd);
		customerInfoTr.append(addrTd);
		customerInfoTr.append(startDateTd);
		customerInfoTr.append(endDateTd);
		customerInfoTr.append(periodTd);
		customerInfoTr.append(rateTd);
		customerInfoTr.append(editTd);
		customerInfoTr.append(removeTd);

		$("#displayCustomerInfo").append(customerInfoTr);

		nameTd.html(name);
		emailTd.html(email);
		phoneTd.html(phone);
		street1Sp.html(street1 + '&nbsp');
		street2Sp.html(street2);
		citySp.html(city+',&nbsp');
		stateSp.html(state + '&nbsp');
		zipSp.html(zip);
		startDateTd.html(startDate);
		endDateTd.html(endDate);
		periodTd.html(period);
		rateTd.html(rate);
	}
	// sv.
});

/*	database.ref().on("child_added", function(snap){
		console.log('snap.key()', snap.key());
		$(document).trigger('CreateCustomerEvent', {key: snap.key()})
	})*/

$(document).on("click", ".removeClass", function (snap){
	var street1 = $(this).siblings(":nth-child(4)").children().first();
	var street2 = street1.next();
	var city = street2.next().next();
	var state = city.next();
	var zip = state.next();

	database.ref().once('value').then(function(snapshot) {
		var sv=snapshot.val();
  		for (var key in sv) {
			var thisObject=sv[key];
			if (thisObject.street1 == street1.attr("data-name") &&
				thisObject.street2 == street2.attr("data-name") &&
				thisObject.city == city.attr("data-name") &&
				thisObject.state == state.attr("data-name") &&
				thisObject.zip == zip.attr("data-name")) 
			{
				database.ref().child(key).remove();
		}
	}
	});
});



$(document).on("click", ".editClass", function (snap){
	isEdit = 1;
	
	var name = $(this).siblings().first();
	var email = name.next();
	var phone = email.next();
	var street1 = $(this).siblings(":nth-child(4)").children().first();
	var street2 = street1.next();
	var city = street2.next().next();
	var state = city.next();
	var zip = state.next();
	var startDate = phone.next().next();
	var endDate = startDate.next();
	var period = endDate.next();
	var rate = period.next();

	$("#exampleModalLongTitle").html("Edit Customer Information");
	$("#name_id").val(name.attr("data-name"));
	$("#street1_id").val(street1.attr("data-name"));
	$("#street2_id").val(street2.attr("data-name"));
	$("#city_id").val(city.attr("data-name"));
	$("#state_id").val(state.attr("data-name"));
	$("#zip_id").val(zip.attr("data-name"));
	$("#email_id").val(email.attr("data-name"));
	$("#phone_id").val(phone.attr("data-name"));
	$("#startDate_id").val(startDate.attr("data-name"));
	$("#endDate_id").val(endDate.attr("data-name"));
	$("#period_id").val(period.attr("data-name"));
	$("#rate_id").val(rate.attr("data-name"));

	database.ref().once('value').then(function(snapshot) {
		var sv=snapshot.val();
	  	
	  	for (var key in sv) {
			var thisObject=sv[key];

			if (thisObject.street1 == street1.attr("data-name") &&
				thisObject.street2 == street2.attr("data-name") &&
				thisObject.city == city.attr("data-name") &&
				thisObject.state == state.attr("data-name") &&
				thisObject.zip == zip.attr("data-name"))
			{
				dataKeyForEdit = key;
				//console.log(dataKeyForEdit);
			
			}
		}
	});

});

$("#addCustomer").on("click", function (event){
	event.preventDefault();
	isEdit=0;
	$("#exampleModalLongTitle").html("Add A Customer");
	$(".modal-form input, .modal-form textarea").val('');

});

    console.log( "ready!" );
});




