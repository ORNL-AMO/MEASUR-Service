var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');

var inputDirectory = './Input_Documentation/pump';
var Validator = require('jsonschema').Validator;
var fs = require('fs');
exports.CalculatePumpEfficiency =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/PumpAchievableEfficiencyInput.json"));
	var pumpefficiency = {
	pump_style: parseInt(req.query.pump_style),
	flow_rate: parseFloat(req.query.flow_rate)
	}; 
	var value = v.validate(pumpefficiency, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var achievableefficiency = psat.pumpEfficiency(pumpefficiency);
	res.json([achievableefficiency]);
}
