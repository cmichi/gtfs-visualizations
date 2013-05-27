var path = require('path');
var Gtfs = require(path.join(__dirname, "..", "parser", "loader"));

dir = "../gtfs/ulm/";
var gtfs = Gtfs(dir, function(data) {
	console.log(data);
	console.log(data.getStops());
	//console.log(data.getShapes());
});
