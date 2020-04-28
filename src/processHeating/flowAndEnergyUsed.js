var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');

var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;
var fs = require('fs');

const gasTypeEnum = ["AIR", "AMMONNIA_DISSOCIATED", "ARGON", "BUTANE", 
				"ENDOTHERMIC_AMMONIA","EXOTHERMIC_CRACKED_LEAN", "EXOTHERMIC_CRACKED_RICH",
				"HELIUM", "HYDROGEN", "NATURAL_GAS", "NITROGEN", "OXYGEN", "PROPANE", "OTHER"];
const sectionTypeEnum = ["SQUARE_EDGE", "SHARP_EDGE", "VENTURI"];

exports.CalculateFlowAndEnergyUsed =function(req, res)
{

	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/FlowCalculationsInput.json"));

	var flowAndEnergy = {
	gasType: parseInt(req.query.gasType),
	specificGravity: parseFloat(req.query.specificGravity),
	orificeDiameter: parseFloat(req.query.orificeDiameter),
	insidePipeDiameter: parseFloat(req.query.insidePipeDiameter),
	sectionType: parseInt(req.query.sectionType),
	dischargeCoefficient: parseFloat(req.query.dischargeCoefficient),
	gasHeatingValue: parseFloat(req.query.gasHeatingValue),
	gasTemperature: parseFloat(req.query.gasTemperature),
	gasPressure: parseFloat(req.query.gasPressure),
	orificePressureDrop: parseFloat(req.query.orificePressureDrop),
	operatingTime: parseFloat(req.query.operatingTime)
	};
	if(isNaN(flowAndEnergy.gasType))
			flowAndEnergy.gasType = gasTypeEnum.indexOf(req.query.gasType);
	if(isNaN(flowAndEnergy.sectionType))
		flowAndEnergy.sectionType = sectionTypeEnum.indexOf(req.query.sectionType);
	var value = v.validate(flowAndEnergy, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var FAE=phast.flowCalculations(flowAndEnergy);
	res.json([FAE]);
	
}
