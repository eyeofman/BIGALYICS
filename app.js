/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// CHANGE THESE CONFIGURATIONS to match your CMX configuration
var port = process.env.OVERRIDE_PORT || process.env.PORT || 1890;
var secret = process.env.SECRET || "secret";
var validator = process.env.VALIDATOR || "	8d6ab9ee3aeb9837734691c02a504c127a7396fd";
var route = process.env.ROUTE || "/cmx";

// All CMX JSON data will end up here. Send it to a database or whatever you fancy.
// data format specifications: https://documentation.meraki.com/MR/Monitoring_and_Reporting/CMX_Analytics#Version_2.0
function cmxData(data) {
    console.log("JSON Feed: " + JSON.stringify(data, null, 2));
};


//**********************************************************

// Express Server 
app.use(bodyParser.json())

// CMX Location Protocol, see https://documentation.meraki.com/MR/Monitoring_and_Reporting/CMX_Analytics#API_Configuration
//
// Meraki asks for us to know the secret
app.get(route, function (req, res) {
    console.log("Validator = " + validator);
    res.status(200).send(validator);
});
//
// Getting the flow of data every 1 to 2 minutes
app.post(route, function (req, res) {
    if (req.body.secret == secret) {
        console.log("Secret verified");
        cmxData(req.body);
    } else {
        console.log("Secret was invalid");
    }
    res.status(200);
});

// Start server
app.listen(port, function () {
    console.log("CMX Receiver listening on port: " + port);
});
