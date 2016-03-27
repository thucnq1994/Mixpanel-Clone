var session				= require('express-session');
var express				= require('express');
var mongoose 			= require('mongoose');
global.app				= express();
var jwt 				= require('jwt-simple');
app.locals.jwt 			= jwt;
var server 				= require('http').Server(app);
var config				= require(__dirname + '/config/config');
app.config				= config;
var Database			= require(__dirname + '/config/database.js')(app, mongoose);
var moment				= require('moment');
app.locals.moment 		= moment;
var bodyParser			= require('body-parser');
var io 					= require('socket.io')(server);
app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');

//Middlewares
var mwSession			= require(__dirname + '/middlewares/session');
var mwJWTAuth			= require(__dirname + '/middlewares/jwtauth');

//Controllers
var cTrack				= require(__dirname + '/controllers/tracking.controller');
var cAuth				= require(__dirname + '/controllers/auth.controller');
var cProject			= require(__dirname + '/controllers/project.controller');
var cSurvey				= require(__dirname + '/controllers/survey.controller');
var cQuestion			= require(__dirname + '/controllers/question.controller');

// Autoload Models
global.Server			= { Model : {} };

require('fs').readdir(__dirname + '/models/', function(err, files) {
	files.forEach(function(file) {
		if (file.match(/\.js$/) !== null) {
			var name = file.replace('.js', '');
			global.Server.Model[name] = require(__dirname + '/models/' + file)(mongoose);
		}
	});
});

// App init
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(session({
	secret: '2359media',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  	extended: true
})); 

app.all('/api/*', [mwJWTAuth]);

app.get('/', mwSession.getSessionData, function(req, res){
	res.render('index', { data : req.currentData });
});

// Client
app.get('/demo', mwSession.getSessionData, function(req, res){
	res.render('demo', { data : req.currentData });
});

// Frontend
app.get('/login', mwSession.getSessionData, cAuth.login);
app.post('/login', cAuth.login_POST);
app.get('/logout', cAuth.logout);
app.get('/about', mwSession.getSessionData, function (req, res){
	res.render('about', { data : req.currentData });
});

// Engagement
app.get('/live', mwSession.getSessionData, cTrack.LIVE);
app.get('/new-project', mwSession.getSessionData, cProject.CREATE);
app.post('/new-project', mwSession.getSessionData, cProject.CREATE_POST);
app.get('/set-project/:id', mwSession.getSessionData, cProject.SET_Project);
app.post('/update-project', mwSession.getSessionData, cProject.UPDATE_Project);
app.get('/delete-project/:id', mwSession.getSessionData, cProject.DELETE_Project);

// People
app.get('/survey', mwSession.getSessionData, cSurvey.index);
app.get('/create-survey', mwSession.getSessionData, cSurvey.create_survey)
app.get('/update-survey/:id', mwSession.getSessionData, cSurvey.update_survey)
app.post('/create-survey', mwSession.getSessionData, cSurvey.create_survey_POST)
app.get('/delete-survey/:id', mwSession.getSessionData, cSurvey.delete_survey)

// Publisher
app.get('/api/publisher', cAuth.GET);
app.get('/api/publisher/:id', cAuth.GET);
app.post('/api/publisher', cAuth.POST);
app.put('/api/publisher/:id', cAuth.PUT);
app.delete('/api/publisher/:id', cAuth.DELETE);

// Project
app.get('/project', cProject.GET);
app.get('/project/:id', cProject.GET);
app.post('/project', cProject.POST);
app.put('/project/:id', cProject.PUT);
app.delete('/project/:id', cProject.DELETE);

// Survey
app.get('/api/survey', cSurvey.GET);
app.get('/api/survey/:id', cSurvey.GET);
app.post('/api/survey', mwSession.getSessionData, cSurvey.POST);
app.put('/api/survey/:id', cSurvey.PUT);
app.delete('/api/survey/:id', cSurvey.DELETE);

// Question
app.get('/api/question', cQuestion.GET);
app.get('/api/question/:id', cQuestion.GET);
app.post('/api/question', mwSession.getSessionData, cQuestion.POST);
app.put('/api/question/:id', cQuestion.PUT);
app.delete('/api/question/:id', cQuestion.DELETE);

// Tracking System
app.get('/tracking', cTrack.GET);
app.get('/track/:id', cTrack.RECORD);
app.get('/tracking/:id', cTrack.GET);
app.post('/tracking', cTrack.POST);

app.get('/test', mwSession.getSessionData,function (req, res){
	/*
	var crypto = require('crypto')
	  , key = 'salt_from_the_user_document'
	  , plaintext = 'password'
	  , cipher = crypto.createCipher('aes-256-cbc', key)
	  , decipher = crypto.createDecipher('aes-256-cbc', key);
	  
	cipher.update(plaintext, 'utf8', 'base64');
	var encryptedPassword = cipher.final('base64')

	decipher.update(encryptedPassword, 'base64', 'utf8');
	var decryptedPassword = decipher.final('utf8');

	console.log('encrypted :', encryptedPassword);
	console.log('decrypted :', decryptedPassword);
	*/

	/*
	var password = require('crypto')
                      .createHmac('sha256', 'a secret')
                      .update(req.body.password)
                      .digest('base64');
                      */


  	
});

io.on('connection', function(socket){
  	console.log('a user connected');
  	
	socket.on('track', function () {
		console.log('added new one, please refresh!');
		io.emit('track');
	});
	
});

module.exports.listen = server.listen(app.config.server.port, function(){
	var host = this.address().address;
	console.log('✔ App is listening at http://%s:%s', host, this.address().port);
});
module.exports.port = app.config.server.port;
module.exports = app;