

$('#addEvent').on('click', function(){
    var id = localStorage.getItem('calendarId');
    var start = {
        // "date": '2017-07-01
        "dateTime": new Date(2017, 5, 16, 9, 0, 0, 0),
        "timeZone": 'America/New_York'
    };
    var end =  {
        //  "date": date,
        "dateTime": new Date(2017, 5, 16, 9, 0, 0, 0),
        "timeZone": 'America/New_York'
    };
    var freq = 3;

    var recur = "RRULE:FREQ=DAILY;UNTIL=20170928;INTERVAL="+freq;
    var eventDetails = {
        calendarId: id,
        description: "Cut the Great Green Grass!",
        location: 'cleveland',
        summary: 'The Great Will Grow!',
        start: start,
        end: end,
        recurrence: recur
    };

    newEvent(id, eventDetails)
});


function newEvent(id, details){

    if(id && details.hasOwnProperty('description') && details.hasOwnProperty('end') && details.hasOwnProperty('start') ){


    var freq = 7;

    var recur = "RRULE:FREQ=DAILY;UNTIL=20170928;INTERVAL="+freq;
    var recurrence = {recurrence: [
        recur
        //"RRULE;FREQ=DAILY;UNTIL=201708015;INTERVAL="+ freq
    ]};
    var eventDetails = Object.assign({}, details, recurrence);
    /* var eventDetails = {
     description: "Cut the Great Green Grass!",
     location: 'cleveland',
     recurrence: [
     recur
     //"RRULE;FREQ=DAILY;UNTIL=201708015;INTERVAL="+ freq
     ],
     summary: 'The Great Will Grow!'
     }; */
    createEvent(id, eventDetails)
        .then(function(response){
            console.log('createEvent Response', response);
            listUpcomingEvents(id)
        }, function(error){
            if(error.hasOwnProperty('allow')){
                console.log(error.msg);
            }
        })
    } else {
        return;
    }
}


function createEvent(id, options) {
    var dfr = $.Deferred();
    checkCreatePermissions(id)
        .then(function(){
          //  options = options ? options : {};
          //  var start = startTime ? startTime :  new Date(2017, 7, 1, 9, 0, 0, 0);
          //  var end = endTime ? endTime :  new Date(2017, 7, 1, 9, 0, 0, 0);
            console.log(options);
         /*   var base = {
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
            };*/

         //   var request = Object.assign(base,  options);
            console.log(options);
            google.calendar.events.insert(options)
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