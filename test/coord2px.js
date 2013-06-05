var imgWidth = 100000;
var imgHeight = 100000;

function _coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	var coord2px_factor = 1000;

	var offsetX = 0;
	var offsetY = 0;

	lat = new Number(lat)
	lng = new Number(lng)

	var obj = {
		x: (lng * imgWidth) / 360
		, y: (lat * imgHeight) / 180
	}

	/* shift so that coords are in place */
	obj.x -= 2000;
	obj.y -= 26600;

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


function coord2px(lat, lon, bbox) {
	var bbHeight = bbox.top - bbox.bottom;
	var bbWidth = bbox.right - bbox.left;

	var shiftX = -1537;
	var shiftY = -891;

	shiftX = 0;
	shiftY = 0;

	var coordX = ((render_area.width / bbWidth) * (lon - bbox.left)) + shiftX;
	var coordY = ((render_area.height / bbHeight) * (bbox.top - lat)) + shiftY;
	coordY *= -1;

	var obj = {x: coordX, y: coordY};
	console.log(obj)
	return obj;
}


var render_area = {width: 800, height: 800};
var center = {lat: 48.40783887047417, lng: 9.987516403198242}
$(function() {
	var ra = 4;
	var paper = Raphael("canvas", 1200, 900)
	var bbox = createBBox(coords);

	var cntr = coord2px(center.lat, center.lng, bbox);
	var circle = paper.circle(cntr.x, cntr.y, ra);
	circle.attr("fill", "#f00");

	var coords = [
		[48.423533,9.955459]
		, [48.383447, 10.006399] /* dietrich */
		, [48.419233, 9.90675] /* blaustein */
		, [48.321104, 9.890442] /* erbach */
		, [48.437857, 10.093002] /* elchingen */
	];

	for (var i in coords) {
		var pt = coord2px(coords[i][0], coords[i][1], bbox);
		var circle = paper.circle(pt.x, pt.y, ra);
		circle.attr("fill", "#0f0");
	}
});


function createBBox(coords) {
	var bbox = {
		left: center.lat
		, right: center.lat
		, top: center.lng
		, bottom: center.lng
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

	console.log(bbox);
	return bbox;
}
