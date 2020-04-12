var ssmt = require("../../node_modules/amo-tools-suite/build/Release/ssmt.node");
var express = require('express');

var inputDirectory = './Input_Documentation/Steam';
var Validator = require('jsonschema').Validator;
var fs = require('fs');


exports.SteamBaseline =function(req, res)
{

	var v = new Validator();
	var schema = fs.readFileSync(inputDirectory+"/SteamAssessmentInput.json");
	schema = JSON.parse(schema);
	var steam = {
		baselinePowerDemand: 50,
	  
	  	isBaselineCalc: true,
		operationsInput: {
			sitePowerImport: 0,
		  	makeUpWaterTemperature: 0,
		  	operatingHoursPerYear: 0,
		  	fuelCosts: 0,
		  	electricityCosts: 0,
		  	makeUpWaterCosts: 0
		  },
	  	boilerInput: {
		  	fuelType: 0,
		  	fuel: 0,
		  	combustionEfficiency: 0,
		  	blowdownRate: 0,
		  	blowdownFlashed: false,
		  	preheatMakeupWater: false,
		  	steamTemperature: 0,
		  	deaeratorVentRate: 0,
		  	deaeratorPressure: 0,
		  	approachTemperature: 0
		 },
		 headerInput: {


		  	highPressureHeader: {
		  		pressure: 0,
		  		processSteamUsage: 0,
		  		condensationRecoveryRate: 10,
		  		heatLoss: 0,
		  		condensateReturnTemperature: 0,
		  		flashCondensateReturn: false
		  	},
		  	mediumPressureHeader:
		  	{
		  		pressure: 0,
		  		processSteamUsage: 0,
		  		condensationRecoveryRate: 10,
		  		heatLoss: 0,
		  		condensateReturnTemperature: 0,
		  		flashCondensateReturn: false,
		  		flashCondensateIntoHeader: 0,
		  		desuperheatSteamTheNextHighest: 0,
		  		desuperheatSteamTemperature: 0
		  	},
		  	lowPressureHeader: {
		  		pressure: 0,
		  		processSteamUsage: 0,
		  		condensationRecoveryRate: 10,
		  		heatLoss: 0,
		  		condensateReturnTemperature: 0,
		  		flashCondensateReturn: false,
		  		flashCondensateIntoHeader: 0,
		  		desuperheatSteamIntoNextHighest: 0,
		  		desuperheatSteamTemperature: 0
		  	}
		  },
		  turbineInput: {
		  	highToLowTurbine:{
		  		isentropicEfficiency: 0,
		  		generationEfficiency: 50,
		  		condenserPressure: 0,
		  		operationType: 0,
		  		operationValue1: 50,
		  		operationValue2: 0,
		  		useTurbine: false
		  	},
		  	highToMediumTurbine: {
		  		isentropicEfficiency: 0,
		  		generationEfficiency: 50,
		  		condenserPressure: 0,
		  		operationType: 0,
		  		operationValue1: 50,
		  		operationValue2: 0,
		  		useTurbine: false
		  	},
		  	mediumToLowTurbine: {
		  		isentropicEfficiency: 0,
		  		generationEfficiency: 50,
		  		condenserPressure: 0,
		  		operationType: 0,
		  		operationValue1: 50,
		  		operationValue2: 0,
		  		useTurbine: false
		  	},
		  	condensingTurbine: {
		  		isentropicEfficiency: 0,
		  		generationEfficiency: 50,
		  		condenserPressure: 0,
		  		operationType: 0,
		  		operationValue: 50,
		  		useTurbine: false
		  	}
		  }
	};
	var value = v.validate(steam, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var results = ssmt.steamModeler(steam);
	res.json({results});
}
