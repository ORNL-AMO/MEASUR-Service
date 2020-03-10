var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/pump';
var Validator = require('jsonschema').Validator;

exports.CalculateSuctionGaugeElevation =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/PumpHeadToolSuctionGaugeElevationInput.json"));

	var suctionGaugeElevation = {
	specificGravity: parseFloat(req.query.specificGravity),
	flowRate: parseFloat(req.query.flowRate),
	suctionPipeDiameter: parseFloat(req.query.suctionPipeDiameter),
	suctionGaugePressure: parseFloat(req.query.suctionGaugePressure),
	suctionGaugeElevation: parseFloat(req.query.suctionGaugeElevation),
	suctionLineLossCoefficients: parseFloat(req.query.suctionLineLossCoefficients),
	dischargePipeDiameter: parseFloat(req.query.dischargePipeDiameter),
	dischargeGaugePressure: parseFloat(req.query.dischargeGaugePressure),
	dischargeGaugeElevation: parseFloat(req.query.dischargeGaugeElevation),
	dischargeLineLossCoefficients: parseFloat(req.query.dischargeLineLossCoefficients)
	};
	
	var value = v.validate(suctionGaugeElevation, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var pumpTool = psat.headTool(suctionGaugeElevation);
	res.json([pumpTool]);
}

exports.CalculateSuctionTankElevation = function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/PumpHeadToolSuctionTankElevationInput.json"));
	var suctionTankElevation = {
		specificGravity: parseFloat(req.query.specificGravity),
		flowRate: parseFloat(req.query.flowRate),
		suctionPipeDiameter: parseFloat(req.query.suctionPipeDiameter),
		suctionTankGasOverPressure: parseFloat(req.query.suctionTankGasOverPressure),
		suctionTankFluidSurfaceElevation: parseFloat(req.query.suctionTankFluidSurfaceElevation),
		suctionLineLossCoefficients: parseFloat(req.query.suctionLineLossCoefficients),
		dischargePipeDiameter: parseFloat(req.query.dischargePipeDiameter),
		dischargeGaugePressure: parseFloat(req.query.dischargeGaugePressure),
		dischargeGaugeElevation: parseFloat(req.query.dischargeGaugeElevation),
		dischargeLineLossCoefficients: parseFloat(req.query.dischargeLineLossCoefficients)
	};
	var value = v.validate(suctionTankElevation,schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var pumpTool = psat.headToolSuctionTank(suctionTankElevation);
	
	res.json([pumpTool]);

}

