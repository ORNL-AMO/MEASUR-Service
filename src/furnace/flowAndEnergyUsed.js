var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
exports.CalculateFlowAndEnergyUsed =function(req, res)
{
	var flowAndEnergy = {
	gasType:0,
	specificGravity: 0.657,
	orificeDiameter: 3.5,
	insidePipeDiameter: 8.0,
	sectionType:0,
	dischargeCoefficient: 0.6,
	gasHeatingValue: 1032.44,
	gasTemperature: 85.0,
	gasPressure: 85.0,
	orificePressureDrop: 10.0,
	operatingTime: 10.0,
	dischargeLineLossCoefficients: 1.0
	};
	var message = "Errors Found: ";

if(req.query.specificGravity && parseFloat(req.query.specificGravity))
	{
		flowAndEnergy.specificGravity = req.query.specificGravity;
	}
	else
	{
		message += "Specific Gravity Parameter not found. ";
	}
	if(req.query.orificeDiameter && parseFloat(req.query.orificeDiameter))
	{
		flowAndEnergy.orificeDiameter= req.query.orificeDiameter;
	}
	else
	{
		message += "Orifice Diameter parameter not found. ";
	}

	if(req.query.insidePipeDiameter && parseFloat(req.query.insidePipeDiameter))
	{
		flowAndEnergy.insidePipeDiameter = req.query.insidePipeDiameter;
	}
	else
	{
		message += "Inside PipeDiameter Diameter parameter not found. ";
	}	
	if(req.query.dischargeCoefficient && parseFloat(req.query.dischargeCoefficient))
	{
		flowAndEnergy.dischargeCoefficient = req.query.dischargeCoefficient;
	}
	else
	{
		message += "Discharge Coefficient parameter not found. ";
	}
if(req.query.gasHeatingValue && parseFloat(req.query.gasHeatingValue))
	{
		flowAndEnergy.gasHeatingValue = req.query.gasHeatingValue;
	}
	else
	{
		message += "Gas Heating Value parameter not found. ";
	}
if(req.query.gasTemperature && parseFloat(req.query.gasTemperature))
	{
		flowAndEnergy.gasTemperature = req.query.gasTemperature;
	}
	else
	{
		message += "Gas Temperature  parameter not found. ";
	}
if(req.query.gasPressure && parseFloat(req.query.gasPressure))
	{
		flowAndEnergy.gasPressure = req.query.gasPressure;
	}
	else
	{
		message += "Gas Pressure parameter not found. ";
	}
if(req.query.orificePressureDrop && parseFloat(req.query.orificePressureDrop))
	{
		flowAndEnergy.orificePressureDrop = req.query.orificePressureDrop;
	}
	else
	{
		message += "Orifice Pressure Drop parameter not found. ";
	}


if(req.query.operatingTime && parseFloat(req.query.operatingTime))
	{
		flowAndEnergy.operatingTime = req.query.operatingTime;
	}
	else
	{
		message += "Operating Time parameter not found. ";
	}
if(req.query.dischargeLineLossCoefficients && parseFloat(req.query.dischargeLineLossCoefficients))
	{
		flowAndEnergy.dischargeLineLossCoefficients = req.query.dischargeLineLossCoefficients;
	}
	else
	{
		message += "Discharge Line Loss Coefficients parameter not found. ";
	}

















	
	var FAE=phast.flowCalculations(flowAndEnergy);
	res.json([FAE]);
	
}
