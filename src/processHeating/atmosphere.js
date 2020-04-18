var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateAtmosphere =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/atmosphereInput.json"));

	var atmosphere = {
	inletTemperature: parseFloat(req.query.motorPhase),
	outletTemperature: parseFloat(req.query.supplyVoltage),
	flowRate: parseFloat(req.query.avgCurrent),
	correctionFactor: parseFloat(req.query.powerFactor),
	specificHeat: parseFloat(req.query.operatingTime),
	};
	
	var value = v.validate(atmosphere, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var atmo = phast.atmosphere(atmosphere);
	res.json([atmo]);
}

