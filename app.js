// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var wsServer = require('websocket').server;
var uuid = require('node-uuid');
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var socket = new wsServer({
    httpServer: server
});

var connections = {};

socket.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.id = uuid.v4();
    connections[connection.id] = connection;

    connection.on('message', function(message) {
        Object.keys(connections)
            .map(k => connections[k])
            .forEach(c => c.sendUTF(JSON.stringify(message.utf8Data)));
    });

    connection.on('close', function(connection) {
        delete connections[connection.id];
    });
});