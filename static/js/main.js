/*
var sketchProc = function(processing) {
	processing.width = 800;
	processing.height = 800;
	var frameRate = 1;
	processing.frameRate(1)

	processing.setup = function() {
		//processing.frameRate(1)
		var frameRate = 1
		//processing.frameRate(1)
		console.log("ok")

	}

  // Override draw function, by default it will be called 60 times per second
  processing.draw = function() {
  //console.log("foo")

    // determine center and max clock arm length
    var centerX = processing.width / 2, centerY = processing.height / 2;
    var maxArmLength = Math.min(centerX, centerY);

    function drawArm(position, lengthScale, weight) {
      processing.strokeWeight(weight);
      processing.line(centerX, centerY,
        centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
        centerY - Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
    }

    // erase background
    processing.background(224);

    var now = new Date();

    // Moving hours arm by small increments
    var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
    drawArm(hoursPosition, 0.5, 5);

    // Moving minutes arm by small increments
    var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
    drawArm(minutesPosition, 0.80, 3);

    // Moving hour arm by second increments
    var secondsPosition = now.getSeconds() / 60;
    drawArm(secondsPosition, 0.90, 1);
  };
}

var canvas, processingInstance;

$(function() {
	canvas = document.getElementById('canvas1')
	//var canvas = $("#canvas1");
	processingInstance = new Processing(canvas, sketchProc);
});

*/

var imgWidth = 500;
var imgHeight = 500;

/*
function coord2px(lat, lon) {
	//
		48.42677
	9.94224		 9.96477
		48.41809
	//
	var bbLeft = 9.94224;
	var bbRight = 9.96477;
	var bbTop = 48.42677;
	var bbBottom = 48.41809;

	var bbHeight = bbTop - bbBottom;
	var bbWidth = bbRight - bbLeft;

	var shiftX = -1537;
	var shiftY = -891;

	var coordX = ((imgWidth / bbWidth) * (lon - bbLeft)) + shiftX;
	var coordY = ((imgHeight / bbHeight) * (bbTop - lat)) + shiftY;
	coordY *= -1;

	return {x: coordX, y: coordY};
}

function coord2px(lat, lon) {
	// center: 48.399976 9.995399 
	var bbLeft = 9.94;
	var bbRight = 9.99;
	var bbTop = 48.42;
	var bbBottom = 48.30;

	var bbHeight = bbTop - bbBottom;
	var bbWidth = bbRight - bbLeft;

	var shiftX = 0;
	var shiftY = 0;

	var coordX = ((imgWidth / bbWidth) * (lon - bbLeft)) + shiftX;
	var coordY = ((imgHeight / bbHeight) * (bbTop - lat)) + shiftY;
	coordY *= -1;

	return {x: coordX, y: coordY};
}
*/

function coord2px(lat, lng) {
	var center_coord = {lat: 48.399976, lng: 9.995399};
	var center_px = {x: 300, y: 300};
	var coord2px_factor = 2;

	var coordX = center_px.x + ((lat - center_coord.lat) * coord2px_factor);
	var coordY = center_px.y + ((lng - center_coord.lng) * coord2px_factor);

	return {x: coordX, y: coordY};
}

$(function (){
	$.getJSON("/stops/", function(data) {
		var paper = Raphael("canvas", imgWidth, imgHeight, function() {
			//var circle = this.circle(50, 40, 5);
			var obj = coord2px(48.40783887047417, 9.987516403198242);
			var circle = this.circle(obj.x, obj.y, 5);
			circle.attr("fill", "#f00");
			circle.attr("stroke", "#fff");

			console.log(obj);
		});
	});
});
