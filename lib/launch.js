var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();
var phrase = require('./phrase');

router.route('/phrase/:curr/:strict')
	.get(function(req, res) {
		var params = req.params;
		//console.log(params.curr, params.strict);
		res.json(phrase.query(params.curr, params.strict));
	});


app.use('/api', router);

app.use(express.static('dist'));

app.use('/', function(req, res) {
	//console.log('in root');
	res.send('<a href="/">index</a>');
});

app.listen(port, function() {
	console.log('listening on ' + port);
});