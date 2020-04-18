var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateEfficiencyImprovement =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/humidityRatioInput.json"));

	var efficiencyImprovement = {
	currentFlueGasOxygen: parseFloat(req.query.currentFlueGasOxygen),
	newFlueGasOxygen: parseFloat(req.query.newFlueGasOxygen),
	currentFlueGasTemp: parseFloat(req.query.currentFlueGasTemp),
	currentCombustionAirTemp: parseFloat(req.query.currentCombustionAirTemp),
	currentEnergyInput: parseFloat(req.query.currentEnergyInput)
	};
	
	var value = v.validate(efficiencyImprovement, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var eff = phast.efficiencyImprovement(efficiencyImprovement);
	res.json([eff]);
}

