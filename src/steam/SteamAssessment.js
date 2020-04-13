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
		
		steam = {
			baselinePowerDemand: parseFloat(req.query.baselinePowerDemand),
		
			isBaselineCalc: JSON.parse(req.query.isBaselineCalc.toLowerCase()),
			operationsInput: JSON.parse(req.query.operationsInput),
			boilerInput: JSON.parse(req.query.boilerInput),
			headerInput: JSON.parse(req.query.headerInput),
			turbineInput: JSON.parse(req.query.turbineInput)
		};
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


//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=50&isBaselineCalc=true&operationsInput={"sitePowerImport":50,"makeUpWaterTemperature":160,"operatingHoursPerYear":8760,"fuelCosts":0.05,"electricityCosts":0.05,"makeUpWaterCosts":0.03}&boilerInput={"fuelType":0,"fuel":0,"combustionEfficiency":50,"blowdownRate":20,"blowdownFlashed":false,"preheatMakeupWater":false,"steamTemperature":600,"deaeratorVentRate":0.5,"deaeratorPressure":0,"approachTemperature":0}&headerInput={"highPressureHeader":{"pressure":100,"processSteamUsage":50,"condensationRecoveryRate":5,"heatLoss":0.1,"condensateReturnTemperature":59,"flashCondensateReturn":false},"mediumPressureHeader":{}, "lowPressureHeader":{}}&turbineInput={"highToLowTurbine":{},"highToMediumTurbine":{},"mediumToLowTurbine":{},"condensingTurbine":{}}
//more than one header below
//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=50&isBaselineCalc=true&operationsInput={"sitePowerImport":50,"makeUpWaterTemperature":160,"operatingHoursPerYear":8760,"fuelCosts":0.05,"electricityCosts":0.05,"makeUpWaterCosts":0.03}&boilerInput={"fuelType":0,"fuel":0,"combustionEfficiency":50,"blowdownRate":20,"blowdownFlashed":false,"preheatMakeupWater":false,"steamTemperature":600,"deaeratorVentRate":0.5,"deaeratorPressure":0,"approachTemperature":0}&headerInput={"highPressureHeader":{"pressure":100,"processSteamUsage":50,"condensationRecoveryRate":5,"heatLoss":0.1,"condensateReturnTemperature":59,"flashCondensateReturn":false},"mediumPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}, "lowPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}}&turbineInput={"highToLowTurbine":{"isentropicEfficiency":0,"generationEfficiency":50,"condenserPressure":0,"operationType":0,"operationValue1":50,"operationValue2":0,"useTurbine":false},"highToMediumTurbine":{"isentropicEfficiency":0,"generationEfficiency":50,"condenserPressure":0,"operationType":0,"operationValue1":50,"operationValue2":0,"useTurbine":false},"mediumToLowTurbine":{"isentropicEfficiency":0,"generationEfficiency":50,"condenserPressure":0,"operationType":0,"operationValue1":50,"operationValue2":0,"useTurbine":false},"condensingTurbine":{"isentropicEfficiency":0,"generationEfficiency":50,"condenserPressure":0,"operationType":0,"operationValue":50,"useTurbine":false}}
//https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=50&isBaselineCalc=true&operationsInput={"sitePowerImport":0,"makeUpWaterTemperature":0,"operatingHoursPerYear":8760,"fuelCosts":0,"electricityCosts":0,"makeUpWaterCosts":0}&boilerInput={"fuelType":0,"fuel":0,"combustionEfficiency":0,"blowdownRate":0,"blowdownFlashed":false,"preheatMakeupWater":false,"steamTemperature":0,"deaeratorVentRate":0,"deaeratorPressure":0,"approachTemperature":0}&headerInput={"highPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false},"mediumPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}, "lowPressureHeader":{"pressure":0,"processSteamUsage":0,"condensationRecoveryRate":10,"heatLoss":0,"condensateReturnTemperature":0,"flashCondensateReturn":false,"flashCondensateIntoHeader":0,"desuperheatSteamIntoNextHighest":0,"desuperheatSteamTemperature":0}}&turbineInput={}