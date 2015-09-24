var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


app.get('/', function(req, res){
	console.log('hey')
	res.render('index',{name:'index'});
});

app.get('/therapists', function(req,res){
	console.log('return therapists');
	res.send(JSON.parse(fs.readFileSync('therapists.json', 'utf8')));
});

app.post('/therapist', function(req, res){

	var body = _.defaults(req.body,{
		name:'',
		sex:'female',
		time:[],
		pressure:[],
		type:[],
		area:[],
		gender:[]
	});

	var therapists = JSON.parse(fs.readFileSync('therapists.json', 'utf8'));
	therapists.push(body);

	fs.writeFileSync('therapists.json',JSON.stringify(therapists));
	

	res.sendStatus(200);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});