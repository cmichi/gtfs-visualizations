var express = require('express');
var http = require('http');
//var parser = require('parser');
var path = require('path');
var Gtfs = require(path.join(__dirname, ".", "parser", "loader"));

var dir = "./gtfs/ulm/";
var stops;
var shapes;
var gtfs = Gtfs(dir, function(data) {
	console.log(data);
	//console.log(data.getStops());
	//console.log(data.getShapes());
	stops = data.getStops();
	shapes = data.getShapes();

	server.listen(process.env.PORT || 3000, function() {
		console.log('Listening on port ' + server.address().port);
	});
});

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var server = require('http').createServer(app);



app.get('/stops/', function(req, res){
	console.log(stops);
	res.send(stops);
	//res.send("foo\n");
});

app.get('/shapes/', function(req, res){
	res.send(shapes);
});


