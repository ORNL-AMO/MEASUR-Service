var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateAuxiliaryPowerLoss =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/auxiliaryPowerLossInput.json"));

	var auxiliaryPowerLoss = {
	motorPhase: parseFloat(req.query.motorPhase),
	supplyVoltage: parseFloat(req.query.supplyVoltage),
	avgCurrent: parseFloat(req.query.avgCurrent),
	powerFactor: parseFloat(req.query.powerFactor),
	operatingTime: parseFloat(req.query.operatingTime),
	};
	
	var value = v.validate(auxiliaryPowerLoss, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var auxPower = phast.auxiliaryPowerLoss(auxiliaryPowerLoss);
	res.json([auxPower]);
}

