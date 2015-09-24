var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var _ = require('underscore');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});