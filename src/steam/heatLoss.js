var ssmt = require("../../node_modules/amo-tools-suite/build/Release/ssmt.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/steam';
var Validator = require('jsonschema').Validator;

exports.CalculateHeatLoss =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/heatLossInput.json"));

	var heatLoss = {
	inletPressure: parseFloat(req.query.intletPressure),
	quantityValue: parseFloat(req.query.quantityValue),
	inletMassFlow: parseFloat(req.query.inletMassFlow),
	percentHeatLoss: parseFloat(req.query.powerFactor)
	};
	
	var value = v.validate(heatLoss, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var heat = ssmt.heatLoss(heatLoss);
	res.json([heat]);
}

