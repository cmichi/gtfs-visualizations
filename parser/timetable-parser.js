var path = require('path');

var Gtfs = require(path.join(__dirname, "..", "gtfs-parser", "gtfs-loader"));





module.exports = (function(){
	var stopTimes;
	var date;
	var trips;			// holds all the trips with the calculated start/end points and the duration
	var gtfs;
	
	
	// returns a array with *current* trips with progressNow and progressThen at a given time (only ms since midnight are used)
	// delta: delta T in ms between Now and Then
	var calculateTripProgess = function(time, delta) {
		time = (time.getHours()*60*60 + time.getMinutes()*60 + time.getSeconds())*1000;
		var progressThen, startTime,endTime, timeShifted, tripFits;
		var tripsProgress = {};
		// if time <6, check if there are lines after 23:59
		if (time < 6*60*60*1000) {
			timeShifted = parseInt(time + 24*60*60*1000,10);
		} else {
			timeShifted = false;
		}
		
		for (var i in trips) {
			startTime = parseInt(trips[i][trips[i].start].arrivalTime,10);
			endTime = parseInt(trips[i][trips[i].end].arrivalTime,10);
			//console.log("tripid: "+trips[i][0].trip_id+" start: "+startTime+" end: "+endTime+" time " + time )
			
			// if time<6h, timeShifted + 24h and check if trip fits
			if (timeShifted) {
				if (startTime < timeShifted && timeShifted < endTime) {
					tripFits = true;
					//console.log("tripid: "+trips[i][0].trip_id+" start: "+startTime+" end: "+endTime+ " timestampshifted "+timeShifted+" duration "+trips[i].duration+" => fits: "+tripFits)
				} else {
					tripFits = false;
				}
			}
			if ((startTime < time && time < endTime) || tripFits) {
				// trip is running at given timen, calculate progesses
				if (!tripsProgress[trips[i][0].trip_id]) tripsProgress[trips[i][0].trip_id] = {};
				if (tripFits) {		// use the shifted time if the trip is after 24h
					tripsProgress[trips[i][0].trip_id].progressNow = (timeShifted-startTime)/trips[i].duration;
					progressThen = (timeShifted+delta-startTime)/trips[i].duration;					
				} else {
					tripsProgress[trips[i][0].trip_id].progressNow = (time-startTime)/trips[i].duration;
					progressThen = (time+delta-startTime)/trips[i].duration;
				}
				if (progressThen > 1) progressThen = 1;
				tripsProgress[trips[i][0].trip_id].progressThen = progressThen;
				// invert all progresses if direction bit is set
				if (gtfs.getTripById(trips[i][0].trip_id).direction_id==1) {
					tripsProgress[trips[i][0].trip_id].progressNow = 1-tripsProgress[trips[i][0].trip_id].progressNow;
					tripsProgress[trips[i][0].trip_id].progressThen = 1-tripsProgress[trips[i][0].trip_id].progressThen;
				}
			}
		}
		console.log(tripsProgress);
		return tripsProgress;
	};	
	
	// 1. convert all arrival_time (hh:mm:ss) to arrivalTime (ms since 00:00), use dd-mm-yyyy from parameter "datestamp"
	// 2. find the start and end point index, saved in .end and .start
	var convertArrivalTimes = function (datestamp) {
		var day = datestamp.getDate();
		var month = datestamp.getMonth()+1;
		var year = datestamp.getYear()+1900;
		var dateString = month+" "+day+", "+year+" ";	
		dateString = "0 0, 0 ";
		var arrivalTime;
		var tripsWithDates = {};						// return array

		
		// convert the dates and gather the stoptimes for one tripid
		for (var i in stopTimes) {
			// get the Time
			var arrival_time = stopTimes[i].arrival_time;
			if (!arrival_time) continue;
			var arrivelTimeSplited = arrival_time.split(":");
			
			arrivalTime = (arrivelTimeSplited[0] * 60 * 60 + arrivelTimeSplited[1] * 60 + arrivelTimeSplited[2]*1)*1000;
			//console.log (arrivelTimeSplited[0] + ":"+arrivelTimeSplited[1]+":"+arrivelTimeSplited[2]+"=>"+arrivalTime);
			stopTimes[i].arrivalTime = arrivalTime;
			
			// gather the stoptimes for one tripid
			if (!tripsWithDates[stopTimes[i].trip_id]) {
				tripsWithDates[stopTimes[i].trip_id] = [];
			}
			tripsWithDates[stopTimes[i].trip_id].push(stopTimes[i]);
		}		
		
		for (var i in tripsWithDates) {
			var maxVal = -1;
			var minVal = 10000000;
			var min, max;
			for (var ii in tripsWithDates[i]) {
				//search the min stop_sequence
				if (tripsWithDates[i][ii].stop_sequence < minVal*1) {
					min = ii;
					minVal = tripsWithDates[i][ii].stop_sequence;
				}
				//search the max stop_sequence
				if (tripsWithDates[i][ii].stop_sequence > maxVal*1) {
					max = ii;
					maxVal = tripsWithDates[i][ii].stop_sequence;
		
				}
			}
			tripsWithDates[i].start = min;	
			tripsWithDates[i].end = max;
			// how long is the trip:
			tripsWithDates[i].duration = tripsWithDates[i][max].arrivalTime-tripsWithDates[i][min].arrivalTime;
		}		
		return tripsWithDates;
	}
	
	
	function nextStep( callback) {
		callback({
			trips : calculateTripProgess((new Date()), 10000),
			timestamp :  (new Date()).getTime(),
		});
	}	
	
	return {
		init : function(gtfsObject, intervall, cb) {
			gtfs = gtfsObject;		// we need this later
			stopTimes = gtfs.getStopTimes();
			date = new Date();
			trips = convertArrivalTimes(date);
			//console.log(trips);

			nextStep(cb);
			setInterval(function(){
				nextStep(cb);
			}, intervall);
		}	
	};
	


	

	
	return {
		init : init,
		getCurrentTripsProgress : getCurrentTripsProgress
	};
})();
