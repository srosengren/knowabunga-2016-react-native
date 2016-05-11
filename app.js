// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var wsServer = require('websocket').server;
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var socket = new server({
    httpServer: server
});

socket.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
        connection.sendUTF(message);
    });

    connection.on('close', function(connection) {
        console.log('connection closed');
    });
});