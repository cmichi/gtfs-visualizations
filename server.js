var express = require('express');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var jquery = require('jquery');
var fs = require('fs');
var simplify = require('./simplify-js/simplify');
var Gtfs = require(path.join(__dirname, ".", "parser", "loader"));

var Rainbow = require(path.join(__dirname, "static", "js", "rainbowvis"));
var rainbow = new Rainbow.Rainbow();
var debug = false;

var dir = "./gtfs/ulm/";
var stops;
var shapes;
var trips;
var segments = []
var segments_length = 0;

var gtfs = Gtfs(dir, function(data) {
	stops = data.getStops();
	shapes = data.getShapes();
	trips = data.getTrips();

	foobar();

	/*
	server.listen(process.env.PORT || 3000, function() {
		console.log('Listening on port ' + server.address().port);
	});
	*/
});

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var server = require('http').createServer(app);


var lines = []
app.get('/lines/', function(req, res){
	res.send(lines);
});

app.get('/stops/', function(req, res){
	//console.log(stops);
	res.send(stops);
	//res.send("foo\n");
});

app.get('/shapes/', function(req, res){
	res.send(shapes);
});

app.get('/paths/', function(req, res){
	res.send(paths);
});

app.get('/paths_processing/', function(req, res){
	res.send(paths_processing);
});

app.get('/trips/', function(req, res){
	res.send(trips);
});

var max;
var min;

var sequences = []
function foobar() {
	var trips_count = []
	for (var i in trips) {
		var trip = trips[i];
		if (trips_count[ trip.shape_id ] == undefined)
			trips_count[ trip.shape_id ] = 1;
		else
			trips_count[ trip.shape_id ]++;
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

	// ensure that the points are in the correct order!
	for (var i in shapes) {
		var shape = shapes[i];
		if (sequences[shape.shape_id] == undefined)
			sequences[shape.shape_id] = []

		sequences[shape.shape_id][shape.shape_pt_sequence] = shape;
	}

	var a = 0
	for (var i in sequences) {
		var A = undefined;
		var B = undefined;
		var last_undef = 0

		// evtl. wurde ein segment uebersprugen

		for (var n in sequences[i]) {
			a++;
			var shape = sequences[i][n];
			var shape_id = shape.shape_id

			if(last_undef == 1 && A == undefined)
				console.log("shit")

			// checken, ob das hier ggf der letzte punkt war
			if (n == sequences[i].length-1 && A == undefined)
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};

			if (A == undefined) {
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
					

				last_undef = 1;
				continue;
			} else {
				last_undef = 0;
				B = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
				var foo = hash([A, B]);

				// maybe shape from different direction, but on this segment
				var foo2 = hash([B, A]);

				if (segments[foo] == undefined) {
					segments[foo] = {
						"trips": 0
						, "shape_ids": [shape_id]
						, "from": A
						, "to": B
					}
					segments_length++;
				} else {
					if (jquery.inArray(shape_id, segments[foo].shape_ids) === -1) 
						segments[foo].shape_ids.push(shape_id)
				}
				segments[foo].trips += trips_count[shape_id];

				// check if {B, A} in arr
				if (foo != foo2 && segments[foo2] != undefined) {
					segments[foo2].trips = segments[foo].trips
					// ggf shape_ids.push(shape_id)
				}

				if (segments[foo].trips > max || max == undefined)
					max = segments[foo].trips;

				if (segments[foo].trips < min || min == undefined)
					min = segments[foo].trips;

				//A = B;
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
			}
		}
	}
	//console.log(segments_length + " segments");
	//console.log("a: " + a);
	//console.log("max " + max);
	//console.log("min " + min);

	// rainbow
	rainbow.setNumberRange(min, max);
	rainbow.setSpectrum('blue', 'green', 'yellow', 'red');

	// now generate svg paths from segments array!
	var a = 0;
	/*
		lines = [ {from: [x, y], to: [x, y], trips: 0} , ... ]
	*/
	for (var i in segments) {
		// draw a line for each segment
		var px_from = coord2px(segments[i].from.lat, segments[i].from.lng);
		//console.log(px_from);
		//return;
		var px_to = coord2px(segments[i].to.lat, segments[i].to.lng);
		var obj = { "from": {"x": px_from.x, "y": px_from.y}
			    , "to":   {"x": px_to.x, "y": px_to.y}
			    , "trips": segments[i].trips
		};
		//console.log(obj)
		//console.log(typeof(parseInt(segments[i].to.lat)))
		//break
		lines.push(obj);

		//console.log(i)
		//console.log(obj)
		//if (i == segments.length - 1)
			//console.log(segments[i])

		//console.log(segments[i])
		//console.log(segments[i])
		//console.log(segments[i].trips)
		//if (++a == 10) break;
	}
	//console.log(lines)
	//console.log(lines.length + " lines");

	drawShapes();
}

/*
var imgWidth = 800;
var imgHeight = 800;
function coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	var coord2px_factor = 10000;

	var offsetX = 500;
	var offsetY = -1600;
	offsetY = 100;
	//var offsetY = 200;
	//var offsetX = 50;

	var _lat = (lat)*1
	var _lng = (lng)*1

	return {
		  y: imgHeight -(center_px.x + ((center_coord.lat - _lat) * coord2px_factor) + offsetX)
		, x: (center_px.y + ((center_coord.lng - _lng) * coord2px_factor) + offsetY)
	};
}
*/
var imgWidth = 100000;
var imgHeight = 100000;


function coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	var coord2px_factor = 1000;

	var offsetX = 0;
	var offsetY = 0;

	var _lat = (lat)*1
	var _lng = (lng)*1

		  //y: imgHeight - (center_px.x + ((center_coord.lat - _lat) * coord2px_factor) + offsetX)
		//, x: (center_px.y + ((center_coord.lng - _lng) * coord2px_factor) + offsetY)

	var obj = {
		x: (_lng*imgWidth) / 360
		, y: (_lat*imgHeight) / 180
	}


	obj.x *= 1.0;
	obj.y *= 1.0;

	obj.x -= 2000;
	obj.y -= 26600;
	//obj.y = 500 - obj.y;
	obj.y = 1000 - obj.y;

	var f = 5.0
	obj.x *= f
	obj.y *= f
	obj.x -= 3600;
	//obj.y -= 900;
	obj.y -= 4000;

	//var calculatedHeight=((lat*containerHeight)/180);
	//return $(elem).offset().top+($(elem).height()-calculatedHeight);
	//console.log(obj)
	return obj;
}
function hash(foo) {
	var md5 = crypto.createHash('sha1');
	md5.update(JSON.stringify(foo), "ascii")

	return md5.digest("hex")
}

// creates svg etc.
var paths = []
var paths_processing = []
var paths_file = []
//var rainbow = new Rainbow();
//rainbow.setNumberRange(1, 2093);
//rainbow.setSpectrum('blue', 'green', 'yellow', 'red');
function drawShapes() {
var tot = 0;
	//sequences[shape.shape_id][shape.shape_pt_sequence] = shape;
	for (var i in sequences) {
		var A = undefined;
		var B = undefined;

		var path = "";
		var last_px;
		var last_shape;
		var last_trips = 0;
		for (var n in sequences[i]) {
			var shape = sequences[i][n];
			var px = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);
			if (path == "") 
				path = "M" + px.x + " " + (-1 * px.y);
			else 
				path += " L" + px.x + " " + (-1 * px.y);


			if (last_shape != undefined) {
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
				B = {"lat": last_shape.shape_pt_lat, "lng": last_shape.shape_pt_lon};
				var foo = hash([A, B]);

				if (segments[foo] != undefined) {
					// sind die anzahl an trips unterschiedlich
					// wie auf dem bisher ge-pathten teilstueck?
					trips = segments[foo].trips;
					//console.log(trips + " ..")
					if (trips != last_trips) {
						//var col = "#ff0000";
						var col = rainbow.colourAt(trips);
						paths.push({"path": path, "color": col, "trips": trips});
						last_trips = trips;
	var ptest = path.replace(/L/g,"").replace(/M/g,"").split(" ");
	var ptest2 = []
	var ptest3 = ""
	var ptest4 = []
	var x, y;
	for (var u in ptest) {
		if (x == undefined) {
			x = ptest[u]
		} else {
			y = ptest[u]
			ptest2.push([x, y])
			ptest3 += x + " " + y + ","
			ptest4.push({x: new Number(x), y: new Number(y)})
			x = y= undefined;
		}
			
	}
ptest3 = ""
						//console.log(ptest4.length)
						var newp = simplify(ptest4, 3.5, true);
						//var newp = simplify(ptest4, 1.5, true);
						//console.log(newp)
						if (newp != undefined) {
							//console.log(ptest4.length - newp.length)
							//newp = ptest4
						}
						for (var un in newp) {
							ptest3 += newp[un].x + " " + newp[un].y + ","
						}
						paths_processing.push({"path":ptest2 , "color": col});
						paths_file.push(trips + "\t" + ptest3);
						//paths_file.push(col + "\t" + ptest3);

						//paths_processing.push({"path": path.replace(/L/g,"").replace(/M/g,"").split(" "), "color": col});
						//paths.push('<path style="" fill="none" stroke="#'+col+'" d="'+path+'"/>')
					}
				}
			}

			last_px = px;
			last_shape = shape;
		}
		paths.push({"path": path, "color": col, "trips": trips});
		last_trips = trips;

		//if (tot == 40) break;
		tot++
	}
	//console.log(paths.length + " paths available")

	// output svg
	//for (var p in paths_processing


	//fs.writeFileSync("test.svg", paths.join('\n'), "utf8");
	fs.writeFileSync("processing/test.processing", paths_file.join('\n'), "utf8");
	//fs.writeFileSync("processing/test.processing", paths_processing.join('\n'), "utf8");



	// create svg
	/*
	var svg = raphael.generate(imgWidth, imgHeight, function draw(paper) {
		var foo = [];
		for (var i in paths) {
			var path = paths[i];

			var tada = paper.path(path.path);
			//var color = rainbow.colourAt(path.trips);
			var color = path.color;
			//color = "ff0000"
			tada.attr("stroke", "#" + color);
			foo.push(tada)
		}
	});
	*/
}
