'use strict';

require('dotenv').config()

const express = require('express');
const app = express();

// const request = require('request');

var request = require('sync-request');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 5000, ()=> {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

var myAPIKey = 'AIzaSyCY0W-YjzXayUR5ijfhiz5Q_IoKp5EH7Uk';

// function translateUsingGoogleCloud(target, text){
//   var url = "https://translation.googleapis.com/language/translate/v2?q=" + text + "&target=" + target + "&key=" + myAPIKey;
//   console.log(`url : ${url}`);

//   // request.post(url, function(error, response, body){
//   //     if(!error && response.statusCode == 200) {
//   //         var data = JSON.parse(body)
//   //         console.log(data.data.translations[0]);
//   //         return data.data.translations[0].translatedText;
//   //     }
//   // });

//   var dataFromGoogleTranslateAPI = request('POST', url);
//   console.log(dataFromGoogleTranslateAPI);
// }

io.on('connection', function(socket) {

  socket.on('chat message', (aiText) => {
    
    console.log('Message/aiText in hindi: ' + aiText);

    // if(aiText.includes("weather")){
    //   var data = ""
    //   socket.emit('bot reply', data)
    // } else{
    // }

    // var aiTextToEnglish = translateUsingGoogleCloud('en', aiText);

    var url = "https://translation.googleapis.com/language/translate/v2?q=" + aiText + "&target=en" + "&key=" + myAPIKey;
    var dataFromGoogleTranslateAPI = request('POST', encodeURI(url));
    console.log(JSON.parse(dataFromGoogleTranslateAPI.getBody('utf-8')).data.translations[0].translatedText);

    var aiTextToEnglish = JSON.parse(dataFromGoogleTranslateAPI.getBody('utf-8')).data.translations[0].translatedText;
    console.log('aiText translated from hindi to english : ' + aiTextToEnglish);

    //spawn a new python process parallely
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./MLmodel.py", aiTextToEnglish] );

    //data came back from python nlp model
    process.stdout.on('data', function(data) {
      console.log('Bot reply/return from python in english: ' + data.toString());
      // socket.emit('bot reply', data.toString());
      // var botReplyInHindi = translateUsingGoogleCloud('hi', data.toString())
      var url2 = "https://translation.googleapis.com/language/translate/v2?q=" + data + "&target=hi" + "&key=" + myAPIKey;

      var botReplyInHindi = request('POST', encodeURI(url2));
      console.log(`botReplyInHindi : ${JSON.parse(botReplyInHindi.getBody('utf-8')).data.translations[0].translatedText}`)
      socket.emit('bot reply', botReplyInHindi);
    });

  });

});
