var express = require('express');
var http = require('http');

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var server = require('http').createServer(app);
server.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + server.address().port);
});

