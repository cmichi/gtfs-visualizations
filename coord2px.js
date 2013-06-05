var imgWidth = 100000;
var imgHeight = 100000;

function coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	var coord2px_factor = 1000;

	var offsetX = 0;
	var offsetY = 0;

	var _lat = (lat)*1
	var _lng = (lng)*1

		  //y: imgHeight - (center_px.x + ((center_coord.lat - _lat) * coord2px_factor) + offsetX)
		//, x: (center_px.y + ((center_coord.lng - _lng) * coord2px_factor) + offsetY)

	var obj = {
		x: (_lng*imgWidth) / 360
		, y: (_lat*imgHeight) / 180
	}


	obj.x *= 1.0;
	obj.y *= 1.0;

	obj.x -= 2000;
	obj.y -= 26600;
	//obj.y = 500 - obj.y;
	obj.y = 500 - obj.y;

	var f = 5.0
	obj.x *= f
	obj.y *= f
	obj.x -= 3600;
	obj.y -= 900;
	//var calculatedHeight=((lat*containerHeight)/180);
	//return $(elem).offset().top+($(elem).height()-calculatedHeight);
	console.log(obj)
	return obj;
}


$(function() {
	var ra = 4;
	var paper = Raphael("canvas", 1200, 900)
	var center = coord2px(48.40783887047417, 9.987516403198242) 
	var circle = paper.circle(center.x, center.y, ra);
	circle.attr("fill", "#f00");

	// uni
	center = coord2px(48.423533,9.955459) 
	var circle = paper.circle(center.x, center.y, ra);
	circle.attr("fill", "#0f0");

	// dietrich
	center = coord2px(48.383447,10.006399) 
	var circle = paper.circle(center.x, center.y, ra);
	circle.attr("fill", "#00f");

	// blaustein
	center = coord2px(48.419233,9.90675) 
	var circle = paper.circle(center.x, center.y, ra);
	circle.attr("fill", "#00f");

	// erbach
	center = coord2px(48.321104,9.890442);
	var circle = paper.circle(center.x, center.y, ra);
	circle.attr("fill", "#0ff");

	// elchingen
	center = coord2px(48.437857,10.093002);
	var circle = paper.circle(center.x, center.y, ra);
	circle.attr("fill", "#ff0");

});

