const NUMBER_OF_DRIVES = 5;
const NUMBER_OF_EFFICIENCY_CLASS = 4;
var fan_node = require("../../node_modules/amo-tools-suite/build/Release/fan.node");
var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var fs = require("fs");
var express = require("express");
var inputDirectory = 'Input_Documentation/fan';
var Validator = require('jsonschema').Validator;
const drive_enum = ["DIRECT_DRIVE","V_BELT_DRIVE","N_V_BELT_DRIVE","S_BELT_DRIVE","SPECIFIED"];
const lineFrequencyEnum = ["FREQ60","FREQ50"];
const efficiency_class_enum = ["STANDARD","ENERGY_EFFICIENT","PREMIUM","SPECIFIED"];
const loadEstimationMethods = ["POWER","CURRENT"];

var setUpFan = function(req,res)
{
	var fan = 
	{
		fanSpeed: parseFloat(req.query.fanSpeed),
		airDensity: parseFloat(req.query.airDensity),
		drive: parseInt(req.query.drive),
		specifiedDriveEfficiency: parseFloat(req.query.specifiedDriveEfficiency),
		lineFrequency: parseInt(req.query.lineFrequency),
		motorRatedPower:parseFloat(req.query.motorRatedPower),
		motorRpm: parseFloat(req.query.motorRpm),
		efficiencyClass: parseInt(req.query.efficiencyClass),
		specifiedEfficiency: parseFloat(req.query.specifiedEfficiency),
		motorRatedVoltage:parseFloat(req.query.motorRatedVoltage),
		fullLoadAmps:parseFloat(req.query.fullLoadAmps),
		sizeMargin:parseInt(req.query.sizeMargin),
		measuredPower: parseFloat(req.query.measuredPower),
		measuredVoltage: parseFloat(req.query.measuredVoltage),
		measuredAmps: parseFloat(req.query.measuredAmps),
		flowRate:parseFloat(req.query.flowRate),
		inletPressure:parseFloat(req.query.inletPressure),
		outletPressure:parseFloat(req.query.outletPressure),
		compressibilityFactor:parseFloat(req.query.compressibilityFactor),
		operatingHours:parseFloat(req.query.operatingHours),
		unitCost: parseFloat(req.query.costKwHour),
		loadEstimationMethod:parseInt(req.query.loadEstimationMethod)		
	};
	if(isNaN(fan.fanEfficiency))
		fan.fanEfficiency = 0;
	if(isNaN(fan.drive))
		fan.drive = drive_enum.indexOf(req.query.drive);
	if(isNaN(fan.lineFrequency))
		fan.lineFrequency = lineFrequencyEnum.indexOf(req.query.lineFrequency);
	if(isNaN(fan.efficiencyClass))
		fan.efficiencyClass = efficiency_class_enum.indexOf(req.query.efficiencyClass);
	if(isNaN(fan.loadEstimationMethod))
		fan.loadEstimationMethod = loadEstimationMethods.indexOf(req.query.loadEstimationMethod);
	fan.unitCost = fan.unitCost*1000;	
	return fan;
}

exports.CalculateFanExisting = function(req,res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/FanAssessmentInput.json"));
	var fan = setUpFan(req,res);
	if(isNaN(fan.fullLoadAmps))
	{
		var estimateSchema = JSON.parse(fs.readFileSync('./Input_Documentation/Motor/MotorEstimateFLAInput.json'));
		var required_motor_values =
		{
			motor_rated_power : fan.motorRatedPower,
			motor_rated_speed : fan.motorRpm,
			motor_rated_voltage : fan.motorRatedVoltage,
			line_frequency : fan.lineFrequency,
			efficiency_class : fan.efficiencyClass,
			efficiency : fan.specifiedEfficiency
		}
		var value = v.validate(required_motor_values,estimateSchema);
		if(value.errors != "")
		{
			res.json([value.errors]);
			return;
		}
		fan.fullLoadAmps = psat.estFLA(required_motor_values);	
	}

	var value = v.validate(fan,schema);
	if(value.errors!="")
	{
		res.json([value.errors]);
		return;
	}
	var fanResults = fan_node.fanResultsExisting(fan);
	fanResults.annualEnergy = Math.round(fanResults.annualEnergy)*1.0;
	res.json([fanResults]);
}



exports.CalculateFanModified = function(req,res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/FanAssessmentInput.json"));
	var fan = setUpFan(req,res);
	if(isNaN(fan.fullLoadAmps))
	{
		var estimateSchema = JSON.parse(fs.readFileSync('./Input_Documentation/Motor/MotorEstimateFLAInput.json'));
		var required_motor_values =
		{
			motor_rated_power : fan.motorRatedPower,
			motor_rated_speed : fan.motorRpm,
			motor_rated_voltage : fan.motorRatedVoltage,
			line_frequency : fan.lineFrequency,
			efficiency_class : fan.efficiencyClass,
			efficiency : fan.specifiedEfficiency
		}
		var value = v.validate(required_motor_values,estimateSchema);
		if(value.errors != "")
		{
			res.json([value.errors]);
			return;
		}
		fan.fullLoadAmps = psat.estFLA(required_motor_values);	
	}

	var value = v.validate(fan,schema);
	if(value.errors!="")
	{
		res.json([value.errors]);
		return;
	}
	var fanResults = fan_node.fanResultsExisting(fan);
	var fanResultsMod = fan_node.fanResultsModified(fan);
	fanResultsMod.annual_energy_savings = Math.round(-1*parseFloat(fanResultsMod.annual_energy)+parseFloat(fanResults.annual_energy));
	fanResultsMod.annual_savings_potential = Math.round(-1*parseFloat(fanResultsMod.annual_cost)+parseFloat(fanResult.annual_cost));	
	res.json([fanResults]);
	var baseline = 
	{
		Name:"Baseline",
		Results : fanResults	
	};
	var scenario1 = 
	{
		Name: "Scenario 1",
		Results: fanResultsMod
	};
	res.json([baseline,scenario1]);
}
