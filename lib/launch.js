var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();
var phrase = require('./lib/phrase');
router.route('/phrase/:curr/:strict')
    .get(function(req, res) {
        var params = req.params;

        console.log(params.curr, params.strict);
        res.json({good: phrase.query(params.curr, params.strict)});
        
    });

//app.use(express.static(__dirname + '/dist'));
app.use('/api', router);

app.use('/', function(req, res) {
    console.log('in root');
    res.send('hello!');
});



app.listen(port, function() {
    console.log('listening on ' + port);
});