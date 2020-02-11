var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');
exports.CalculatePumpEfficiency =function(req, res)
{
	var pumpefficiency = {
	pump_style:0 ,
	flow_rate: 2000
}; 
var message = "Errors Found: ";
var testingAPI = (req.query.testingAPI == 'true');
if(req.query.pumpStyle && parseFloat(req.query.pumpStyle))
	{
	if(0>req.query.pumpStyle || req.query.pumpStyle >11 ||isNaN(req.query.pumpStyle)){
	throw "Invalid input pumpStyle param must be a number from 0->11";	
	}
	else{
	pumpefficiency.pump_style = req.query.pumpStyle;
	}
		
}
	else
	{
		message += "Pump style Parameter not found using  " +pumpefficiency.pump_style;
	}
	if(req.query.flowRate && parseFloat(req.query.flowRate))
	{
		if(req.query.flowRate <0 || isNaN(req.query.flowRate))
		{
			throw "flowRate parameter must be a positive integer ";
		}
		else{
		pumpefficiency.flow_rate = req.query.flowRate;
		}		
	}
	else
	{
		message += "Flow Rate Parameter not found using default. ";

	}
	var achievableefficiency = psat.pumpEfficiency(pumpefficiency);
	
	
	if(testingAPI)
	{
		var unitsParameters = ["Units for parameters", "Flow Rate gpm", "Pipe diameter inches", "Gauge Pressure psi",
	 "Gauge Elevation feet", "Discharge Pipe Diameter inches",
	 	"Gauge Pressure psi", "Gauge elevation feet"];
	 	var unitsReturned = ["Units for Returned Values", "Differential Elevation Head Feet", "Differential Pressure Head Feet", "Differential Velocity Head Feet", "Estimated Suction Friction Head Feet", "Discharge Friction Head Feet", "Pump Head Feet"];
		res.json([achievableefficency, unitsParameters, unitsReturned, message]);
	}
	else
	{
		res.json([achievableefficiency, message]);
	}	
}
