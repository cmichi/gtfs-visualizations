var rainbow = new Rainbow();
rainbow.setNumberRange(1, 2093);
rainbow.setSpectrum('blue', 'green', 'yellow', 'red');

var stops = [];
var paper;
var foo = [];
var trips = [];
var paths = [];

$(function (){
	paper = Raphael("canvas", imgWidth, imgHeight);

	// hier ganz normal alle shapes zeichnen, fuer jedes teilstueck
	// checken, ob es fuer dieses teilstueck einen entsprechenden trips
	// eintrag gibt
	$.getJSON("/paths/", function(paths) {
		for (var i in paths) {
			var path = paths[i];

			var tada = paper.path(path.path);
			var color = rainbow.colourAt(path.trips);
			color = "ff0000"
			tada.attr("stroke", "#" + color);
			foo.push(tada)
		}
	});

/*
	$.getJSON("/lines/", function(lines) {
		var path = "";
		var lasttrips = 0;
		var u = 0
		//console.log(lines)

		for (var i in lines) {
			var line = lines[i];
			if (line.trips != lasttrips) {
				var tada = paper.path(path);
				var color = rainbow.colourAt(line.trips);
				//color = "ff0000"
				tada.attr("stroke", "#" + color);
				foo.push(tada)

				path = "M" + line.from.x + " " + line.from.y;
			} else {
				path += " L" + line.from.x + " " + line.from.y;
			}

			path += " L" + line.to.x + " " + line.to.y;

			// if different trips: different color || last for call
			if (line.trips != lasttrips || u == lines.length-1) {
				var tada = paper.path(path);
				var color = rainbow.colourAt(line.trips);
				//color = "ff0000"
				tada.attr("stroke", "#" + color);
				foo.push(tada)
				u = 0;
			}
			u++;
			//console.log(u + " " + path)

			lasttrips = line.trips;
			//if (u == 50) return;
		}
	});
	*/
});


var imgWidth = 1400;
var imgHeight = 1400;

/*
function coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	//var coord2px_factor = 11000;
	var coord2px_factor = 3400;

	var offsetX = 0;
	var offsetY = -300;

	return {
		  x: center_px.x + ((lat - center_coord.lat) * coord2px_factor) + offsetX
		, y: center_px.y + ((lng - center_coord.lng) * coord2px_factor) + offsetY
	};
}
*/
