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

$(document).one('calendarAuthorized', setup);


function setup() {
    if (window.google === undefined) {
        window.google = gapi.client;
    }
    calendarCheck = checkForCalendar();

    calendarCheck.then(
        function (calendarResponse) {
            appendPre('Preparing to Populate Events');
            console.log(calendarResponse);
            if (calendarResponse.hasOwnProperty('id')) {
                console.log('get upcomming events');
                localStorage.setItem('calendarId', calendarResponse.id);
                listUpcomingEvents(calendarResponse.id);
                var freq = 7;
                var recur = "RRULE:FREQ=DAILY;UNTIL=20170928;INTERVAL="+freq;
                var eventDetails = {
                    description: "Cut the Great Green Grass!",
                    location: 'cleveland',
                    recurrence: [
                        recur
                        //"RRULE;FREQ=DAILY;UNTIL=201708015;INTERVAL="+ freq
                        ],
                    summary: 'The Great Will Grow!'
                };
                createEvent(calendarResponse.id, null, null, eventDetails)
                    .then(function(response){
                        console.log('createEvent Response', response);
                    }, function(error){
                        if(error.hasOwnProperty('allow')){
                            console.log(error.msg);
                        }
                    })
            }
        },
        function (result) {
            appendPre('Creating Calendar');
            calendarObject = createSubCalendar();
            console.log('create Calendar calendarObject', calendarObject);
        });
    if (calendarObject) {

    } else {

    }
}

function checkForCalendar() {
    var dfr = $.Deferred();
    var exists = false;
    gapi.client.calendar.calendarList.list()
        .then(function (response) {
            console.log('list Calendars Response', response);
            var calendars = response.result.items;
            for (var i = 0; i < calendars.length; i++) {
                if (calendars[i].summary) {
                    if (calendars[i].summary === "GreatGreenGrass") {
                        appendPre('Calendar Present');
                        exists = true;
                        dfr.resolve(calendars[i]);
                    }
                }
            }
            if (!exists) {
                dfr.reject('none')
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

    return dfr.promise();
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
            var days = {};
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                    var date = when.slice(0, 10);
                    if (days.hasOwnProperty(date)) {
                        days[date].push(event);
                    } else {
                        days[date] = [];
                        days[date].push(event);
                    }

                }
                appendPre(event.summary + ' (' + when + ')')
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}


function checkCreatePermissions(id) {
    var dfr = $.Deferred();
    google.calendar.calendarList.get({"calendarId": id})
        .then(function (response) {
            console.log('checkCreatePErsmissions response', response);
            switch (response.result.accessRole) {
                case 'reader':
                    appendPre('NOT AUTHORIZED TO CREATE EVENTS');
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
                    break;
                case 'writer':
                    dfr.resolve();
                   // createEvent(id, null, null, options);
                    break;
                case 'owner':
                    dfr.resolve();
                   // createEvent(id, null, null, options);
                    break;
                case 'freeBusyReader':
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
                    appendPre('NOT AUTHORIZED TO CREATE EVENTS');
                    break;
                default:
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
                    appendPre('NOT AUTHORIZED TO CREATE EVENTS');
            }
        });
    return dfr.promise();
}


function createEvent(id, startTime, endTime, options) {
    var dfr = $.Deferred();
    checkCreatePermissions(id)
        .then(function(){
            options = options ? options : {};
            var start = startTime ? startTime :  new Date(2017, 7, 1, 9, 0, 0, 0);
            var end = endTime ? endTime :  new Date(2017, 7, 1, 9, 0, 0, 0);
            console.log(options);
            var base = {
                calendarId: id,
                start: {
                    // "date": '2017-07-01
                    "dateTime": start,
                    "timeZone": 'America/New_York'
                },
                end: {
                    //  "date": date,
                    "dateTime": end,
                    "timeZone": 'America/New_York'
                }
            };

            var request = Object.assign(base,  options);
            console.log(request);
            google.calendar.events.insert(request)
                .then(function (response) {
                    appendPre('Event Created');
                    console.log(response);
                    dfr.resolve(response);
                }, function (error) {
                    appendPre('Error Creating Event');
                    console.log('error', error);
                    dfr.reject(error);
                })
        }, function(rejected){
            console.log(rejected);
            dfr.reject({allow: false, msg: rejected});
        });
    return dfr.promise();
}



