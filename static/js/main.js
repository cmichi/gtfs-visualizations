var imgWidth = 800;
var imgHeight = 800;

function coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	var coord2px_factor = 3400;

	return {
		  x: center_px.x + ((lat - center_coord.lat) * coord2px_factor)
		, y: center_px.y + ((lng - center_coord.lng) * coord2px_factor)
	};
}

var stops = []
$(function (){
	$.getJSON("/stops/", function(data) {
		var paper = Raphael("canvas", imgWidth, imgHeight, function() {
			/* // draw center
			var obj = coord2px(48.40783887047417, 9.987516403198242);
			var circle = this.circle(obj.x, obj.y, 5);
			circle.attr("fill", "#f00");
			circle.attr("stroke", "#fff");
			console.log(obj);
			*/

			var j = 0;
			for (var i in data) {
				var stop = data[i];
				var obj = coord2px(stop.stop_lat, stop.stop_lon);
				var circle = this.circle(obj.x, obj.y, 3);
				circle.attr("fill", "#f00");
				console.log(obj)
				//circle.attr("stroke", "#fff");
				//if (j === 5) break;
				++j;
			}
		});
	});
});
