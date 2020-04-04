var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateWaterCoolingLosses =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/waterCoolingLossesInput.json"));

	var liquidCoolingLosses = {
	flowRate: parseFloat(req.query.motorPhase),
	density: parseFloat(req.query.supplyVoltage),
	outletTemperature: parseFloat(req.query.avgCurrent),
	correctionFactor: parseFloat(req.query.powerFactor),
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

