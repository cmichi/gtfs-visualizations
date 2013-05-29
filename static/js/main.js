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
	$.getJSON("/lines/", function(lines) {
		rainbow.setNumberRange(1, 518);
		rainbow.setSpectrum('blue', 'green', 'yellow', 'red');

		var j = 0;
		var path = "";
		var lasttrips = 0;
		var u = 0
		for (var i in lines) {
			var line = lines[i];
			//var obj = coord2px(stop.stop_lat, stop.stop_lon);
			if (line.trips != lasttrips)
				path = "M" + line.from.x + " " + line.from.y

			path += " L" + line.to.x + " " + line.to.y;

			if (line.trips != lasttrips && u > 0) {
				foo[i] = paper.path(path);
				var color = rainbow.colourAt(line.trips);
				foo[i].attr("stroke", "#" + color);
				//console.log(path)
				//console.log(line.trips)
				u = 0
			}
			u++

			lasttrips = line.trips

			//var circle = paper.circle(line.from.x, line.from.y, 3);
			//var circle = paper.circle(line.from.x, line.from.y, 3);
			//circle.attr("fill", "#f00");
			//console.log(obj)
			//circle.attr("stroke", "#fff");
			//if (j === 200) break;
			++j;
		}
		return;

		$.getJSON("/shapes/", function(data) {
			var j = 0;
			var paths = [];

			// preprocess, because the data might not be in
			// correct order
			for (var i in data) {
				var shape = data[i];
				var obj = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);

				if (paths[shape.shape_id] == undefined) {
					paths[shape.shape_id] = []
					paths[shape.shape_id][shape.shape_pt_sequence] = "M" + obj.x + " " + obj.y
					//paths[shape.shape_id] = "M" + obj.x + " " + obj.y
				} else {
					paths[shape.shape_id][shape.shape_pt_sequence] = 
						" L" + obj.x + " " + obj.y;
				}

				//if (j === 30) break;
				++j;
			}

/*
			for (var i in paths) {
				// draw until color changes
				var path = ""
				var lastColor = ""
				for (var n in paths[i]) {
					path += paths[i][n]
					if (
				}
				//var path = paths[i].join()
				//path += " Z";
				//console.log(path);

				foo = paper.path(path);
				//var path = paper.path(path);
				//foo.attr("fill", "#f00");
				foo.attr("stroke", "#fff");
			}
*/
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
