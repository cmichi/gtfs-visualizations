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

var stops = [];
var paper;
var foo = [];
var trips = [];
var paths = [];

$(function (){
	paper = Raphael("canvas", imgWidth, imgHeight);
	//paper = Raphael("canvas", imgWidth, imgHeight, function() {})
	/*
	$.getJSON("/stops/", function(data) {
			var j = 0;
			for (var i in data) {
				var stop = data[i];
				var obj = coord2px(stop.stop_lat, stop.stop_lon);

				var circle = paper.circle(obj.x, obj.y, 3);
				circle.attr("fill", "#f00");
				console.log(obj)
				//circle.attr("stroke", "#fff");
				//if (j === 5) break;
				++j;
			}
		//});
	});
	*/

	$.getJSON("/trips/", function(data) {
		for (var i in data) {
			var trip = data[i];
			if (trips[ trip.shape_id ] == undefined)
				trips[ trip.shape_id ] = 1;
			else
				trips[ trip.shape_id ]++;
			
			if (trips[ trip.shape_id ] > max || max == undefined)
				max = trips [ trip.shape_id ];

			if (trips[ trip.shape_id ] < min || min == undefined)
				min = trips [ trip.shape_id ];
		}
		//console.log(trips)

		$.getJSON("/shapes/", function(data) {
			var j = 0;

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
			for (var i in data) {
				var shape = data[i];
				if (sequences[shape.shape_id] == undefined)
					sequences[shape.shape_id] = []

				sequences[shape.shape_id][shape.shape_pt_sequence] = shape;
			}
			//console.log(sequences);

			var A = undefined;
			var B = undefined;
			var a = 0
			for (var i in sequences) {
			for (var n in sequences[i]) {
			a++
			console.log(sequences[i])
				var shape = sequences[i][n];
				var shape_id = shape.shape_id
				console.log(shape_id)
				console.log(shape)
				/*
				shape.shape_pt_lat = shape.shape_pt_lat;
				shape.shape_pt_lon = parseInt(shape.shape_pt_lon);
				console.log(shape.shape_pt_lon)
				console.log(parseInt(shape.shape_pt_lon))
				break;
				return;
				*/

				if (A == undefined) {
					A = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);
					continue;
				} else {
					B = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);

					var foo = {from: A, to: B}
					console.log(JSON.stringify(foo))
					//var foo = A.toString(), to: B}
					//foo = $.md5(JSON.stringify(foo))
					foo = CryptoJS.MD5(JSON.stringify(foo))
					foo = foo.toString()
					//foo = JSON.stringify(foo).hashCode()
					//console.log(foo)

					if (segments[foo] == undefined) {
						segments[foo] = {
							"trips": 0
							, "shape_ids": [shape_id]
						}
					} else {
						if ($.inArray(shape_id, segments[foo].shape_ids) === -1) {
							segments[foo].shape_ids.push(shape_id)
						}
					}
					segments[foo].trips += trips[shape_id];

				}

				if (a == 5) {
					console.log("tada")
					console.log(segments);
					return;
				}

			}
			}
			//console.log(segments);

/*
				if (segments[obj] == undefined) {
					//paths[shape.shape_id] = []
					segments[obj] = [];
					segments[obj][   ]
					paths[shape.shape_id][shape.shape_pt_sequence] = "M" + obj.x + " " + obj.y
					//paths[shape.shape_id] = "M" + obj.x + " " + obj.y
				} else {
					paths[shape.shape_id][shape.shape_pt_sequence] += 
						" L" + obj.x + " " + obj.y;
				}

				//if (j === 30) break;
			*/
				//++j;

			// are there paths who are exactly identical?
			var identical = 0;
			for (var i in paths) {
				for (var n in paths) {
					if (paths[i] === paths[n] && i != n)
						//console.log(paths[i])
						//console.log(trips[i])
						//console.log("")
						identical++;
				}
			}
			//console.log("identical: " + identical)

			//var factor = 100 / max;
			//console.log("max " + max)
			//console.log("min " + min)
			//console.log(factor)
			rainbow.setNumberRange(min, max);
			rainbow.setSpectrum('blue', 'green', 'yellow', 'red');

			// gewichten! erst die mit geringsten trips zeichnen
			for (var i in trips) {
				//console.log("i : " + i)
			}

			trips = trips.sort(Numsort)
			//console.log(trips)
			for (var i in trips) {
				//console.log("pathi : " + i)
				//console.log(trips[i] + " " + i)
				if (!paths[i]) continue;
				var path = paths[i].join() 
				//path += " Z";

				//console.log(trips[i] + " " + i)

				//if (trips[i] < 80) continue;

				foo[i] = paper.path(path);
				//console.log(path);
				//var path = paper.path(path);
				//foo.attr("fill", "#f00");
				//var color =  (1 - t) * c0 + t * c1

				//console.log("i " + i + ", " + trips[i]);
				var color = rainbow.colourAt(trips[i]);
				//console.log(trips[i])
				foo[i].attr("stroke", "#" + color);
				//foo.attr("stroke", "#fff");
			}
		});
	});
});

var rainbow = new Rainbow();
var max;
var min;


function drawCenter() {
	/* // draw center
	var obj = coord2px(48.40783887047417, 9.987516403198242);
	var circle = this.circle(obj.x, obj.y, 5);
	circle.attr("fill", "#f00");
	circle.attr("stroke", "#fff");
	console.log(obj);
	*/

}

function Numsort (a, b) {
  return 1*a - 1*b;
}


// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function(){
	var hash = 0, i, char;
	if (this.length == 0) return hash;

	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};
