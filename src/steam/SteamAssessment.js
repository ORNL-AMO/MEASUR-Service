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
	var steam = "";
	try
	{
		var numberOfHeaders = 0;
		var a = TestJSON(req.query.headerInput) ? JSON.parse(req.query.headerInput) : "None";
		if(a != "None")
		{	
			console.log(a);
			if(a.hasOwnProperty("highPressureHeader") && a["highPressureHeader"].hasOwnProperty("pressure")) {
				numberOfHeaders = 1;
				if(a.hasOwnProperty("mediumPressureHeader") && a["mediumPressureHeader"].hasOwnProperty("pressure"))
				{
					numberOfHeaders = 2;
					if(a.hasOwnProperty("lowPressureHeader") && (a["lowPressureHeader"].hasOwnProperty("pressure"))){
						numberOfHeaders = 3;
					}
				}
			}
			console.log(numberOfHeaders);
		}

		steam = {
			baselinePowerDemand: parseFloat(req.query.baselinePowerDemand),
		
			isBaselineCalc: TestJSON(req.query.isBaselineCalc.toLowerCase())? JSON.parse(req.query.isBaselineCalc.toLowerCase()) : false,
			operationsInput: TestJSON(req.query.operationsInput)? JSON.parse(req.query.operationsInput) : "Operations input was in an incorrect JSON format",
			boilerInput: TestJSON(req.query.boilerInput)? JSON.parse(req.query.boilerInput) : "Boiler Input was in an incorrect status",
			headerInput: TestJSON(req.query.headerInput) && numberOfHeaders == 3? JSON.parse(req.query.headerInput): numberOfHeaders == 0 ? "Incorrect headerInput set up for parsing JSON." : numberOfHeaders == 1 ? {
				highPressureHeader:  a["highPressureHeader"],
				mediumPressureHeader: null,
				lowPressureHeader: null
			} : 
			{
				highPressureHeader: a["highPressureHeader"],
				mediumPressureHeader: a["mediumPressureHeader"] ,
				lowPressureHeader:  {
					pressure: 0
				}
			},
			turbineInput: TestJSON(req.query.turbineInput) && req.query.useTurbine != "" ? JSON.parse(req.query.turbineInput) : 
			{
				highToLowTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue1": 0,
					"operationValue2": 0,
					"useTurbine":false
				},
				highToMediumTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue1": 0,
					"operationValue2": 0,
					"useTurbine":false
				},
				mediumToLowTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue1": 0,
					"operationValue2": 0,
					"useTurbine":false
				},
				condensingTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue": 0,
					"useTurbine":false
				}
			}
		};
		if(steam["boilerInput"]["preheatMakeUpWater"] == false)
		{
			steam["boilerInput"]["approachTemperature"] = steam["boilerInput"]["steamTemperature"]
		}
		console.log(steam);
	}catch(e)
	{
		res.json([e.message, "JSON parsing failed please verify that the parameters passed in were of the correct structure"]);
		return;
	}
	var value = v.validate(steam, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	try
	{
		var results = ssmt.steamModeler(steam);
		res.json({results});
	}catch(e){
		res.json([e.message]);
	}
}

TestJSON = function(string)
{
	try
	{
		JSON.parse(string);
		return true;
	}
	catch(e)
	{
		return false;
	}

}
//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=1&isBaselineCalc=true&operationsInput={"sitePowerImport":18000000,"makeUpWaterTemperature":283.15,"operatingHoursPerYear":8000,"fuelCosts":0.00005478,"electricityCosts":1.39E-05,"makeUpWaterCosts":0.66}&boilerInput={"fuelType":1,"fuel":1,"combustionEfficiency":85,"blowdownRate":2,"blowdownFlashed":true,"preheatMakeupWater":true,"steamTemperature":514.2,"deaeratorVentRate":0.1,"deaeratorPressure":0.05, "approachTemperature": 10}&headerInput={"highPressureHeader":{"pressure":1.136,"processSteamUsage":22680,"condensationRecoveryRate":50,"heatLoss":0.1,"condensateReturnTemperature":338.7,"flashCondensateReturn":true}}&turbineInput={"highToLowTurbine":{"useTurbine":false},"highToMediumTurbine":{"useTurbine":false},"mediumToLowTurbine":{"useTurbine":false},"condensingTurbine":{"useTurbine":false}}
//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=1&isBaselineCalc=true&operationsInput={"sitePowerImport":18000000,"makeUpWaterTemperature":283.15,"operatingHoursPerYear":8000,"fuelCosts":0.00005478,"electricityCosts":1.39E-05,"makeUpWaterCosts":0.66}&boilerInput={"fuelType":1,"fuel":1,"combustionEfficiency":85,"blowdownRate":2,"blowdownFlashed":true,"preheatMakeupWater":true,"steamTemperature":514.2,"deaeratorVentRate":0.1,"deaeratorPressure":0.05, "approachTemperature": 10}&headerInput={"highPressureHeader":{"pressure":1.136,"processSteamUsage":22680,"condensationRecoveryRate":50,"heatLoss":0.1,"condensateReturnTemperature":338.7,"flashCondensateReturn":true}}&turbineInput={"highToLowTurbine":{"useTurbine":false},"highToMediumTurbine":{"useTurbine":false},"mediumToLowTurbine":{"useTurbine":false},"condensingTurbine":{"useTurbine":false}}&useTurbine:true

//Working link below for java script test
//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=1&isBaselineCalc=true&operationsInput={"sitePowerImport":18000000,"makeUpWaterTemperature":283.15,"operatingHoursPerYear":8000,"fuelCosts":0.000005478,"electricityCosts":1.39E-05,"makeUpWaterCosts":0.66}&boilerInput={"fuelType":1,"fuel":1,"combustionEfficiency":85,"blowdownRate":2,"blowdownFlashed":true,"preheatMakeupWater":true,"steamTemperature":514.2,"deaeratorVentRate":0.1,"deaeratorPressure":0.204747, "approachTemperature": 10}&headerInput={"highPressureHeader":{"pressure":1.136,"processSteamUsage":22680,"condensationRecoveryRate":50,"heatLoss":0.1,"condensateReturnTemperature":338.7,"flashCondensateReturn":true}}&turbineInput={"highToLowTurbine":{"isentropicEfficiency":2,"generationEfficiency":2,"condenserPressure":2,"operationType":2,"operationValue1":2,"operationValue2":2,"useTurbine":true},"highToMediumTurbine":{"isentropicEfficiency":3,"generationEfficiency":3,"condenserPressure":3,"operationType":3,"operationValue1":3,"operationValue2":3,"useTurbine":true},"mediumToLowTurbine":{"isentropicEfficiency":4,"generationEfficiency":4,"condenserPressure":4,"operationType":4,"operationValue1":4,"operationValue2":4,"useTurbine":true},"condensingTurbine":{"isentropicEfficiency":1,"generationEfficiency":1,"condenserPressure":1,"operationType":1,"operationValue":1,"useTurbine":true}}&useTurbine=true

//more than one header below
//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=50&isBaselineCalc=true&operationsInput={"sitePowerImport":50,"makeUpWaterTemperature":160,"operatingHoursPerYear":8760,"fuelCosts":0.05,"electricityCosts":0.05,"makeUpWaterCosts":0.03}&boilerInput={"fuelType":0,"fuel":0,"combustionEfficiency":50,"blowdownRate":20,"blowdownFlashed":false,"preheatMakeupWater":false,"steamTemperature":600,"deaeratorVentRate":0.5,"deaeratorPressure":0,"approachTemperature":0}&headerInput={"highPressureHeader":{"pressure":100,"processSteamUsage":50,"condensationRecoveryRate":5,"heatLoss":0.1,"condensateReturnTemperature":59,"flashCondensateReturn":false},"mediumPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}, "lowPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}}&turbineInput={"highToLowTurbine":{"isentropicEfficiency":2,"generationEfficiency":2,"condenserPressure":2,"operationType":2,"operationValue1":2,"operationValue2":2,"useTurbine":true},"highToMediumTurbine":{"isentropicEfficiency":3,"generationEfficiency":3,"condenserPressure":3,"operationType":3,"operationValue1":3,"operationValue2":3,"useTurbine":true},"mediumToLowTurbine":{"isentropicEfficiency":4,"generationEfficiency":4,"condenserPressure":4,"operationType":4,"operationValue1":4,"operationValue2":4,"useTurbine":true},"condensingTurbine":{"isentropicEfficiency":1,"generationEfficiency":1,"condenserPressure":1,"operationType":1,"operationValue":1,"useTurbine":true}}
//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=50&isBaselineCalc=true&operationsInput={"sitePowerImport":0,"makeUpWaterTemperature":0,"operatingHoursPerYear":8760,"fuelCosts":0,"electricityCosts":0,"makeUpWaterCosts":0}&boilerInput={"fuelType":0,"fuel":0,"combustionEfficiency":0,"blowdownRate":0,"blowdownFlashed":false,"preheatMakeupWater":false,"steamTemperature":0,"deaeratorVentRate":0,"deaeratorPressure":0,"approachTemperature":0}&headerInput={"highPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false},"mediumPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}, "lowPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}}&turbineInput={}