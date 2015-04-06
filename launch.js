var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/dist'));
app.use('/', function(req, res) {
    console.log('f');
  res.send('hello!');
});
app.listen(port, function() {
    console.log('listening on ' + port);
});