var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var Promise = require("bluebird");
var _ = require('lodash');
var rp = require('request-promise');
var fs = require('fs');
var jsonfile = require('jsonfile');
var morgan = require('morgan');

var client_id = '9e7aae0e58094ed4bba106c1ca37ee6c'; // Your client id
var client_secret = '724bbab1fc9748799ed69c50dc20dcee';

var swig = require('swig');
var bodyParser = require('body-parser');
// var socketio = require('socket.io');

var app = express(); 
var server = app.listen(3001);

app.use(morgan('combined'))
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({ cache: false });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public',express.static('public'));

app.get('/', function (req, res, next) {
	// // body...
	res.render('index')
});

app.post('/search', function(req, res, next){
	var firstName = req.body.artist.split(" ")[0]
	var lastName = req.body.artist.split(" ")[1]
	var artist;
	rp('https://api.spotify.com/v1/search?q=' + firstName + '%20' + lastName + '&type=artist')
		.then(function(searchResult){
			var result = JSON.parse(searchResult);
			// res.json(result)
			artist = result.artists.items[0];
			var data = { "Artist": artist.name, "Popularity": artist.popularity };
			jsonfile.writeFileSync('./public/artist.txt', data)
			// res.render('artist', {
			// 	artist: artist
			// })
		})
		.then(function(){
			//  https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/top-tracks?country=SE"
			return rp('https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks?country=SE')
		})
		.then(function(tracks){
			tracks = JSON.parse(tracks);
			// res.json(tracks)
			// data = [{ "Artist": artist.name, "Popularity": artist.popularity }];
			jsonfile.writeFile('./public/tracks.txt', tracks.tracks)
			res.render('artist', {
				artist: artist
			})
		})
		.catch()
})