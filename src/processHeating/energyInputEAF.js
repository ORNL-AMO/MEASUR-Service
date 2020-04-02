var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');

var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;
var fs = require('fs');

exports.CalculateEnergyInputEAF =function(req, res)
{

	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/energyInputEAFInput.json"));

	var EnergyInputEAF = {
	naturalGasHeatInput: parseInt(req.query.naturalGasHeatInput),
	coalCarbonInjection: parseFloat(req.query.coalCarbonInjection),
	coalHeatingValue: parseFloat(req.query.coalHeatingValue),
	electrodeUsed: parseFloat(req.query.electrodeUsed),
	electrodeHeatingValue: parseInt(req.query.electrodeHeatingValue),
	otherFuels: parseFloat(req.query.otherFuels),
	electricityInput: parseFloat(req.query.electricityInput)
	};
	var value = v.validate(EnergyInputEAF, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var energyIn=phast.EnergyInputEAF(EnergyInputEAF);
	res.json([energyIn]);
	
}
