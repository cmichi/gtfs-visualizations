var path = require('path');
var crypto = require('crypto');
var jquery = require('jquery');
var argv = require('optimist').argv;
var fs = require('fs');
var simplify = require(path.join(__dirname, ".", "lib", "simplify"));
var Gtfs = require(path.join(__dirname, ".", "parser", "loader"));
var Rainbow = require(path.join(__dirname, "lib", "rainbowvis"));

var rainbow = new Rainbow.Rainbow();
var shapes;
var trips;
var segments = []
var sequences = []
var sequences_length = 0
var all_coords = [];
var max;
var min;
var svg = new Boolean(argv.svg);

//var dir = "./gtfs/sf/";
//var dir = "san-diego";
//var dir = "./gtfs/san-diego/";
//var dir = "./gtfs/los-angeles/";
//var dir = "./gtfs/berlin/";
//var dir = "./gtfs/bart-sf/";
//var dir = "./gtfs/ulm/";
//var dir = "ulm";
var render_area = {width: 600, height: 600};
var bbox;

var gtfs = Gtfs("./gtfs/" + argv.gtfs + "/", function(data) {
	shapes = data.getShapes();
	trips = data.getTrips();

	prepareData();
	createFile();
});

function prepareData() {
	debug("Starting to prepare data...");

	/* count the trips on a certain id */
	var trips_count = []
	for (var i in trips) {
		var trip = trips[i];
		if (trips_count[ trip.shape_id ] == undefined)
			trips_count[ trip.shape_id ] = 1;
		else
			trips_count[ trip.shape_id ]++;
		//console.log(trip.shape_id)
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
			all_coords.push([new Number(shape.shape_pt_lat), 
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
					}
				}

				if (trips_count[shape_id] == undefined) {
					// maybe the shape exists, but
					// there are no trips for it
					//console.log("shit2")
					trips_count[shape_id] = 0;
					//console.log(shape_id)
				}

				segments[segment_index].trips += trips_count[shape_id];

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

function createBBox(coords) {
	bbox = {
		left: coords[0][1]
		, right: coords[0][1]
		, top:  coords[0][0]
		, bottom:  coords[0][0]
		, width: 0
		, height: 0

		, shift_x: 0
		, shift_y: 0
	};

	for (var i in coords) {
		if (coords[i][1] < bbox.left)
			bbox.left = coords[i][1];

		if (coords[i][1] > bbox.right)
			bbox.right = coords[i][1];

		if (coords[i][0] > bbox.top)
			bbox.top = coords[i][0];

		if (coords[i][0] < bbox.bottom)
			bbox.bottom = coords[i][0];
	}

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
	var paths_file = [];
	var paths = [];

	createBBox(all_coords);

	var working = 0;
	var one = 1;
	debug("\nStarting to create file...");

	for (var i in sequences) {
		var A = undefined;
		var B = undefined;

		var path = "";
		var last_px;
		var last_shape;
		var last_trips = 0;
		var pts = []
		for (var n in sequences[i]) {
			var shape = sequences[i][n];
			var px = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);
			
			if (svg) {
				if (path == "") 
					path = "M" + px.x + " " + (px.y);
				else 
					path += " L" + px.x + " " + (px.y);
			}
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
						var simplified_pts = simplify(pts, 3.5, true);
						for (var un in simplified_pts) {
							coords += simplified_pts[un].x + " " + simplified_pts[un].y + ","
						}
						paths_file.push(trips + "\t" + coords);
						if (svg) 
							paths.push('<path style="" fill="none" stroke="#'+col+'" d="'+path+'"/>')
					}
				}
			}

			last_px = px;
			last_shape = shape;
		}
		last_trips = trips;

		if ((sequences_length - working) % 5 == 0)
			console.log((sequences_length - working) + " left")

		working += one;
	}

	fs.writeFileSync("./output/" + argv.gtfs + "/data.lines", paths_file.join('\n'), "utf8");
	fs.writeFileSync("./output/" + argv.gtfs + "/maxmin.lines", max + "\n" + min, "utf8");

	debug("Files written.");

	if (svg) {
		var svgContent = '<?xml version="1.0" encoding="UTF-8"?>'
		+ '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" '
		+ '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> '
		+ '<svg xmlns="http://www.w3.org/2000/svg" '
		+ 'xmlns:xlink="http://www.w3.org/1999/xlink" '
		+ 'xmlns:ev="http://www.w3.org/2001/xml-events" '
		+ 'version="1.1" baseProfile="full" '
		+ 'width="800" height="800">\n'
		+ paths.join('\n') 
		+ "\n</svg>";

		fs.writeFileSync("./output/" + argv.gtfs + "/output.svg", svgContent, "utf8");
	}
}

function debug(msg) {
	if (argv.verbose) console.log(msg);
}
