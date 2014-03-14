var path = require('path');
var crypto = require('crypto');
var jquery = require('jquery');
var argv = require('optimist').argv;
var fs = require('fs');
var Gtfs = require(path.join(__dirname, ".", "parser", "loader"));
var Rainbow = require(path.join(__dirname, "lib", "rainbowvis"));

var rainbow = new Rainbow.Rainbow();
var shapes;
var trips;
var routes;
var segments = []
var sequences = []
var sequences_length = 0
var max;
var min;
var bbox;
var gtfs;

var large = true;
if (large) {
	var render_area = {width: 3400, height: 3400};
	var pathSuffix = "large";
} else {
	var pathSuffix = "small";
	var render_area = {width: 600, height: 600};
}

var requiredFile = "./gtfs/" + argv.gtfs + "/shapes.txt";
if (!fs.existsSync(requiredFile)) {
	console.error("\nERROR: " + requiredFile + " DOES NOT EXIST!\nEXITING.\n");
	process.exit(1);
}

debug("Loading GTFS files...");
Gtfs("./gtfs/" + argv.gtfs + "/", function(data) {
	debug("GTFS files loaded.\n");
	gtfs = data;
	shapes = gtfs.getShapes();
	trips = gtfs.getTrips();

	prepareData();
	createFile();
});

/* possible bug: can there be more route types for one shape? */
var route_types = [];
function getRouteTypeForShapeId(shape_id) {
	return route_types[shape_id];
}

function prepareData() {
	debug("Starting to prepare data...");

	/* count the trips on a certain id */
	var trips_on_a_shape = []; 
	for (var i in trips) {
		var trip = trips[i];
		if (trips_on_a_shape[ trip.shape_id ] == undefined)
			trips_on_a_shape[ trip.shape_id ] = 1;
		else
			trips_on_a_shape[ trip.shape_id ]++;

		var route_type = 1 * gtfs.getRouteById(trip.route_id).route_type;
		if (route_types[trip.shape_id] == undefined)
			route_types[trip.shape_id] = route_type;
	}

	/*
	we have to break the shapes in chunks of predecessor/successor,
	cause there might be overlapping segments of different shapes.
	[
		{ {x:.., y:..}, {x:.., y:..} }: {
			trips: 3 	// 3 trips along this segment
		}
	]
	*/

	/* ensure that the shape points are in the correct order */
	for (var i in shapes) {
		var shape = shapes[i];
		if (sequences[shape.shape_id] == undefined)
			sequences[shape.shape_id] = []

		sequences[shape.shape_id][shape.shape_pt_sequence] = shape;
	}

	for (var i in sequences) 
		sequences_length++;

	debug("Preparing data finished.");
	debug("\nStarting to create shape segments array with trips per segment...");

	for (var i in sequences) {
		var A = undefined;
		var B = undefined;
		var last_undef = 0

		for (var n in sequences[i]) {
			var shape = sequences[i][n];
			var shape_id = shape.shape_id

			adjustBBox([new Number(shape.shape_pt_lat), 
					new Number(shape.shape_pt_lon)]);

			if(last_undef == 1 && A == undefined)
				console.log("shit")

			/* was this the last point in a sequence? */
			if (n == sequences[i].length-1 && A == undefined)
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};

			if (A == undefined) {
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
					
				last_undef = 1;
				continue;
			} else {
				last_undef = 0;
				B = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
				var segment_index = hash([A, B]);

				// maybe shape from different direction, but on this segment
				var segment_index2 = hash([B, A]);

				if (segments[segment_index] == undefined) {
					segments[segment_index] = {
						"trips": 0
						, "from": A
						, "to": B
						, "route_type": undefined 
					}
				}

				if (trips_on_a_shape[shape_id] == undefined) {
					// maybe the shape exists, but
					// there are no trips for it
					//console.log("shit2")
					trips_on_a_shape[shape_id] = 0;
					//console.log(shape_id)
				}

				var route_type = getRouteTypeForShapeId(shape_id);
				if (route_type != undefined) {
					segments[segment_index].route_type = route_type;
				} else {
					//console.log("oh oh. undefined route_type for shape_id " + shape_id);
					//return;
				}

				segments[segment_index].trips += trips_on_a_shape[shape_id];

				/* check if {B, A} in arr */
				if (segment_index != segment_index2 && segments[segment_index2] != undefined) {
					segments[segment_index].trips = segments[segment_index].trips
				}

				if (segments[segment_index].trips > max || max == undefined)
					max = segments[segment_index].trips;

				if (segments[segment_index].trips < min || min == undefined)
					min = segments[segment_index].trips;

				A = B;
			}
		}
	}
	debug("Segments created.");

	if (max == min && max > 0) min--;
	if (max == min && max <= 0) max++;

	debug("max trips per segment: " + max);
	debug("min trips per segment: " + min);

	rainbow.setNumberRange(min, max);
	rainbow.setSpectrum('blue', 'green', 'yellow', 'red');

}

function coord2px(lat, lng) {
	var coordX = bbox.width_f * (lng - bbox.left)
	var coordY = bbox.height_f * (bbox.top - lat)

	return {x: coordX, y: coordY};
}

function adjustBBox(coords) {
	if (coords.length === 0) {
		console.error("no coordinates could be parsed!");
		console.error( JSON.stringify(coords) );
		process.exit(1);
	}

	if (!bbox) {
		bbox = {
			left: coords[1]
			, right: coords[1]
			, top:  coords[0]
			, bottom:  coords[0]
			, width: 0
			, height: 0

			, shift_x: 0
			, shift_y: 0
		};
	}

	if (coords[1] < bbox.left)
		bbox.left = coords[1];

	if (coords[1] > bbox.right)
		bbox.right = coords[1];

	if (coords[0] > bbox.top)
		bbox.top = coords[0];

	if (coords[0] < bbox.bottom)
		bbox.bottom = coords[0];

	bbox.height = bbox.top - bbox.bottom;
	bbox.width = bbox.right - bbox.left;

	bbox.width_f = render_area.width / bbox.width;
	bbox.height_f = render_area.height / bbox.height;

	/* how much do we need to shift for the points to be in the visible area? */
	var top_left = coord2px(bbox.left, bbox.top);
	if (top_left.x < 0)
		// so much, that the outermost point is on 0
		bbox.shift_x = -1 * top_left.x;
	else if (top_left.x > render_area.width)
		bbox.shift_x = -1 * top_left.x;

	if (top_left.y < 0)
		bbox.shift_y = -1 * top_left.y;
	else if (top_left.y > render_area.height)
		bbox.shift_y = -1 * top_left.y;
}

function hash(val) {
	var md5 = crypto.createHash('sha1');
	md5.update(JSON.stringify(val), "ascii")

	return md5.digest("hex")
}

function createFile() {
	fs.truncateSync("./output/" + argv.gtfs + "/data_" + pathSuffix + ".lines", 0, "utf8");


	var working = 0;
	var one = 1;
	debug("\nStarting to create file...");

	for (var i in sequences) {
		var A = undefined;
		var B = undefined;

		var last_px;
		var last_shape;
		var last_trips = 0;
		var pts = []
		for (var n in sequences[i]) {
			var shape = sequences[i][n];
			var px = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);
			
			pts.push({x: new Number(px.x), y: new Number(px.y)});

			if (last_shape != undefined) {
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
				B = {"lat": last_shape.shape_pt_lat, "lng": last_shape.shape_pt_lon};
				var segment_index = hash([A, B]);

				if (segments[segment_index] != undefined) {
					/* do the trips vary from the - so far - concatenated segments? */
					trips = segments[segment_index].trips;
					if (trips != last_trips) {
						var col = rainbow.colourAt(trips);
						last_trips = trips;

						var coords = "";
						for (var un in pts) {
							coords += pts[un].x + " " + pts[un].y + ","
						}

						var route_type = segments[segment_index].route_type;
						var line = trips + "\t" + route_type + "\t" + coords + "\n";
						fs.appendFileSync("./output/" + argv.gtfs + "/data_" + 
							pathSuffix + ".lines", line, "utf8", function(err) {
							if (err) throw err;
						});
					}
				}
			}

			last_px = px;
			last_shape = shape;
		}
		last_trips = trips;

		if ((sequences_length - working) % 5 == 0)
			debug((sequences_length - working) + " left")

		working += one;
	}

	fs.writeFileSync("./output/" + argv.gtfs + "/maxmin_" + pathSuffix  + ".lines", max + "\n" + min, "utf8");

	debug("Files written.");
}

function debug(msg) {
	if (argv.verbose) {
		var now = (new Date());
		console.log(now.getHours() + "h" + now.getMinutes() + "m: " + msg);
	}
}
