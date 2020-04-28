var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateWaterCoolingLosses =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/waterCoolingLossesInput.json"));

	var waterCoolingLosses = {
	flowRate: parseFloat(req.query.flowRate),
	density: parseFloat(req.query.density),
	outletTemperature: parseFloat(req.query.outletTemperature),
	correctionFactor: parseFloat(req.query.correctionFactor),
	};
	
	var value = v.validate(waterCoolingLosses, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var WCL = phast.liquidCoolingLosses(waterCoolingLosses);
	res.json([WCL]);
}

