var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('choose-room', (data) => {
    var roomNumber = data.room;
    socket.join(roomNumber, () => {
        let rooms = Object.keys(socket.rooms);
        console.log(rooms); // [ <socket.id>, 'room 237' ]
        io.to(roomNumber).emit('chat message', { msg: 'a new user has joined the room', person: 'BOT' } );
    });
  });

  socket.on('chat message', function(msg, person, room){
    console.log('chat from: '  + person + ': ' + msg);
    io.to(room).emit('chat message', { msg, person });
  });

    socket.on('disconnecting', (reason) => {
        let rooms = Object.keys(socket.rooms);
        io.to(rooms[0]).emit('chat message', { msg: reason, person: 'Person leaving'})
    });

    socket.on('ping', () =>  {
        console.log('ping');
    });

    socket.on('pong', () =>  {
        console.log('pong');
    });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
