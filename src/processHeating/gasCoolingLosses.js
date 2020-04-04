var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateGasCoolingLosses =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/gasCoolingLossesInput.json"));

	var gasCoolingLosses = {
	flowRate: parseFloat(req.query.flowRate),
	initialTemperature: parseFloat(req.query.initialTemperature),
	finalTemperature: parseFloat(req.query.finalTemperature),
	specificHeat: parseFloat(req.query.specificHeat),
	correctionFactor: parseFloat(req.query.correctionFactor),
	gasDensity: parseFloat(req.query.gasDensity)
	};
	
	var value = v.validate(gasCoolingLosses, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var GCL = phast.gasCoolingLosses(gasCoolingLosses);
	res.json([GCL]);
}

