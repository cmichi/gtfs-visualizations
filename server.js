var express = require('express');
var http = require('http');
//var parser = require('parser');
var path = require('path');
var crypto = require('crypto');
var jquery = require('jquery');
var Gtfs = require(path.join(__dirname, ".", "parser", "loader"));

var dir = "./gtfs/ulm/";
var stops;
var shapes;
var trips;
var gtfs = Gtfs(dir, function(data) {
	//console.log(data);
	//console.log(data.getStops());
	//console.log(data.getShapes());
	stops = data.getStops();
	shapes = data.getShapes();
	trips = data.getTrips();

	foobar();

	server.listen(process.env.PORT || 3000, function() {
		console.log('Listening on port ' + server.address().port);
	});
});

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var server = require('http').createServer(app);



app.get('/stops/', function(req, res){
	console.log(stops);
	res.send(stops);
	//res.send("foo\n");
});

app.get('/shapes/', function(req, res){
	res.send(shapes);
});

app.get('/trips/', function(req, res){
	res.send(trips);
});

var max;
var min;


function foobar() {
	var trips_count = []
	for (var i in trips) {
		var trip = trips[i];
		if (trips_count[ trip.shape_id ] == undefined)
			trips_count[ trip.shape_id ] = 1;
		else
			trips_count[ trip.shape_id ]++;
		
		if (trips_count[ trip.shape_id ] > max || max == undefined)
			max = trips_count[ trip.shape_id ];

		if (trips_count[ trip.shape_id ] < min || min == undefined)
			min = trips_count[ trip.shape_id ];
	}

	/*
	we have to break the shapes in chunks of predecessor/successor,
	cause there might be overlapping segments of different shapes.
	[
		{ {x:.., y:..}, {x:.., y:..} }: {
			trips: 3 	// 3 trips along this segment
			, shape_ids: []
		}
	]
	*/

	// preprocess 
	var segments = []
	var predecessor = undefined;
	var predecessor_shape_id = undefined;

	var sequences = []
	for (var i in shapes) {
		var shape = shapes[i];
		if (sequences[shape.shape_id] == undefined)
			sequences[shape.shape_id] = []

		sequences[shape.shape_id][shape.shape_pt_sequence] = shape;
	}
	//console.log(sequences);

	var a = 0
	for (var i in sequences) {
		var A = undefined;
		var B = undefined;
		for (var n in sequences[i]) {
			a++
			//console.log(sequences[i])
			var shape = sequences[i][n];
			var shape_id = shape.shape_id
			//console.log(shape_id)
			//console.log(shape)
			/*
			shape.shape_pt_lat = shape.shape_pt_lat;
			shape.shape_pt_lon = parseInt(shape.shape_pt_lon);
			//console.log(shape.shape_pt_lon)
			//console.log(parseInt(shape.shape_pt_lon))
			break;
			return;
			*/

			if (A == undefined) {
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
				//A = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);
				continue;
			} else {
				//B = [shape.shape_pt_lat, shape.shape_pt_lon];
				B = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
				//B = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);

				//console.log(JSON.stringify(foo))
				//var foo = A.toString(), to: B}
				//foo = $.md5(JSON.stringify(foo))
				//foo = CryptoJS.MD5(JSON.stringify(foo))

				var foo = {from: A, to: B}
				var md5 = crypto.createHash('md5');
				md5.update(JSON.stringify(foo), "ascii")
				foo = md5.digest("hex")

				// maybe shape from different direction,
				// but on this segment
				var foo2 = {from: B, to: A}
				var md5_ = crypto.createHash('md5');
				md5_.update(JSON.stringify(foo2), "ascii")
				foo2 = md5_.digest("hex")

				//foo = md5.digest("base64")
				//foo = JSON.stringify(foo).hashCode()
				//console.log(foo)

				if (foo != foo2 && segments[foo2] != undefined && segments[foo] != undefined) {
					console.log("something went terribly wrong..")
					console.log(foo2);
					console.log(foo);
					console.log(JSON.stringify({from: A, to: B}));
					console.log(JSON.stringify({from: B, to: A}));
					return;
				}

				// missing: check if {B, A} in arr
				if (foo != foo2 && segments[foo2] != undefined) 
					foo = foo2;

				if (segments[foo] == undefined) {
					segments[foo] = {
						"trips": 0
						, "shape_ids": [shape_id]
						, "from": A
						, "to": B
					}
				} else {
					if (jquery.inArray(shape_id, segments[foo].shape_ids) === -1) {
						segments[foo].shape_ids.push(shape_id)
					}
				}
				//console.log(shape_id);
				//console.log(trips_count[shape_id]);
				segments[foo].trips += trips_count[shape_id];

				if (segments[foo].trips > max || max == undefined)
					max = segments[foo].trips;

				if (segments[foo].trips < min || min == undefined)
					min = segments[foo].trips;
			}

			/*
			if (a == 10) {
				console.log("tada")
				console.log(segments);
				return;
			}
			*/
		}
	}
	console.log(segments.length);
	console.log(a);
	console.log("max " + max);
	console.log("min " + min);


	// now generate svg paths from segments array!
	var a = 0;
	var lines = []
	/*
		lines = [ {from: [x, y], to: [x, y], trips: 0} , ... ]
	*/
	for (var i in segments) {
		// draw a line for each segment
		var px_from = coord2px(segments[i].from.lat, segments[i].from.lng);
		var px_to = coord2px(segments[i].to.lat, segments[i].to.lng);
		var obj = { "from": {"x": px_from.x, "y": px_from.y}
			    , "to":   {"x": px_to.x, "y": px_to.y}
			    , "trips": segments[i].trips
		};
		lines.push(obj);
		//console.log(segments[i])
		//console.log(segments[i])
		//if (++a == 10) break;
	}
	console.log(lines.length + " lines");
}

var imgWidth = 1400;
var imgHeight = 1400;
function coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	var coord2px_factor = 3400;

	var offsetX = 0;
	var offsetY = -300;

	return {
		  x: center_px.x + ((lat - center_coord.lat) * coord2px_factor) + offsetX
		, y: center_px.y + ((lng - center_coord.lng) * coord2px_factor) + offsetY
	};
}
