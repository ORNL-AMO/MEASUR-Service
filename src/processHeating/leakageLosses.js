var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateLeakageLosses =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/leakageLossesInput.json"));

	var leakageLosses = {
	draftPressure: parseFloat(req.query.draftPressure),
	openingArea: parseFloat(req.query.openingArea),
	leakageGasTemperature: parseFloat(req.query.leakageGasTemperature),
	ambientTemperature: parseFloat(req.query.ambientTemperature),
	coefficient: parseFloat(req.query.coefficient),
	specificGravity: parseFloat(req.query.specificGravity),
	correctionFactor: parseFloat(req.query.correctionFactor)
	};
	
	var value = v.validate(leakageLosses, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var LL = phast.leakageLosses(leakageLosses);
	res.json([LL]);
}

