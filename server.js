'use strict'
let express    = require('express');
let app        = express();
let router= express.Router();
let route = require('./routes/route');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;
app.use('/',route);
app.listen(port);
console.log('server listening on port ' + port);
