var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var Promise = require("bluebird");
var _ = require('lodash');
var rp = require('request-promise');
var fs = require('fs');
var jsonfile = require('jsonfile');

var client_id = '9e7aae0e58094ed4bba106c1ca37ee6c'; // Your client id
var client_secret = '724bbab1fc9748799ed69c50dc20dcee';

var swig = require('swig');
var bodyParser = require('body-parser');
// var socketio = require('socket.io');

var app = express(); 
var server = app.listen(3001);

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({ cache: false });

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
	// // body...
	res.render('index')
});

app.post('/search', function(req, res, next){
	var firstName = req.body.artist.split(" ")[0]
	var lastName = req.body.artist.split(" ")[1]
	rp('https://api.spotify.com/v1/search?q=' + firstName + '%20' + lastName + '&type=artist')
		.then(function(searchResult){
			var result = JSON.parse(searchResult);
			var artist = result.artists.items[0];
			var data = { "Artist": artist.name, "Popularity": artist.popularity };
			jsonfile.writeFile('artist.json', data, function (err) {
			  console.error(err)
			})
			// fs.writeFileSync('artist.json', data);
			res.render('artist')
		})
		.catch()
})