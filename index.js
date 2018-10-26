'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 5000, ()=> {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {

  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    let aiText = text;

    // if(aiText.includes("weather")){
    //   var data = ""
    //   socket.emit('bot reply', data)
    // }

    // else{
    // }

    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./MLmodel.py", aiText] );
    process.stdout.on('data', function(data) {
        console.log('Bot reply: ' + data);
        socket.emit('bot reply', data.toString());
    });

    });
    
});
