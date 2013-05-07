var http = require('http');
var io = require('socket.io');
var fs = require('fs');

var app = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-type': 'text/html'});
  res.end(fs.readFileSync('./index.html'));
});
app.listen(8081);
console.log('Server running at http://127.0.0.1:8081/');

// Socket.IO server
var io = io.listen(app);
var users = [];

io.sockets.on('connection', function (socket) {
	socket.on('alarm', function (msg) {
		socket.broadcast.emit('alarm', {prio: msg.prio, message: msg.message});
		console.log(socket.id + ': ' + msg.prio + ' - ' + msg.message);
	});
	
	socket.on('current location', function (msg) {
		socket.broadcast.emit('current location', {lat: msg.lat, lng: msg.lng});
		console.log(socket.id + 'current location ' + msg.lat + ',' + msg.lng);
	});

	socket.on('disconnect', function () {
		socket.broadcast.emit('announcement', {user: socket.id, action: 'disconected'});
	});
});