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
           // appendPre('Preparing to Populate Events');
            console.log(calendarResponse);
            if (calendarResponse.hasOwnProperty('id')) {
                console.log('get upcomming events');
                localStorage.setItem('calendarId', calendarResponse.id);
                console.log(window.location.pathname);
                if(/calendar/.test(window.location.pathname)){
                    console.log('display events');
					listUpcomingEvents(calendarResponse.id);
                }
            }
        },
        function (result) {
          //  appendPre('Creating Calendar');
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
                       // appendPre('Calendar Present');
                        exists = true;
                        dfr.resolve(calendars[i]);
                    }
                }
            }
            if (!exists) {
                dfr.reject('none')
            }
        });

    return dfr.promise();
}


function createSubCalendar() {
    //
    gapi.client.calendar.calendars.insert({summary: "GreatGreenGrass"})
        .then(function (response) {
            console.log('create Calendars Response', response);
            return response.result;
        });
};

function listUpcomingEvents(calendarId) {
    var maxRetrieveDate = moment().add(5, 'days');
    gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'timeMin': (new Date()).toISOString(),
        // 'timeMax': maxRetrieveDate.format(),
        'showDeleted': false
        //'singleEvents': true,
        //  'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        console.log('EventList Response', response);
        if (events.length > 0) {
            parseListedEvents(events);
            var days = {};

        } else {
        }
    });
}


function parseListedEvents(events) {
    var upcomming = [];
    for (var j = 0; j < 5; j++) {
        var checkDate = moment().add(j, 'days');
        upcomming.push([]);
        for (var i = 0; i < events.length; i++) {
            if (moment(events[i].start.dateTime).isSame(checkDate, 'day')) {
                upcomming[j].push(events[i]);
                events.splice(i, 1);
            }
        }
    }
    console.log(upcomming);
    for (var j = 0; j < 5; j++) {
        createDateEntries(j, upcomming[j])
    }

    createExtendedDateEntries(events)


}


function createDateEntries(offset, eventDate) {
    $('#date-heading-' + offset).empty();
    $('#date-' + offset).empty();
    var date = moment().add(offset, 'days');
    var dayTemplate = '<div class="dayofmonth">' + date.date() + '</div>' +
        '<div class="dayofweek">' + date.format('dddd') + '</div>' +
        '<div class="shortdate text-muted">' + date.format('MMM, YYYY') + '</div>';
    $('#date-heading-' + offset).html(dayTemplate);
    for (var i = 0; i < eventDate.length; i++) {
        var eventTemplate = '<hr>' +
            '<p>' + eventDate[i].description + '</p>' +
            '<p>' + eventDate[i].location + '</p>' +
            '<p>' + eventDate[i].summary + '</p>';
        $('#date-' + offset).append(eventTemplate);
    }
}


function createExtendedDateEntries(events) {
    var otherDays = {};
    for (var i = 0; i < events.length; i++) {
        var day = moment(events[i].start.dateTime).format('YYYYMMDD');
        var keys = Object.keys(otherDays);
        if(keys.indexOf(day) >= 0){
            otherDays[day].push(events[i])
        } else {
            otherDays[day] = [events[i]];
        }
    }
}


function createExtendedEntriesHtml(additionalEvents) {
    $('#extended-schedule').empty();


    var keys = Object.keys(additionalEvents);
    var date = moment().add(offset, 'days');

    var baseTemplate = '<div class="panel panel-default col-md-2">' +
        '<div class="panel-heading 4" id="date-heading-4">' +
        '<div class="dayofmonth">' + date.date() + '</div>' +
        '<div class="dayofweek">' + date.format('dddd') + '</div>' +
        '<div class="shortdate text-muted">' + date.format('MMM, YYYY') + '</div>' +
        '</div>' +
        '<div class="panel-body" id="' + date.format() + '">' +
        '    Panel content' +
        ' </div>' +
        ' </div>';

    $('#extended-schedule').html(baseTemplate);

    for (var i = 0; i < eventDate.length; i++) {

        var eventTemplate = '<hr>' +
            '<p>' + eventDate[i].description + '</p>' +
            '<p>' + eventDate[i].location + '</p>' +
            '<p>' + eventDate[i].summary + '</p>';
        $('#date-' + offset).append(eventTemplate);
        //eventDate[i]
    }
}


