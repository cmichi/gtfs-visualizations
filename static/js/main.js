/*var rainbow = new Rainbow();
rainbow.setNumberRange(1, 2093);
rainbow.setSpectrum('blue', 'green', 'yellow', 'red');
*/

var stops = [];
var paper;
var foo = [];
var trips = [];
var paths = [];
var processingInstance;
var paths_processing;
var lines;

$(function (){
	//paper = Raphael("canvas", imgWidth, imgHeight);

	// hier ganz normal alle shapes zeichnen, fuer jedes teilstueck
	// checken, ob es fuer dieses teilstueck einen entsprechenden trips
	// eintrag gibt
	// raphael 
	/*
	$.getJSON("/paths/", function(paths) {
		for (var i in paths) {
			var path = paths[i];

			var tada = paper.path(path.path);
			//var color = rainbow.colourAt(path.trips);
			var color = path.color;
			//color = "ff0000"
			tada.attr("stroke", "#" + color);
			//foo.push(tada)
		}
	});
	*/

	// processing
	/*
	$.getJSON("/paths_processing/", function(paths_pr) {
		paths_processing = paths_pr;
	var canvas = document.getElementById("canvas1");
	// attaching the sketchProc function to the canvas
	processingInstance = new Processing(canvas, sketchProc);
	*/

	$.get("/test.processing", function(data) {
		lines = data.split("\n");

		var canvas = document.getElementById("canvas1");
		processingInstance = new Processing(canvas, sketchProc);
	});


/*
		for (var i in paths) {
			var path = paths[i];

	
			var tada = paper.path(path.path);
			tada.attr("stroke", "#" + path.color);
		}
	});
		*/


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
				//var color = rainbow.colourAt(line.trips);
				var color = "ff0000"
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
				//var color = rainbow.colourAt(line.trips);
				var color = "ff0000"
				tada.attr("stroke", "#" + color);
				foo.push(tada)
				u = 0;
			}
			u++;
			//console.log(u + " " + path)

			lasttrips = line.trips;
			if (u == 20) return;
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



/*
function sketchProc(processing) {
  // Override draw function, by default it will be called 60 times per second
  processing.draw = function() {
  }

  processing.setup = function() {
	for (var i in paths_processing) {
		var pre;
		var p = paths_processing[i];

		processing.strokeWeight(1);
		//console.log(p.color)
		processing.stroke("#" + p.color)

		for (var n in p.path) {
			if (pre == undefined) {
				pre = p.path[n]
				continue;
			}
			processing.line(pre[0], pre[1], 
			p.path[n][0], p.path[n][1])

			processing.background(224);
			pre = p.path[n]
		}
	}
  };
}
*/

function sketchProc(processing) {
	processing.width = 1400;
	processing.height = 1400;

  // Override draw function, by default it will be called 60 times per second
  processing.draw = function() {
  }

  processing.setup = function() {
	processing.background(200);
	processing.strokeWeight(2);
	//processing.fill(255,0,0)
	processing.noFill();
	//processing.ellipse(400, 400, 250, 200)

	processing.stroke(255, 0, 0)

	var u = 0;
	for (var i in lines) {
		var line = lines[i].split("\t")
		var points = line[1].split(",");
		//processing.stroke("#" + line[0])

		//var p = paths_processing[i];
		//console.log(p.color)

		var pre = undefined;
		for (var n in points) {
			if (points[n] == undefined || points[n] == "") continue;

			var coords = points[n].split(" ")
			console.log(points[n])
			if (pre == undefined) {
				pre = coords
				continue;
			}

			processing.line(pre[0], pre[1], 
					coords[0], coords[1])

			console.log(pre[0] + ", " + pre[1] + ", " + 
					coords[0] + ", " + coords[1])

			pre = coords;
			//return;
		}
		if (u == 50) return;
		u++
	}
  };
}
