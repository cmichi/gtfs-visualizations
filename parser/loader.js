var path = require('path');
var csv = require(path.join(__dirname, "csv-loader"));
var Barrier = require(path.join(__dirname, "barrier-points"));

module.exports = function(dir, cb){
	
	var dataset = {};
	
	var barrier = new Barrier(7, function() {
		cb({
			getAgency : function () {
				return dataset.agency;
			},
			getCalendars : function () {
				return dataset.calendar;
			},
			getRoutes : function () {
				return dataset.routes;
			},
			getShapes : function () {
				return dataset.shapes;
			},
			getStops : function () {
				return dataset.stops;
			},
			getStopTimes : function () {
				return dataset.stop_times;
			},
			getTrips : function () {
				return dataset.trips;
			},
			getRouteById : function(id) {
				for (var route in dataset.routes) {		
					if (dataset.routes[route].route_id == id) return dataset.routes[route];		
				}
			},
			getTripById : function(id) {
				for (var trip in dataset.trips) {		
					if (dataset.trips[trip].trip_id == id) return dataset.trips[trip];		
				}
			},			
			getShapesById : function(id) {
				var ret = [];
				for (var i in dataset.shapes) {
					if (dataset.shapes[i].shape_id == id) ret.push(dataset.shapes[i]);
				}
				return ret;
			},
			getCalendarById : function(id) {
				for (var cal in dataset.calendar) {
					if (dataset.calendar[cal].service_id == id){
						return dataset.calendar[cal];
					} 
				}
			},
			getStopById : function(id) {
				for (var stop in stops) {
					if (stops[stop].stop_id == id) {
						return stops[stop];
					} 
				}
			},
			getStopTimeById : function(trip_id,stop_id) {
				for (var stop_time in stop_times){
					if (stop_times[stop_time].trip_id == trip_id && stop_times[stop_time].stop_id == stop_id){
						return stop_times[stop_time];
					} 
				}
			}		
		});
	});	

	var dataset = {};
	
	['agency', 'calendar', 'routes', 'shapes', 'stops', 'stop_times', 'trips'].forEach(function(id){
		csv.load(path.join(dir, id+".txt"), function(data) {
			dataset[id] = data;
			barrier.submit();
		});
	});

};






