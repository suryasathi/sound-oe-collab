
var express = require('express');

var app = express();
const port = process.env.PORT || 8000;
var server = app.listen(port, () =>{
	console.log('Starting server at {port}');
});
app.use(express.static('public'));

console.log ("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on ('connection' , newConnection);

function newConnection (socket){
	console.log('new connection: ' + socket.id); 

	socket.on ('mouse', mouseMsg);

	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
		console.log(data);

	}

	/*socket.on ('mouse1', mouseMessage);

	function mouseMessage(data1){
		console.log(data1);
	}*/
}