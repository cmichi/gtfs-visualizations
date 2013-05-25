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

function coord2px(lat, lon) {
	/*
		48.42677
	9.94224		 9.96477
		48.41809
	*/
	var bbLeft = 9.94224;
	var bbRight = 9.96477;
	var bbTop = 48.42677;
	var bbBottom = 48.41809;

	var bbHeight = bbTop - bbBottom;
	var bbWidth = bbRight - bbLeft;

	var imgWidth = 3074;
	var imgHeight = 1782;

	var shiftX = -1537;
	var shiftY = -891;

	var coordX = ((imgWidth / bbWidth) * (lon - bbLeft)) + shiftX;
	var coordY = ((imgHeight / bbHeight) * (bbTop - lat)) + shiftY;
	coordY *= -1;

	return {x: coordX, y: coordY};
}


var paper = Raphael("canvas", 600, 600, function() {
	var circle = this.circle(50, 40, 10);
	circle.attr("fill", "#f00");
	circle.attr("stroke", "#fff");


});

