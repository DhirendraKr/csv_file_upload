const express = require("express");
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();


app.get("/", function (req, res) {
    res.send("This is Home Page");
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));

app.use('/', require('./routes'));

let port = process.env.SERVER_PORT || 4300;
app.listen(port);
console.log('Magic happens on port http://127.0.0.1:' + port)
