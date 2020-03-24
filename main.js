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
var phast = require("./node_modules/amo-tools-suite/build/Release/phast.node");
var pumpheadtool = require('./src/pump/pumpheadtool.js');
var pump = require('./src/pump/pump.js');
var pumpachievableefficiency = require("./src/pump/pumpachievableefficiency.js");
var energyElectric = require('./src/processHeating/energyEquivalencyElectric.js');
var humidityRatio = require('./src/processHeating/humidityRatio.js');
var efficiencyImprovement = require('./src/processHeating/efficiencyImprovement.js');
var router = express.Router();


router.get('/processHeating/efficiencyImprovement', function(req, res)
{
	efficiencyImprovement.CalculateEfficiencyImprovement(req, res);
});

router.get('/humidityRatio/humidityRatio', function(req, res)
{
	humidityRatio.CalculateHumidityRatio(req, res);
});


router.get('/energyEquivalencyElectric/energyEquivalencyElectric', function(req, res)
{
	energyElectric.CalculateEnergyEquivalencyElectric(req, res);
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

https.createServer(options, app).listen(port);
app.use('/', router);
console.log("Listening on port number: " + port +"!");
