var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.BaseLineAssessment =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/ProcessHeatingAssessmentInput.json"));

	var processHeating = {
		operatingHours: parseFloat(req.query.operatingHours),
		flueGas: TestJSON(req.query.flueGas) ? JSON.parse(req.query.flueGas) : null,
		chargeMaterials: req.query.chargeMaterials,
		fuelCosts: parseFloat(req.query.fuelCosts),
		steamCosts: parseFloat(req.query.steamCosts),
		electricityCosts: parseFloat(req.query.electricityCosts)
		};
	
		

	if(!TestJSON(processHeating.chargeMaterials))
	{
		res.json(["Error: Charge Materials were not passed in as a JSON object array."]);
		return;	
	}
	processHeating.chargeMaterials = JSON.parse(processHeating.chargeMaterials);
	var value = v.validate(processHeating, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var output = {
		EnergyUsed: 0,
		HeatingValue: 0,
		FuelUsed: 0,
		EnergyIntensityforChargeMaterials: 0
	};
	var energyUsed = 0;
	for(var key in processHeating.chargeMaterials)
	{
		var value = processHeating.chargeMaterials[key];
		if(!value.hasOwnProperty("type"))
		{	
			res.json(["Error: JSON Object for Charge Material did not have key value pair for Type of the charge material."]);
			return;
		}
		var type = value.type;
		if(type.toLowerCase() == 'gas')
		{
			var validation = VerifyGasLoadCharge(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			energyUsed = energyUsed + phast.gasLoadChargeMaterial(value)/1000000;
		}
		else if(type.toLowerCase() == 'solid')
		{
			var validation = VerifySolidLoadCharge(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			energyUsed = energyUsed + phast.solidLoadChargeMaterial(value)/1000000;	
		}
		else if(type.toLowerCase() == 'liquid')
		{
			var validation = VerifyLiquidLoadCharge(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			energyUsed = energyUsed + phast.liquidLoadChargeMaterial(value)/1000000;
		}
	}
	if(processHeating.flueGas == null){
		res.json(["Error: There was an issue with the flue gas not being included as a JSON object."]);
		return;
	}
	if(!processHeating.flueGas.hasOwnProperty("type")){
		res.json(["Error: There was an issue with the flue gas not including the type of the flue gas as a JSON key value pair."]);
		return;
	}	
	var type = processHeating.flueGas.type;
		if(type.toLowerCase() == 'gas')
		{
			var value = processHeating.flueGas;
			var validation = VerifyFlueGasByVolume(value);
			
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			processHeating.flueGas = phast.flueGasLossesByVolume(value);
			output.HeatingValue = phast.flueGasByVolumeCalculateHeatingValue(value);
			output.HeatingValue = output.HeatingValue.heatingValue/1000000;
		}
		else
		{
			var value = processHeating.flueGas;
	
			var validation = VerifyFlueGasByMass(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}

			processHeating.flueGas = phast.flueGasLossesByMass(value);
			output.HeatingValue = phast.flueGasByMassCalculateHeatingValue(value);
			output.HeatingValue /= 1000000;
		}


	
	output.EnergyUsed += energyUsed;
	
	output.EnergyUsed = output.EnergyUsed/processHeating.flueGas;
	output.FuelUsed = output.EnergyUsed;


	res.json([output]);
}


function VerifyGasLoadCharge(value)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/GasLoadChargeMaterialInput.json"));

	return v.validate(value, schema);
}

function VerifySolidLoadCharge(value)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/SolidLoadChargeMaterialInput.json"));

	return v.validate(value, schema);
}

function VerifyLiquidLoadCharge(value)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/LiquidLoadChargeMaterialInput.json"));

	return v.validate(value, schema);
}

function VerifyFlueGasByVolume(value)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/flueGasLossesByVolumeInput.json"));

	return v.validate(value, schema);
}
function VerifyFlueGasByMass(value)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/flueGasLossesByMassInput.json"));

	return v.validate(value, schema);
}

function TestJSON(value)
{
	try{
		JSON.parse(value);
		return true;
	}
	catch(e){
		return false;
	}
}
//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":200,"feedRate":100,"percentVapor":50,"initialTemperature":150,"dischargeTemperature":200,"specificHeatVapor":250,"specificHeatGas":250,"percentReacted":25,"reactionHeat":175,"additionalHeat":0}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":100, "latentHeat":170,"specificHeatLiquid":200,"meltingPoint":1210,"chargeFeedRate":150,"waterContentCharged":25,"waterContentDischarged":10,"initialTemperature":100,"dischargeTemperature":200,"waterVaporDischargeTemperature":180,"chargeMelted":0,"chargeReacted":5,"reactionHeat":250,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":200,"vaporizingTemperature":500,"latentHeat":180,"specificHeatVapor":200,"chargeFeedRate":100,"initialTemperature":400,"dischargeTemperature":1200,"percentVaporized":10,"percentReacted":5,"reactionHeat":400,"additionalHeat":0}}&flueGas={"type":"Gas","flueGasTemperature":200,"excessAirPercentage":10,"combustionAirTemperature":150,"fuelTemperature":400,"CH4": 10, "C2H6":10, "N2":10, "H2":10, "C3H8":10,"C4H10_CnH2n":10,"H2O":10,"CO":10, "CO2":10,"SO2":0,"O2":10}

//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":200,"feedRate":100,"percentVapor":50,"initialTemperature":150,"dischargeTemperature":200,"specificHeatVapor":250,"specificHeatGas":250,"percentReacted":25,"reactionHeat":175,"additionalHeat":0}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":100, "latentHeat":170,"specificHeatLiquid":200,"meltingPoint":1210,"chargeFeedRate":150,"waterContentCharged":25,"waterContentDischarged":10,"initialTemperature":100,"dischargeTemperature":200,"waterVaporDischargeTemperature":180,"chargeMelted":0,"chargeReacted":5,"reactionHeat":250,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":200,"vaporizingTemperature":500,"latentHeat":180,"specificHeatVapor":200,"chargeFeedRate":100,"initialTemperature":400,"dischargeTemperature":1200,"percentVaporized":10,"percentReacted":5,"reactionHeat":400,"additionalHeat":0}}&flueGas={"type":"Solid","flueGasTemperature":200,"excessAirPercentage": 10,"combustionAirTemperature":600, "fuelTemperature":400, "moistureInAirComposition": 10,"ashDischargeTemperature": 300,"unburnedCarbonInAsh": 20,"carbon": 10,"hydrogen": 10,"sulphur":10,"inertAsh": 10,"o2":10,"moisture": 10,"nitrogen": 10}
