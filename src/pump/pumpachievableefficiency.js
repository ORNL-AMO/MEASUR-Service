var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');

var inputDirectory = './Input_Documentation/pump';
var Validator = require('jsonschema').Validator;
var fs = require('fs');

const pumpStyleEnum = ["END_SUCTION_SLURRY","END_SUCTION_SEWAGE", "END_SUCTION_STOCK",
				 "END_SUCTION_SUBMERSIBLE_SEWAGE", "API_DOUBLE_SUCTION", "MULTISTAGE_BOILER_FEED",
				"END_SUCTION_ANSI_API","AXIAL_FLOW","DOUBLE_SUCTION",
				"VERTICAL_TURBINE","LARGE_END_SUCTION","SPECIFIED_OPTIMAL_EFFICIENCY"];

exports.CalculatePumpEfficiency =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/PumpAchievableEfficiencyInput.json"));
	var pumpefficiency = {
	pump_style: parseInt(req.query.pump_style),
	flow_rate: parseFloat(req.query.flow_rate)
	};
	if(isNaN(pumpefficiency.pump_style))
			pumpefficiency.pump_style = pumpStyleEnum.indexOf(req.query.pump_style);
	var value = v.validate(pumpefficiency, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var achievableefficiency = psat.pumpEfficiency(pumpefficiency);
	res.json([achievableefficiency]);
}
