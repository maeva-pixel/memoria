var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('username', function(username) {
    socket.username = username;
    io.emit('is_online', socket.username + ' connected');
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('is_online', socket.username + ' disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.broadcast.emit('chat message', socket.username + ': ' + msg);
  });
  socket.on("typing", function(data) {
	  socket.broadcast.emit('typing', data + ' is typing');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
