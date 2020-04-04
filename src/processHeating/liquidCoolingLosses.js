var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateLiquidCoolingLosses =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/liquidCoolingLossesInput.json"));

	var liquidCoolingLosses = {
	flowRate: parseFloat(req.query.flowRate),
	density: parseFloat(req.query.density),
	initialTemperature: parseFloat(req.query.initialTemperature),
	outletTemperature: parseFloat(req.query.outletTemperature),
	specificHeat: parseFloat(req.query.specificHeat),
	correctionFactor: parseFloat(req.query.correctionFactor)
	};
	
	var value = v.validate(liquidCoolingLosses, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var LCL = phast.liquidCoolingLosses(liquidCoolingLosses);
	res.json([LCL]);
}

