var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');


var inputDirectory = './Input_Documentation/Motor';
var Validator = require('jsonschema').Validator;
var fs = require('fs');

const efficiency_class_enum = ["Standard", "ENERGY_EFFICIENT", "PREMIUM","SPECIFIED"];
const lineFrequencyEnum = ["FREQ60", "FREQ50"];


exports.CalculateMotorNEMA = function(req,res)
{

	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/MotorNEMAInput.json"));

	var motorNEMA =
	{	
		load_factor: parseFloat(req.query.load_factor),
		motor_rated_power: parseFloat(req.query.motor_rated_power),
		motor_rated_speed: parseFloat(req.query.motor_rated_speed),
		efficiency_class: parseFloat(req.query.efficiency_class),
		efficiency: parseFloat(req.query.efficiency),
		line_frequency: parseInt(req.query.line_frequency) 
	};


	if(isNaN(motorNEMA.efficiency_class))
		motorNEMA.efficiency_class = efficiency_class_enum.indexOf(req.query.efficiency_class);
	if(isNaN(motorNEMA.line_frequency))
		motorNEMA.line_frequency = lineFrequencyEnum.indexOf(req.query.line_frequency);
	
	var value = v.validate(motorNEMA, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}

	var MotorPer = psat.nema(motorNEMA);
	res.json([MotorPer]);
}
