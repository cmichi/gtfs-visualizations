var path = require('path');
var crypto = require('crypto');
var jquery = require('jquery');
var fs = require('fs');
var simplify = require(path.join(__dirname, ".", "lib", "simplify"));
var Gtfs = require(path.join(__dirname, ".", "parser", "loader"));
var Rainbow = require(path.join(__dirname, "lib", "rainbowvis"));

var rainbow = new Rainbow.Rainbow();
var shapes;
var trips;
var segments = []
var sequences = []
var all_coords = [];

var dir = "./gtfs/ulm/";
var center = {lat: 48.40783887047417, lng: 9.987516403198242};
var render_area = {width: 600, height: 600};
var bbox;

var gtfs = Gtfs(dir, function(data) {
	shapes = data.getShapes();
	trips = data.getTrips();

	foobar();
});


function foobar() {
	var max;
	var min;

	/* count the trips on a certain id */
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

	/* ensure that the shape points are in the correct order */
	for (var i in shapes) {
		var shape = shapes[i];
		if (sequences[shape.shape_id] == undefined)
			sequences[shape.shape_id] = []

		sequences[shape.shape_id][shape.shape_pt_sequence] = shape;
	}

	for (var i in sequences) {
		var A = undefined;
		var B = undefined;
		var last_undef = 0

		// evtl. wurde ein segment uebersprugen

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
						, "shape_ids": [shape_id]
						, "from": A
						, "to": B
					}
				} else {
					if (jquery.inArray(shape_id, segments[segment_index].shape_ids) === -1) 
						segments[segment_index].shape_ids.push(shape_id)
				}
				segments[segment_index].trips += trips_count[shape_id];

				/* check if {B, A} in arr */
				if (segment_index != segment_index2 && segments[segment_index2] != undefined) {
					segments[segment_index].trips = segments[segment_index].trips
					// ggf shape_ids.push(shape_id)
				}

				if (segments[segment_index].trips > max || max == undefined)
					max = segments[segment_index].trips;

				if (segments[segment_index].trips < min || min == undefined)
					min = segments[segment_index].trips;

				A = B;
			}
		}
	}
	//console.log("max " + max);
	//console.log("min " + min);

	rainbow.setNumberRange(min, max);
	rainbow.setSpectrum('blue', 'green', 'yellow', 'red');

	createFile();
}

function coord2px(lat, lng) {
	var coordX = bbox.width_f * (lng - bbox.left)
	var coordY = bbox.height_f * (bbox.top - lat)

	return {x: coordX, y: coordY};
}

function createBBox(coords) {
	bbox = {
		left: center.lng
		, right: center.lng
		, top: center.lat
		, bottom: center.lat
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
			//return;
			if (path == "") 
				path = "M" + px.x + " " + (px.y);
			else 
				path += " L" + px.x + " " + (px.y);
			pts.push({x: new Number(px.x), y: new Number(px.y)});

			if (last_shape != undefined) {
				A = {"lat": shape.shape_pt_lat, "lng": shape.shape_pt_lon};
				B = {"lat": last_shape.shape_pt_lat, "lng": last_shape.shape_pt_lon};
				var segment_index = hash([A, B]);

				if (segments[segment_index] != undefined) {
					// sind die anzahl an trips unterschiedlich
					// wie auf dem bisher ge-pathten teilstueck?
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
						paths.push('<path style="" fill="none" stroke="#'+col+'" d="'+path+'"/>')
					}
				}
			}

			last_px = px;
			last_shape = shape;
		}
		last_trips = trips;
	}

	fs.writeFileSync("./processing/data.asc", paths_file.join('\n'), "utf8");
	fs.writeFileSync("output.svg", paths.join('\n'), "utf8");
}
