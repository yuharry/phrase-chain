var express = require('express');
var app = express();
app.get('/', function(req, res) {
    console.log('f');
  res.send('hello!');
});
module.exports = app;