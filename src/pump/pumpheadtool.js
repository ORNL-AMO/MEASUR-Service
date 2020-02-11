var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');
exports.CalculateSuctionGaugeElevation =function(req, res)
{
	var suctionGaugeElevation = {
	specificGravity: 1.0,
	flowRate: 2000,
	suctionPipeDiameter: 12.0,
	suctionGaugePressure: 5.0,
	suctionGaugeElevation: 10.0,
	suctionLineLossCoefficients: 0.5,
	dischargePipeDiameter: 12.0,
	dischargeGaugePressure: 124.0,
	dischargeGaugeElevation: 10.0,
	dischargeLineLossCoefficients: 1.0
	};
	var message = "Errors Found: ";
	
	var testingAPI = (req.query.testingAPI == 'true');
	if(req.query.specificGravity && parseFloat(req.query.specificGravity))
	{
		suctionGaugeElevation.specificGravity = req.query.specificGravity;
	}
	else
	{
		message += "Specific Gravity Parameter not found using default. ";
	}
	if(req.query.flowRate && parseFloat(req.query.flowRate))
	{
		suctionGaugeElevation.flowRate = req.query.flowRate;
	}
	else
	{
		message += "Flow Rate Parameter not found using default. ";

	}
	if(req.query.suctionPipeDiameter && parseFloat(req.query.suctionPipeDiameter))
	{
		suctionGaugeElevation.suctionPipeDiameter = req.query.suctionPipeDiameter;
	}
	else
	{
		message += "Suction Pipe Diameter parameter not found using default. ";
	}
	if(req.query.suctionGaugePressure && parseFloat(req.query.suctionGaugePressure))
	{
		suctionGaugeElevation.suctionGaugePressure = req.query.suctionGaugePressure;
	}
	else
	{
		message += "Suction Gauge Pressure parameter not found using default. ";
	}
	if(req.query.suctionGaugeElevation && parseFloat(req.query.suctionGaugeElevation))
	{
		suctionGaugeElevation.suctionGaugeElevation = req.query.suctionGaugeElevation;
	}
	else
	{
		message +=  "Suction Gauge Elevation parameter not found using default. ";
	}
	if(req.query.suctionLineLossCoefficients && parseFloat(req.query.suctionLineLossCoefficients))
	{
		suctionGaugeElevation.suctionLineLossCoefficients = req.query.suctionLineLossCoefficients;
	}
	else
	{
		message += "Suction Line Loss Coefficients parameter not found using default. ";
	}
	if(req.query.dischargePipeDiameter && parseFloat(req.query.dischargePipeDiameter))
	{
		suctionGaugeElevation.dischargePipeDiameter = req.query.dischargePipeDiameter;
	}
	else
	{
		message += "Discharge Pipe Diameter parameter not found using default. ";
	}
	if(req.query.dischargeGaugePressure && parseFloat(req.query.dischargeGaugePressure))
	{
		suctionGaugeElevation.dischargeGaugePressure = req.query.dischargeGaugePressure;
	}
	else
	{
		message += "Discharge Gauge Pressure parameter not found using default.";
	}
	if(req.query.dischargeGaugeElevation && parseFloat(req.query.dischargeGaugeElevation))
	{
		suctionGaugeElevation.dischargeGaugeElevation = req.query.dischargeGaugeElevation;
	}
	else
	{
		message += "Discharge Gauge Elevation parameter not found using default. ";
	}
	if(req.query.dischargeLineLossCoefficients &&parseFloat(req.query.dischargeLineLossCoefficients))
	{
		suctionGaugeElevation.dischargeLineLossCoefficients = req.query.dischargeLineLossCoefficients;
	}
	else
	{
		message += "Discharge Line Loss Coefficient parameter not found using default.";
	}
	var pumpTool = psat.headTool(suctionGaugeElevation);
	
	
	if(testingAPI)
	{
		var unitsParameters = ["Units for parameters", "Flow Rate gpm", "Pipe diameter inches", "Gauge Pressure psi",
	 "Gauge Elevation feet", "Discharge Pipe Diameter inches",
	 	"Gauge Pressure psi", "Gauge elevation feet"];
	 	var unitsReturned = ["Units for Returned Values", "Differential Elevation Head Feet", "Differential Pressure Head Feet", "Differential Velocity Head Feet", "Estimated Suction Friction Head Feet", "Discharge Friction Head Feet", "Pump Head Feet"];
		res.send([pumpTool, unitsParameters, unitsReturned, message]);
	}
	else
	{
		res.send([pumpTool]);
	}
}

exports.CalculateSuctionTankElevation = function(req, res)
{
	var suctionTankElevation = {
	specificGravity: 1.0,
	flowRate: 2000,
	suctionPipeDiameter: 12.0,
	suctionTankGasOverPressure: 0.0,
	suctionTankFluidSurfaceElevation: 10.0,
	suctionLineLossCoefficients: 0.5,
	dischargePipeDiameter: 12.0,
	dischargeGaugePressure: 124.0,
	dischargeGaugeElevation: 10.0,
	dischargeLineLossCoefficients: 1.0
	};
	var testingAPI = false;
	if(req.query.testingAPI)
	{
		testingAPI = (req.query.testingAPI == 'true');
	}
	var message = '';
	if(req.query.specificGravity && parseFloat(req.query.specificGravity))
	{
		suctionTankElevation.specificGravity = req.query.specificGravity;
	}
	else
	{
		message += "Specific Gravity Parameter not found. ";
	}
	if(req.query.flowRate && parseFloat(req.query.flowRate))
	{
		suctionTankElevation.flowRate = req.query.flowRate;
	}
	else
	{
		message += "Flow Rate parameter not found. ";
	}

	if(req.query.suctionPipeDiameter && parseFloat(req.query.suctionPipeDiameter))
	{
		suctionTankElevation.suctionPipeDiameter = req.query.suctionPipeDiameter;
	}
	else
	{
		message += "Suction Pipe Diameter parameter not found. ";
	}	
	if(req.query.suctionTankGasOverPressure && parseFloat(req.query.suctionTankGasOverPressure))
	{
		suctionTankElevation.suctionTankGasOverPressure = req.query.suctionTankGasOverPressure;
	}
	else
	{
		message += "Suction Tank Gas Over Pressure parameter not found. ";
	}
	if(req.query.suctionTankFluidSurfaceElevation && parseFloat(req.query.suctionTankFluidSurfaceElevation))
	{
		suctionTankElevation.suctionTankFluidSurfaceElevation = req.query.suctionTankFluidSurfaceElevation;
	}
	else
	{
		message += "Suction Tank Fluid Surface Elevation parameter not found. ";
	}
	if(req.query.suctionLineLossCoefficients && parseFloat(req.query.suctionLineLossCoefficients))
	{
		suctionTankElevation.suctionLineLossCoefficients = req.query.suctionLineLossCoefficients;
	}
	else
	{
		message += "Suction Line Loss Coefficients parameter not found. ";
	}
	if(req.query.dischargePipeDiameter && parseFloat(req.query.dischargePipeDiameter))
	{
		suctionTankElevation.dischargePipeDiameter = req.query.dischargePipeDiameter;
	}
	else
	{
		message += "Discharge Pipe Diameter parameter not found.";
	}
	if(req.query.dischargeGaugePressure && parseFloat(req.query.dischargeGaugePressure))
	{
		suctionTankElevation.dischargeGaugePressure = req.query.dischargeGaugePressure;
	}
	else
	{
		message += "Discharge Gauge Pressure parameter not found. ";
	}
	if(req.query.dischargeGaugeElevation && parseFloat(req.query.dischargeGaugeElevation))
	{
		suctionTankElevation.dischargeGaugeElevation = req.query.dischargeGaugeElevation;
	}
	else
	{
		message += "Discharge Gauge Elevation parameter not found. ";
	}
	if(req.query.dischargeLineLossCoefficients && parseFloat(req.query.dischargeLineLossCoefficients))
	{
		suctionTankElevation.dischargeLineLossCoefficients = req.query.dischargeLineLossCoefficients;
	}
	else
	{
		message += "Discharge line loss coefficients parameter not found.";
	}
	var pumpTool = psat.headToolSuctionTank(suctionTankElevation);
	
	if(!testingAPI)
	{
		res.json([pumpTool]);
	}
	else
	{
		var parameters = ["Units for Parameters", "Flow Rate gpm", "Suction Pipe Diameter inches", "Suction Tank Gas Overpressure psi", "Suction Tank Fluid Surface Elevation Feet", "Discharge Pipe Diameter inches", "Discharge Gauge Pressure psi", "Discharge Gauge Elevation feet"];
		var resultUnits = ["Units for Results", "Differential Elevation Head feet", "Differential Pressure Head feet", "Differential Velocity Head feet", "Estimated Suction Friction Head feet", "Discharge Friction Head feet", "Pump Head feet"];
		res.json([pumpTool, parameters, resultUnits, message]);
	}

}

