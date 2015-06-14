var express = require('express');
var app = express();
app.use('/', express.static('./public/views')).listen(8080);
console.log("listening 8080");