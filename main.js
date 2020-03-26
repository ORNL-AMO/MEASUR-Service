const https = require('https');
const fs = require('fs');
const options ={
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};
var express = require('express');

var app = express();
var port = process.env.port || 8080;
var psat = require("./node_modules/amo-tools-suite/build/Release/psat.node");

var pumpheadtool = require('./src/pump/pumpheadtool.js');
var pump = require('./src/pump/pump.js');
var pumpachievableefficiency = require("./src/pump/pumpachievableefficiency.js");
var fan = require("./src/fan/fan.js");
var router = express.Router();

var motor = require('./src/motor/motorPerformance.js');
var motorNEMA = require('./src/motor/motorNEMA.js')
var motorEstFLA = require('./src/motor/motorEstFLA.js');


router.get('/motor/motorEstFLA', function(req, res)
{
	motorEstFLA.CalculateMotorEstFLA(req, res);
});




router.get('/motor/motorNEMA', function(req, res)
{
	motorNEMA.CalculateMotorNEMA(req, res);
});




router.get('/motor/motorPerformance', function(req, res)
{
	motor.CalculateMotorPerformance(req, res);
});


router.get('/pumpheadtool/suctionGaugeElevation', function(req, res)
{
	pumpheadtool.CalculateSuctionGaugeElevation(req, res);
});

router.get('/pumpachievableefficiency/pumpefficiency',function(req,res)
{
    pumpachievableefficiency.CalculatePumpEfficiency(req,res);
});

router.get('/pumpheadtool/suctionTankElevation', function(req, res)
{
	pumpheadtool.CalculateSuctionTankElevation(req, res);
});

router.get('/pump/assessment', function(req, res)
{
	pump.CalculateCurrentPumpEfficiency(req, res);
});

router.get('/pump/modifiedAssessment', function(req, res)
{
	pump.CalculateModifiedPumpEfficiency(req, res);
});

router.get('/fan/assessment',function(req,res)
{
	fan.CalculateFanExisting(req,res);
});

router.get('/fan/modifiedAssessment',function(req,res)
{
	fan.CalculateFanModified(req,res);
});

https.createServer(options, app).listen(port);
app.use('/', router);
console.log("Listening on port number: " + port +"!");
