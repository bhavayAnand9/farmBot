'use strict';

require('dotenv').config()

//uncomment when using dialogflow google api
// const APIAI_TOKEN = '7fddf38f32a249b38e93b3c9c35a8aa0';
// const APIAI_SESSION_ID = 'farmer-assistant';

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

//uncomment it when pushing to heroku cloud
// const server = app.listen(process.env.PORT || 5000, () => {

const server = app.listen(process.env.PORT || 5000, ()=> {
  console.log('Server setting up....');
  console.log('fetching environment variables...');

  setTimeout(() => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
  }, 3000)
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

// const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {

  socket.on('your query', (text) => {
    console.log('Message: ' + text);

      // Get a reply from API.ai

      // let apiaiReq = apiai.textRequest(text, {
      //   sessionId: APIAI_SESSION_ID
      // });

      // apiaiReq.on('response', (response) => {
      //   let aiText = response.result.fulfillment.speech;
      //   console.log('Bot reply: ' + aiText);
      //   socket.emit('bot reply', aiText);
      // });


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


    // apiaiReq.on('error', (error) => {
    //   console.log(error);
    // });

    // apiaiReq.end();

  // });
});
