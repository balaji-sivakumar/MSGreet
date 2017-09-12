var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
var MICROSOFT_APP_ID = "7395cd9c-5fa3-4a78-ad7a-7989231387a1";
var MICROSOFT_APP_PASSWORD = "nYU54bqyjX2BgCEuacbXEAq";
var LUIS_MODEL_URL="https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/23ecec6e-1bd1-4433-bdd8-a62fadc2d32f?subscription-key=fbd6c82bc4f149eeba4a1ae5d5ffde60&timezoneOffset=0&verbose=true";

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: MICROSOFT_APP_ID,
    appPassword: MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});
var recognizer = new builder.LuisRecognizer(LUIS_MODEL_URL);
bot.recognizer(recognizer);
bot.dialog('Greeting', function (session, args, next) {
	session.send('welcome to the hotel finder ');

	var greetWord = builder.EntityRecognizer.findEntity(args.intent.entities, 'Greet');
	
	var name = builder.EntityRecognizer.findEntity(args.intent.entities, 'Name');
	session.send('greeting entity  %s ,%s:', greetWord.entity,name.entity);
}).triggerAction({
	matches: 'Greeting'
});
