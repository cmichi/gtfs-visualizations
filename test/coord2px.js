var render_area = {width: 800, height: 800};
var center = {lat: 48.40783887047417, lng: 9.987516403198242}

function coord2px(lat, lng) {
	console.log(bbox.width_f * (lng - bbox.left)) 
	var coordX = (bbox.width_f * (lng - bbox.left))// + bbox.shift_x;
	var coordY = (bbox.height_f * (bbox.top - lat))// + bbox.shift_y;
	//coordY *= -1; /* coordinate system */

	var obj = {x: coordX, y: coordY};

	obj.x += 55;
	obj.y += 55;
	//console.log(lat, lng)
	console.log(obj)
	return obj;
}

var bbox;
function createBBox(coords) {
	bbox = {
		left: center.lat
		, right: center.lat
		, top: center.lng
		, bottom: center.lng
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

	bbox.width_f += 350;
	bbox.height_f += 350;

	/* how much do we need to shift for the points to be in the visible area? */
	console.log("top_left")
	var top_left = coord2px(bbox.left, bbox.top);
	if (top_left.x < 0)
		// so much, that the outermost point is on 0
		bbox.shift_x = -1 * top_left.x;
	else if (top_left.x > render_area.width)
		bbox.shift_x = -1 * top_left.x// + (1*render_area.width);

	if (top_left.y < 0)
		bbox.shift_y = -1 * top_left.y;
	else if (top_left.y > render_area.height)
		bbox.shift_y = -1 * top_left.y// + (1*render_area.height);

	var top_left = coord2px(bbox.left, bbox.top);
	console.log(bbox);
	console.log(JSON.stringify(bbox));
	console.log(JSON.stringify(top_left))
	console.log("")
	return bbox;
}

	var coords = [
		  [center.lat, center.lng]
		, [48.423533,9.955459]
		, [48.383447, 10.006399] /* dietrich */
		, [48.419233, 9.90675] /* blaustein */
		, [48.321104, 9.890442] /* erbach */
		, [48.437857, 10.093002] /* elchingen */
	];
$(function() {

	var ra = 4;
	var paper = Raphael("canvas", 1200, 900)
	createBBox(coords);

	console.log("center:")

	for (var i in coords) {
		var pt = coord2px(coords[i][0], coords[i][1]);
		var circle = paper.circle(pt.x, pt.y, ra);
		circle.attr("fill", "#0f0");
	}
});


