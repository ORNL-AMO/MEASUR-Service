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
		flueGas: req.query.flueGas.split(';'),
		chargeMaterials: req.query.chargeMaterials.split(';'),
		fuelCosts: parseFloat(req.query.fuelCosts),
		steamCosts: parseFloat(req.query.steamCosts),
		electricityCosts: parseFloat(req.query.electricityCosts)
		};
	var value = v.validate(processHeating, schema);




	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	
	//verifiedAtmosphere = VerifyAtmosphere(req,res);
    //verifiedAuxiliaryPowerLossArray = VerifyAuxiliaryPowerLoss(req, res);
    //verifiedLeakageLossArray = VerifyLeakageLossArray(req, res);
    
    
    
    
	var output = {
		EnergyUsed: 0,
		HeatingValue: 0,
		FuelUsed: 0,
		EnergyIntensityforChargeMaterials: 0
	};
	for(let i = 0; i < processHeating.chargeMaterials.length; i++)
	{
		processHeating.chargeMaterials[i] = processHeating.chargeMaterials[i].split(',');
		for(let z = 0; z < processHeating.chargeMaterials[i].length; z++)
		{
			if(processHeating.chargeMaterials[i][z].indexOf(':') != -1)
			{
				processHeating.chargeMaterials[i][z] = processHeating.chargeMaterials[i][z].split(':')[1];
			}
		}
		var type = processHeating.chargeMaterials[i][0];
		if(type.toLowerCase() == 'gas')
		{
			var value = null;
			if(processHeating.chargeMaterials[i].length >= 11)
				value = 
				{	
					thermicReactionType: parseInt(processHeating.chargeMaterials[i][1]),
				    specificHeatGas: parseFloat(processHeating.chargeMaterials[i][2]),
				    feedRate: parseFloat(processHeating.chargeMaterials[i][3]),
					percentVapor: parseFloat(processHeating.chargeMaterials[i][4]),
					initialTemperature: parseFloat(processHeating.chargeMaterials[i][5]),
					dischargeTemperature: parseFloat(processHeating.chargeMaterials[i][6]),
					specificHeatVapor: parseFloat(processHeating.chargeMaterials[i][7]),
					percentReacted: parseFloat(processHeating.chargeMaterials[i][8]),
					reactionHeat: parseFloat(processHeating.chargeMaterials[i][9]),
					additionalHeat: parseFloat(processHeating.chargeMaterials[i][10])
				};
			//TODO: Add in enum verification for thermic reaction type
			var validation = VerifyGasLoadCharge(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			processHeating.chargeMaterials[i] = phast.gasLoadChargeMaterial(value)/1000000;
		}
		else if(type.toLowerCase() == 'solid')
		{
			var value = null;
			if(processHeating.chargeMaterials[i].length >= 16)
				value = 
				{
					thermicReactionType: parseInt(processHeating.chargeMaterials[i][1]),
				    specificHeatSolid: parseFloat(processHeating.chargeMaterials[i][2]),
				    latentHeat: parseFloat(processHeating.chargeMaterials[i][3]),
					specificHeatLiquid: parseFloat(processHeating.chargeMaterials[i][4]),
				    meltingPoint: parseFloat(processHeating.chargeMaterials[i][5]),
					chargeFeedRate: parseFloat(processHeating.chargeMaterials[i][6]),
					waterContentCharged: parseFloat(processHeating.chargeMaterials[i][7]),
					waterContentDischarged: parseFloat(processHeating.chargeMaterials[i][8]),
					initialTemperature: parseFloat(processHeating.chargeMaterials[i][9]),
					dischargeTemperature: parseFloat(processHeating.chargeMaterials[i][10]),
					waterVaporDischargeTemperature: parseFloat(processHeating.chargeMaterials[i][11]),
					chargeMelted: parseFloat(processHeating.chargeMaterials[i][12]),
					chargeReacted: parseFloat(processHeating.chargeMaterials[i][13]),
					reactionHeat: parseFloat(processHeating.chargeMaterials[i][14]),
					additionalHeat: parseFloat(processHeating.chargeMaterials[i][15])
				};
			var validation = VerifySolidLoadCharge(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			processHeating.chargeMaterials[i] = phast.solidLoadChargeMaterial(value)/1000000;	
		}
		else if(type.toLowerCase() == 'liquid')
		{
			var value = processHeating.chargeMaterials[i];
			if(processHeating.chargeMaterials[i].length >= 13)
				value = {
					thermicReactionType: parseInt(processHeating.chargeMaterials[i][1]),
				    specificHeatLiquid: parseFloat(processHeating.chargeMaterials[i][2]),
				    vaporizingTemperature: parseFloat(processHeating.chargeMaterials[i][3]),
					latentHeat: parseFloat(processHeating.chargeMaterials[i][4]),
					specificHeatVapor: parseFloat(processHeating.chargeMaterials[i][5]),
					chargeFeedRate: parseFloat(processHeating.chargeMaterials[i][6]),
					initialTemperature: parseFloat(processHeating.chargeMaterials[i][7]),
					dischargeTemperature: parseFloat(processHeating.chargeMaterials[i][8]),
					percentVaporized: parseFloat(processHeating.chargeMaterials[i][9]),
					percentReacted: parseFloat(processHeating.chargeMaterials[i][10]),
					reactionHeat: parseFloat(processHeating.chargeMaterials[i][11]),
					additionalHeat: parseFloat(processHeating.chargeMaterials[i][12])
				};
			var validation = VerifyLiquidLoadCharge(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			processHeating.chargeMaterials[i] = phast.liquidLoadChargeMaterial(value)/1000000;
		}
	}

		processHeating.flueGas[0] = processHeating.flueGas[0].split(',');
		for(let z = 0; z < processHeating.flueGas[0].length; z++)
		{

			if(processHeating.flueGas[0][z].indexOf(':') != -1)
			{
				processHeating.flueGas[0][z] = processHeating.flueGas[0][z].split(':')[1];
			}
		}

		var type = processHeating.flueGas[0][0];
		if(type.toLowerCase() == 'gas')
		{
			var value = processHeating.flueGas[0];
			if(processHeating.flueGas[0].length >= 16)
				value = 
				{
					flueGasTemperature: parseFloat(processHeating.flueGas[0][1]),
				    excessAirPercentage: parseFloat(processHeating.flueGas[0][2]),
				    combustionAirTemperature: parseFloat(processHeating.flueGas[0][3]),
				    fuelTemperature: parseFloat(processHeating.flueGas[0][4]),
				    CH4: parseFloat(processHeating.flueGas[0][5]),
				    C2H6: parseFloat(processHeating.flueGas[0][6]),
				    N2: parseFloat(processHeating.flueGas[0][7]),
				    H2: parseFloat(processHeating.flueGas[0][8]),
				    C3H8: parseFloat(processHeating.flueGas[0][9]),
				    C4H10_CnH2n: parseFloat(processHeating.flueGas[0][10]),
				    H2O: parseFloat(processHeating.flueGas[0][11]),
				    CO: parseFloat(processHeating.flueGas[0][12]),
				    CO2: parseFloat(processHeating.flueGas[0][13]),
				    SO2: parseFloat(processHeating.flueGas[0][14]),
				    O2: parseFloat(processHeating.flueGas[0][15])
				};
			var validation = VerifyFlueGasByVolume(value);
			
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			processHeating.flueGas[0] = phast.flueGasLossesByVolume(value);
			output.HeatingValue = phast.flueGasByVolumeCalculateHeatingValue(value);
			output.HeatingValue = output.HeatingValue.heatingValue/1000000;
		}
		else
		{
			var value = processHeating.flueGas[0];
			if(processHeating.flueGas[0].length >= 15)
				value = 
				{
					flueGasTemperature: parseFloat(processHeating.flueGas[0][1]),
				    excessAirPercentage: parseFloat(processHeating.flueGas[0][2]),
				    combustionAirTemperature: parseFloat(processHeating.flueGas[0][3]),
				    fuelTemperature: parseFloat(processHeating.flueGas[0][4]),
				    moistureInAirComposition: parseFloat(processHeating.flueGas[0][5]),
				    ashDischargeTemperature: parseFloat(processHeating.flueGas[0][6]),
				    unburnedCarbonInAsh: parseFloat(processHeating.flueGas[0][7]),
				    carbon: parseFloat(processHeating.flueGas[0][8]),
				    hydrogen: parseFloat(processHeating.flueGas[0][9]),
				    sulphur: parseFloat(processHeating.flueGas[0][10]),
				    inertAsh: parseFloat(processHeating.flueGas[0][11]),
				    o2: parseFloat(processHeating.flueGas[0][12]),
				    moisture: parseFloat(processHeating.flueGas[0][13]),
				    nitrogen: parseFloat(processHeating.flueGas[0][14]),
				};

			var validation = VerifyFlueGasByMass(value);
			if(validation.errors != ""){
				res.json([validation.errors]);
				return;
			}
			processHeating.flueGas[0] = phast.flueGasLossesByMass(value);
			output.HeatingValue = phast.flueGasByMassCalculateHeatingValue(value);
			output.HeatingValue /= 1000000;
		}


	
	for(let i = 0; i < processHeating.chargeMaterials.length; i++)
	{
		output.EnergyUsed += processHeating.chargeMaterials[i];
	}
	output.EnergyUsed = output.EnergyUsed/processHeating.flueGas[0];
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

/*
//***************************************************************************
function VerifyAtmosphere (req, res)
{   
    var atmosphere = require('./src/furnace/atmosphere.js');
	
    atmosphere = atmosphere.CalculateAtmosphere(req, res);
	return atmosphere;
}
//***************************************************************************
function VerifyAuxiliaryPowerLoss(req, res)
{
	//[[1,2,3,4,5],[1,2,3,4,5]]
    var v = new Validator();
	var auxiliaryPowerLossArray = JSON.parse(auxiliaryPowerLossArray);
    var auxiliaryPowerLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/AuxiliaryPowerLossInput.json"));
    
    var validatedAuxilaryPowerLossArray = [];

    
    
    for(let x = 0; x < auxiliaryPowerLossArray.length; x++)
    {
        currentArray = auxiliaryPowerLossArray[x];
        
        if(currentArray.length < 5)
        {
            res.send("Not enough values passed into element " + x + "of the auxiliaryPowerLossArray");
            return;
        }
        else if(currentArray.length > 5)
        {
            res.send("Too many values passed into element " + x + "of the auxiliaryPowerLossArray");
            return;
        }
        
        
        var auxiliaryPowerLoss = 
        {
            motorPhase: currentArray[0],
            supplyVoltage: currentArray[1],
            avgCurrent: currentArray[2],
            powerFactor: currentArray[3],
            operatingTime: currentArray[4]
        };
        
        
        var auxiliaryPowerLossValidate = v.validate(auxiliaryPowerLoss,auxiliaryPowerLossSchema);
        
        
        if(auxiliaryPowerLossValidate.errors != "")
        {
            res.json([value.errorss]);
            return;
        }
        
        validatedAuxilaryPowerLossArray.push(auxiliaryPowerLoss);
    }
    
    return validatedAuxilaryPowerLossArray;
}

//**************************************************************************
function VerifyLeakageLossArray(req, res)
{
    var v = new Validator();
    var leakageLossArray = JSON.parse(leakageLossArray);
    var leakageLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/leakageLossesInput.json");
    
    var validatedLeakageLossArray = [];
    
    for(let x = 0; x < leakageLossArray.length; x++)
    {
        currentArray = leakageLossArray[x];
        
        if(currentArray.length < 7)
        {
            res.send("Not enough values passed into element " + x + "of the leakageLossArray");
            return;
        }
        else if(currentArray.length > 7)
        {
            res.send("Too many values passed into element " + x + "of the leakageLossArray");
            return;
        }
        
        
        var leakageLosses = 
        {
            draftPressure: currentArray[0],
            openingArea: currentArray[1],
            leakageGasTemperature: currentArray[2],
            ambientTemperature: currentArray[3],
            coefficient: currentArray[4],
            specificGravity: currentArray[5],
            correctionFactor: currentArray[6]
        };
        
        
        var leakageLossValidate = v.validate(leakageLosses,leakageLossSchema);
        
        
        if(leakageLossValidate.errors != "")
        {
            res.json([value.errorss]);
            return;
        }
        
        validatedLeakageLossArray.push();
    }
    
    return validatedLeakageLossArray;
}

//**************************************************************************



function VerifyFixtureLossArray(req, res)
{
    var fixtureLossArray = JSON.parse(fixtureLossArray);
    var fixtureLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/FixtureLossInput.json");
    
    return validatedFixtureLossArray;
}
*/


























//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials='type':Gas,'thermicReactionType':0,'specificHeatType':200,'feedRate':100,'percentVapor':50,'initialTemperature':150,'dischargeTemperature':200,'specificHeatVapor':250,'percentReacted':25,'reactionHeat':175,'additionalHeat':0;'type':Solid,'thermicReactionType':0,'specificHeatSolid':100, 'latentHeat':170,'specificHeatLiquid':200,'meltingPoint':1210,'chargeFeedRate':150,'waterContentCharged':25,'waterContentDischarged':10,'initialTemperature':100,'dischargeTemperature':200,'waterVaporDischargeTemperature':180,'chargeMelted':0,'chargeReacted':5,'reactionHeat':250,'additionalHeat':0;'type':Liquid,'thermicReactionType': 0, specificHeatLiquid':200,'vaporizingTemperature':500,'latentHeat':180,'specificHeatVapor':200,'chargeFeedRate':100,'initialTemperature':400,'dischargeTemperature':1200,'percentVaporized':10,'percentReacted':5,'reactionHeat':400,'additionalHeat':0&flueGas='type':Gas,'flueGasTemperature':200,'excessAirPercentage':10,'combustionAirTemperature':150,fuelTemperature:400,10,10,10,10,10,10,10,10, 10,0,10

//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials='type':Gas,'thermicReactionType':0,'specificHeatType':200,'feedRate':100,'percentVapor':50,'initialTemperature':150,'dischargeTemperature':200,'specificHeatVapor':250,'percentReacted':25,'reactionHeat':175,'additionalHeat':0;'type':Solid,'thermicReactionType':0,'specificHeatSolid':100, 'latentHeat':170,'specificHeatLiquid':200,'meltingPoint':1210,'chargeFeedRate':150,'waterContentCharged':25,'waterContentDischarged':10,'initialTemperature':100,'dischargeTemperature':200,'waterVaporDischargeTemperature':180,'chargeMelted':0,'chargeReacted':5,'reactionHeat':250,'additionalHeat':0;'type':Liquid,'thermicReactionType': 0, specificHeatLiquid':200,'vaporizingTemperature':500,'latentHeat':180,'specificHeatVapor':200,'chargeFeedRate':100,'initialTemperature':400,'dischargeTemperature':1200,'percentVaporized':10,'percentReacted':5,'reactionHeat':400,'additionalHeat':0&flueGas='type':solid, 200, 10, 150, 400, 10, 250, 15, 10, 10, 10, 30, 20, 10, 10
