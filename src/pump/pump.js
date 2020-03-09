const NUMBER_OF_PUMP_STYLES = 12;
const NUMBER_OF_DRIVES = 5;
const NUMBER_OF_EFFICIENCY_CLASS = 4;
const NUMBER_OF_LOAD_ESTIMATION_METHODS = 2;
var fs = require("fs");
var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');

var inputDirectory = './Input_Documentation/pump';
var Validator = require('jsonschema').Validator;

const drive_enum = ["DIRECT_DRIVE","V_BELT_DRIVE","N_V_BELT_DRIVE","S_BELT_DRIVE","SPECIFIED"];
const lineFrequencyEnum = ["FREQ60", "FREQ50"];
const efficiency_class_enum = ["Standard", "ENERGY_EFFICIENT", "PREMIUM","SPECIFIED"];
const loadEstimationMethods = ["Power", "Current"];
const pumpStyleEnum = ["END_SUCTION_SLURRY","END_SUCTION_SEWAGE", "END_SUCTION_STOCK",
				 "END_SUCTION_SUBMERSIBLE_SEWAGE", "API_DOUBLE_SUCTION", "MULTISTAGE_BOILER_FEED",
				"END_SUCTION_ANSI_API","AXIAL_FLOW","DOUBLE_SUCTION",
				"VERTICAL_TURBINE","LARGE_END_SUCTION","SPECIFIED_OPTIMAL_EFFICIENCY"];



var setUpPump = function(req, res)
{
	var pump = {
		pump_style: parseInt(req.query.pump_style),
		pump_specified: parseFloat(req.query.pump_specified),
		pump_rated_speed: parseFloat(req.query.pump_rated_speed),
		drive: parseInt(req.query.drive),
		kinematic_viscosity: parseFloat(req.query.kinematic_viscosity),
		specific_gravity: parseFloat(req.query.specific_gravity),
		stages: parseFloat(req.query.stages),
		specifiedDriveEfficiency: parseFloat(req.query.specifiedDriveEfficiency),
		line_frequency: parseInt(req.query.line_frequency),
		motor_rated_power: parseFloat(req.query.motor_rated_power),
		motor_rated_speed: parseFloat(req.query.motor_rated_speed),
		efficiency_class: parseInt(req.query.efficiency_class),
		motor_rated_voltage: parseFloat(req.query.motor_rated_voltage),
		motor_rated_fla: parseFloat(req.query.motor_rated_fla),
		flow_rate: parseFloat(req.query.flow_rate),
		head: parseFloat(req.query.head),
		load_estimation_method: parseInt(req.query.load_estimation_method),
		motor_field_power: parseFloat(req.query.motor_field_power),
		motor_field_current: parseFloat(req.query.motor_field_current),
		motor_field_voltage: parseFloat(req.query.motor_field_voltage),
		operating_hours: parseFloat(req.query.operating_hours),
		cost_kw_hour: parseFloat(req.query.cost_kw_hour),
		efficiency: parseFloat(req.query.efficiency),
		margin: parseFloat(req.query.margin),
		fixed_speed: parseFloat(req.query.fixed_speed)
		};
		if(isNaN(pump.fixed_speed))
			pump.fixed_speed = 0;
		if(isNaN(pump.margin))
			pump.margin = 0;
		if(isNaN(pump.pump_style))
			pump.pump_style = pumpStyleEnum.indexOf(req.query.pump_style);
		if(isNaN(pump.drive))
			pump.drive = drive_enum.indexOf(req.query.drive);
		if(isNaN(pump.line_frequency))
			pump.line_frequency = lineFrequencyEnum.indexOf(req.query.line_frequency);
		if(isNaN(pump.efficiency_class))
			pump.efficiency_class = efficiency_class_enum.indexOf(req.query.efficiency_class);
		if(isNaN(pump.load_estimation_method))
			pump.load_estimation_method = loadEstimationMethods.indexOf(req.query.load_estimation_method);
		if(pump.pump_style != 3 && isNaN(pump.specifiedDriveEfficiency))
			pump.specifiedDriveEfficiency = 100;
		return pump;
}


exports.CalculateCurrentPumpEfficiency =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/PumpAssessmentInput.json"));
	var pump = setUpPump(req, res);
	var value = v.validate(pump, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var pumpResults = psat.resultsExisting(pump);

	res.json([pumpResults]);

}


exports.CalculateModifiedPumpEfficiency =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/PumpAssessmentInput.json"));
	var pump = setUpPump(req, res);
	if(isNaN(pump.motor_rated_fla))
	{
		var estimateSchema = JSON.parse(fs.readFileSync("./Input_Documentation/Motor/MotorEstimateFLAInput.json"));
		var value = v.validate(pump, estimateSchema);
		if(value.errors != "")
		{
			res.json([value.errors]);
			return;
		}
		pump.motor_rated_fla = psat.estFLA(pump);
	}
	var value = v.validate(pump, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	pumpResultOriginal = psat.resultsExisting(pump);
	
	var pumpResults = psat.resultsModified(pump);

	pumpResults.annual_energy_savings= Math.round(-1 * parseFloat(pumpResults.annual_energy) + parseFloat(pumpResultOriginal.annual_energy));
	pumpResults.annual_savings_potential= Math.round(parseInt(-1 * parseFloat(pumpResults.annual_cost) + parseFloat(pumpResultOriginal.annual_cost)));
	var baseline = {
		Name:"BaseLine",
		Results: pumpResultOriginal
	};
	var scenario1 = {
		Name:"Scenario 1",
		Results: pumpResults
	};
	res.json([baseline, scenario1]);
}

