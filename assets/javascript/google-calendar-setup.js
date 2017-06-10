/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}

var calendarCheck, calendarObject;

$(document).one('calendarAuthorized', function () {
	calendarCheck = checkForCalendar();
	if(calendarObject){
		appendPre('Calendar Present');
		console.log(calendarObject);
		if(calendarObject.hasOwnProperty('id')){
			listUpcomingEvents(calendarObject.id)
		}
	} else {
		appendPre('Creating Calendar');
		calendarObject = createSubCalendar();
		console.log('create Calendar calendarObject', calendarObject);
	}
});

function checkForCalendar() {
	gapi.client.calendar.calendarList.list().then(function (response) {
		console.log('list Calendars Response', response);
		var calendars = response.result.items;
		for(var i=0; i<calendars.length; i++){
			if(calendars[i].summary){
				if(calendars[i].summary === "GreatGreenGrass"){
					return calendars[i];
				}
			}
		}
		/*var responseStructure = {
		 accessRole: "owner",
		 defaultReminders: Array(0),
		 etag: "1497110929637000",
		 id: "74cfobonglb21ieeic8d69uuc0@group.calendar.google.com",
		 kind: "calendar#calendarListEntry",
		 selected: true,
		 summary: "GreatGreenGrass",
		 timeZone: "UTC"}*/
		appendPre('No Related Calendar Present');
	});
}


function createSubCalendar() {
	//
	gapi.client.calendar.calendars.insert({summary: "GreatGreenGrass"})
		.then(function (response) {
			console.log('create Calendars Response', response);
			/*var responseStructure = {
			 etag: "nU8mcHQyfSAodzKKXewNxPMLTwQ / RbG_lnW3lDMKgNQrd - VCl1Pzfb4",
			 id: "74cfobonglb21ieeic8d69uuc0@group.calendar.google.com",
			 kind: "calendar#calendar",
			 summary: "GreatGreenGrass"
			 }; */
			appendPre('Calendar Created');
			return response.result;
		});
};

function listUpcomingEvents(calendarId) {
	gapi.client.calendar.events.list({
		'calendarId': calendarId,
		'timeMin': (new Date()).toISOString(),
		'showDeleted': false,
		'singleEvents': true,
		'maxResults': 10,
		'orderBy': 'startTime'
	}).then(function (response) {
		var events = response.result.items;
		appendPre('Upcoming events:');

		if (events.length > 0) {
			for (i = 0; i < events.length; i++) {
				var event = events[i];
				var when = event.start.dateTime;
				if (!when) {
					when = event.start.date;
				}
				appendPre(event.summary + ' (' + when + ')')
			}
		} else {
			appendPre('No upcoming events found.');
		}
	});
}