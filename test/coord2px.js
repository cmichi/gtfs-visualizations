var render_area = {width: 800, height: 800};
var center = {lat: 48.40783887047417, lng: 9.987516403198242}

function coord2px(lat, lng, bbox) {
	console.log(bbox.width_f * (lng - bbox.left)) 
	var coordX = (bbox.width_f * (lng - bbox.left)) + bbox.shift_x;
	var coordY = (bbox.height_f * (bbox.top - lat)) + bbox.shift_y;
	coordY *= -1; /* coordinate system */

	var obj = {x: coordX, y: coordY};
	//console.log(lat, lng)
	console.log(obj)
	return obj;
}

function createBBox(coords) {
	var bbox = {
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
		if (coords[i][0] < bbox.left)
			bbox.left = coords[i][0];

		if (coords[i][0] > bbox.right)
			bbox.right = coords[i][0];

		if (coords[i][1] > bbox.top)
			bbox.top = coords[i][1];

		if (coords[i][1] < bbox.bottom)
			bbox.bottom = coords[i][1];
	}

	bbox.height = bbox.top - bbox.bottom;
	bbox.width = bbox.right - bbox.left;
	bbox.width_f = render_area.width / bbox.width;
	bbox.height_f = render_area.height / bbox.height;

	/* how much do we need to shift for the points to be in the visible area? */
	var top_left = coord2px(bbox.left, bbox.top, bbox);
	console.log("top_left")
	console.log(JSON.stringify(top_left))
	if (top_left.x < 0)
		// so much, that the outermost point is on 0
		bbox.shift_x = -1 * top_left.x;
	else if (top_left.x > render_area.width)
		bbox.shift_x = -1 * top_left.x// + (1*render_area.width);

	if (top_left.y < 0)
		bbox.shift_y = -1 * top_left.y;
	else if (top_left.y > render_area.height)
		bbox.shift_y = 1 * top_left.y// + (1*render_area.height);

	var top_left = coord2px(bbox.left, bbox.top, bbox);
	console.log(bbox);
	console.log(JSON.stringify(bbox));
	console.log(JSON.stringify(top_left))
	console.log("")
	return bbox;
}

$(function() {
	var coords = [
		[48.423533,9.955459]
		, [48.383447, 10.006399] /* dietrich */
		, [48.419233, 9.90675] /* blaustein */
		, [48.321104, 9.890442] /* erbach */
		, [48.437857, 10.093002] /* elchingen */
	];

	var ra = 4;
	var paper = Raphael("canvas", 1200, 900)
	var bbox = createBBox(coords);

	var cntr = coord2px(center.lat, center.lng, bbox);
	var circle = paper.circle(cntr.x, cntr.y, ra);
	circle.attr("fill", "#f00");

	for (var i in coords) {
		var pt = coord2px(coords[i][0], coords[i][1], bbox);
		var circle = paper.circle(pt.x, pt.y, ra);
		circle.attr("fill", "#0f0");
	}
});


