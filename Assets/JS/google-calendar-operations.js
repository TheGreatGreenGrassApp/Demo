

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


function prepareEventData(customerData){

    /*
     {
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
     }
     */
	var id = localStorage.getItem('calendarId');
	var start = {
		// "date": '2017-07-01
		"dateTime": moment(customerData.startDate).format(),
		"timeZone": 'America/New_York'
	};
	var end =  {
		//  "date": date,
		"dateTime": moment(customerData.startDate).add(1, 'hour').format(),
		"timeZone": 'America/New_York'
	};
	var freq = 3;
	var endDate = moment(customerData.endDate).format('YYYYMMDD');
	var recur = "RRULE:FREQ=DAILY;UNTIL="+ endDate + ";INTERVAL=" + customerData.period;

   // $(document).on('CreateCustomerEvent', function(event, data){
		var eventDetails = {
			calendarId: id,
			//id: data.key,
			description: customerData.name + '(phone: '+ customerData.phone +  ') at ' + customerData.street1 + ' ' + customerData.street2 + ' ' + customerData.city + ' ' + customerData.zip,
			location: customerData.city,
			summary: customerData.name,
			start: start,
			end: end,
			recurrence: recur
		};
		newEvent(id, eventDetails)
  //  })
	//
}

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
            console.log(options);
            console.log(options);
            google.calendar.events.insert(options)
                .then(function (response) {
                    console.log(response);
                    dfr.resolve(response);
                }, function (error) {
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
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
                    break;
                case 'writer':
                    dfr.resolve();
                    break;
                case 'owner':
                    dfr.resolve();
                    break;
                case 'freeBusyReader':
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
                    break;
                default:
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
            }
        });
    return dfr.promise();
}