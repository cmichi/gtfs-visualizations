var path = require('path');
var csv = require("./csv-loader.js");

csv.load(path.join(__dirname, "..", "..", "gtfs","ulm","stops.txt"), function(data) {
	console.log(data);	
	console.log(JSON.stringify(data));
});
