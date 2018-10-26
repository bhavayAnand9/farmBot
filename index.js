'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

//setting up google cloud
const {Translate} = require('@google-cloud/translate');
const projectId = 'skilled-index-220520';
const translate = new Translate({
  projectId: projectId,
});
const target = 'en';

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

  socket.on('chat message', (aiText) => {
    
    console.log('Message/aiText: ' + aiText);

    // if(aiText.includes("weather")){
    //   var data = ""
    //   socket.emit('bot reply', data)
    // } else{
    // }

    translate
      .translate(aiText, target)
      .then(results => {
        const translation = results[0];

        console.log(`Text: ${aiText}`);
        console.log(`Translation: ${translation}`);

        //spawn a new python process parallely
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./MLmodel.py", translation] );

        //data came back from python nlp model
        process.stdout.on('data', function(data) {
            console.log('Bot reply/return from python: ' + data);
            // socket.emit('bot reply', data.toString());
            const revTarget = 'hi';
            translate
              .translate(data.toString(), revTarget)
              .then(outcome => {
                const hindiTranslation = outcome[0];

                console.log(`data.toString() : ${data.toString()}`);
                console.log(`hindi Translation of bot reply: ${hindiTranslation}`);
                socket.emit('bot reply', hindiTranslation);
              })
              .catch(err => {
                console.error('ERROR:', err);
              });
              
        });

      })
      .catch(err => {
        console.error('ERROR:', err);
      });

  });

});
