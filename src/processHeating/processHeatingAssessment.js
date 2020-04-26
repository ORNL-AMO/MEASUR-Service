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
		//EnergyUsed: 0,
        ChargeMaterials: 0,
		HeatingValue: 0,
		//FuelUsed: 0,
		EnergyIntensityforChargeMaterials: 0,
        atmosphereLosses: Atmosphere(req, res),
        auxilaryPowerLosses: AuxiliaryPowerLoss(req, res),
        leakageLosses: LeakageLoss(req, res),
        fixtureLosses: FixtureLoss(req, res),
        wallLosses: WallLoss(req, res),
        openingLosses: OpeningLoss(req, res),
        coolingLosses: CoolingLoss(req, res),
        flueGasLosses: 0,
        totalLosses: 0,
        grossHeatInput: 0
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
		//console.log("energyUsed: " + energyUsed);
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
			output.flueGasLosses += phast.flueGasLossesByVolume(value);
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

            output.flueGasLosses += phast.flueGasLossesByMass(value);
			output.HeatingValue = phast.flueGasByMassCalculateHeatingValue(value);
			output.HeatingValue /= 1000000;
		}


	
	output.ChargeMaterials += energyUsed;
	
	//output.ChargeMaterials = output.ChargeMaterials/processHeating.flueGas;
	//output.FuelUsed = output.ChargeMaterials;
    
    
    
    output.totalLosses = output.ChargeMaterials + output.atmosphereLosses + output.auxilaryPowerLosses + output.leakageLosses + output.fixtureLosses;
    
    output.grossHeatInput = output.totalLosses + output.flueGasLosses;
    
    //console.log(output.totalLosses);
    
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


//***************************************************************************
function Atmosphere (req, res)
{   
    var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/atmosphereInput.json"));

	var atmosphere = {
        inletTemperature: parseFloat(req.query.inletTemperature),
        outletTemperature: parseFloat(req.query.outletTemperature),
        flowRate: parseFloat(req.query.flowRate),
        correctionFactor: parseFloat(req.query.correctionFactor),
        specificHeat: parseFloat(req.query.specificHeat)
	};
	
	var value = v.validate(atmosphere, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var atmosphereLosses = phast.atmosphere(atmosphere);
    
    //console.log(atmosphereLosses);
	return atmosphereLosses;
}





//***************************************************************************
//input [[motorPhase, supplyVoltage, avgCurrent, powerFactor, operatingTime]]
function AuxiliaryPowerLoss(req, res)
{
    var v = new Validator();
	var auxiliaryPowerLossArray = JSON.parse(req.query.auxiliaryPowerLossArray);
    var auxiliaryPowerLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/auxiliaryPowerLossInput.json"));
    
    var totalAuxilaryPowerLoss = 0;

    
    for(let x = 0; x < auxiliaryPowerLossArray.length; x++)
    {
        //currentArray = auxiliaryPowerLossArray[x];
        auxiliaryPowerLoss = auxiliaryPowerLossArray[x];
        /*
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
        
        */
        var auxiliaryPowerLossValidate = v.validate(auxiliaryPowerLoss,auxiliaryPowerLossSchema);
        
        
        if(auxiliaryPowerLossValidate.errors != "")
        {
            res.json([auxiliaryPowerLossValidate.errors]);
            return;
        }
        
        totalAuxilaryPowerLoss += phast.auxiliaryPowerLoss(auxiliaryPowerLoss);
        //console.log(phast.auxiliaryPowerLoss(auxiliaryPowerLoss));
    }
    
    //console.log(totalAuxilaryPowerLoss);
    return totalAuxilaryPowerLoss;
}




//**************************************************************************
//input [[draftPressure, openingArea, leakageGasTemperature, ambientTemperature, coefficient, specificGravity, correctionFactor]]
function LeakageLoss(req, res)
{
    var v = new Validator();
    var leakageLossArray = JSON.parse(req.query.leakageLossArray);
    var leakageLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/leakageLossesInput.json"));
    
    var totalLeakageLoss = 0;
    
    for(let x = 0; x < leakageLossArray.length; x++)
    {
        leakageLosses = leakageLossArray[x];
        /*currentArray = leakageLossArray[x];
        
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
        */
        
        var leakageLossValidate = v.validate(leakageLosses,leakageLossSchema);
        
        
        if(leakageLossValidate.errors != "")
        {
            res.json([leakageLossValidate.errors]);
            return;
        }
        
        totalLeakageLoss += phast.leakageLosses(leakageLosses);
    }
    //console.log(totalLeakageLoss);
    return totalLeakageLoss;
}

//**************************************************************************
// input [[specificHeat, feedRate, initialTemperature, finalTemperature, correctionFactor]]
function FixtureLoss(req, res)
{
    var v = new Validator();
    var fixtureLossArray = JSON.parse(req.query.fixtureLossArray);
    var fixtureLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/fixtureLosses.json"));
    
    var totalFixtureLoss = 0;
    
    for(let x = 0; x < fixtureLossArray.length; x++)
    {
        fixtureLosses = fixtureLossArray[x];
        /*currentArray = fixtureLossArray[x];
        
        if(currentArray.length < 5)
        {
            res.send("Not enough values passed into element " + x + "of the fixtureLossArray");
            return;
        }
        else if(currentArray.length > 5)
        {
            res.send("Too many values passed into element " + x + "of the fixtureLossArray");
            return;
        }
        
        
        var fixtureLosses = 
        {
            specificHeat: currentArray[0],
            feedRate: currentArray[1],
            initialTemperature: currentArray[2],
            finalTemperature: currentArray[3],
            correctionFactor: currentArray[4]
        };
        */
        
        var fixtureLossValidate = v.validate(fixtureLosses,fixtureLossSchema);
        
        
        if(fixtureLossValidate.errors != "")
        {
            res.json([fixtureLossValidate.errors]);
            return;
        }
        
        totalFixtureLoss += phast.fixtureLosses(fixtureLosses);
    }
    //console.log(totalFixtureLoss);
    return totalFixtureLoss;
}

//*******************************************************************************************************
//TODO change to both circular and quad change viewFactor calculation to use the bindings add to total ambientTemperature insideTemperature check
//input [[emissivity, diameter, thickness, ratio, ambientTemperature, insideTemperature, percentTimeOpen, viewFactor]]
function OpeningLoss(req, res)
{
    var v = new Validator();
    var openingLossArray = JSON.parse(req.query.openingLossArray);
    var openingLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/openingLosses.json"));
    
    var totalOpeningLoss = 0;
    
    for(let x = 0; x < openingLossArray.length; x++)
    {
        openingLosses = openingLossArray[x];
        /*currentArray = openingLossArray[x];
        
        if(currentArray.length < 8)
        {
            res.send("Not enough values passed into element " + x + "of the openingLossArray");
            return;
        }
        else if(currentArray.length > 8)
        {
            res.send("Too many values passed into element " + x + "of the openingLossArray");
            return;
        }
        
        
        var openingLosses = 
        {
            emissivity: currentArray[0],
            diameter: currentArray[1],
            thickness: currentArray[2],
            ratio: currentArray[3],
            ambientTemperature: currentArray[4],
            insideTemperature: currentArray[5],
            percentTimeOpen: currentArray[6],
            viewFactor: currentArray[7]
        };*/
        
        
        var openingLossValidate = v.validate(openingLosses, openingLossSchema);
        
        
        if(openingLossValidate.errors != "")
        {
            res.json([openingLossValidate.errors]);
            return;
        }
        
        totalOpeningLoss += phast.openingLossesCircular(openingLosses);
    }
    
    return totalOpeningLoss;
}

function WallLoss(req, res)
{
    var v = new Validator();
    var wallLossArray = JSON.parse(req.query.wallLossArray);
    var wallLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/wallLosses.json"));
    
    var totalWallLoss = 0;
    
    for(let x = 0; x < wallLossArray.length; x++)
    {
        wallLosses = wallLossArray[x];
        /*currentArray = wallLossArray[x];
        
        if(currentArray.length < 7)
        {
            res.send("Not enough values passed into element " + x + "of the wallLossArray");
            return;
        }
        else if(currentArray.length > 7)
        {
            res.send("Too many values passed into element " + x + "of the wallLossArray");
            return;
        }
        
        
        var wallLosses = 
        {
            surfaceArea: currentArray[0],
            ambientTemperature: currentArray[1],
            surfaceTemperature: currentArray[2],
            windVelocity: currentArray[3],
            surfaceEmissivity: currentArray[4],
            conditionFactor: currentArray[5],
            correctionFactor: currentArray[6]
        };
        
        */
        var wallLossValidate = v.validate(wallLosses, wallLossSchema);
        
        if(wallLosses.surfaceTemperature < wallLosses.ambientTemperature)
        {
            res.json(["error"]);
            return;
        }
        if(wallLossValidate.errors != "")
        {
            res.json([wallLossValidate.errors]);
            return;
        }
        
        totalWallLoss += phast.wallLosses(wallLosses);
    }
    
    return totalWallLoss;
}
//TODO extended surface and cooling
function CoolingLoss(req, res)
{
    var v = new Validator();
    var coolingLossArray = JSON.parse(req.query.coolingLossArray);
    var coolingLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/waterCoolingLossesInput.json"));
    
    var totalCoolingLoss = 0;
    
    for(let x = 0; x < coolingLossArray.length; x++)
    {
        coolingLosses = coolingLossArray[x];

        var coolingLossValidate = v.validate(coolingLosses, coolingLossSchema);
        
        
        if(coolingLossValidate.errors != "")
        {
            res.json([coolingLossValidate.errors]);
            return;
        }
        
        totalCoolingLoss += phast.waterCoolingLosses(coolingLosses);
    }
    
    return totalCoolingLoss;
}


//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":200,"feedRate":100,"percentVapor":50,"initialTemperature":150,"dischargeTemperature":200,"specificHeatVapor":250,"specificHeatGas":250,"percentReacted":25,"reactionHeat":175,"additionalHeat":0}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":100, "latentHeat":170,"specificHeatLiquid":200,"meltingPoint":1210,"chargeFeedRate":150,"waterContentCharged":25,"waterContentDischarged":10,"initialTemperature":100,"dischargeTemperature":200,"waterVaporDischargeTemperature":180,"chargeMelted":0,"chargeReacted":5,"reactionHeat":250,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":200,"vaporizingTemperature":500,"latentHeat":180,"specificHeatVapor":200,"chargeFeedRate":100,"initialTemperature":400,"dischargeTemperature":1200,"percentVaporized":10,"percentReacted":5,"reactionHeat":400,"additionalHeat":0}}&flueGas={"type":"Gas","flueGasTemperature":200,"excessAirPercentage":10,"combustionAirTemperature":150,"fuelTemperature":400,"CH4": 10, "C2H6":10, "N2":10, "H2":10, "C3H8":10,"C4H10_CnH2n":10,"H2O":10,"CO":10, "CO2":10,"SO2":0,"O2":10}

//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":200,"feedRate":100,"percentVapor":50,"initialTemperature":150,"dischargeTemperature":200,"specificHeatVapor":250,"specificHeatGas":250,"percentReacted":25,"reactionHeat":175,"additionalHeat":0}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":100, "latentHeat":170,"specificHeatLiquid":200,"meltingPoint":1210,"chargeFeedRate":150,"waterContentCharged":25,"waterContentDischarged":10,"initialTemperature":100,"dischargeTemperature":200,"waterVaporDischargeTemperature":180,"chargeMelted":0,"chargeReacted":5,"reactionHeat":250,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":200,"vaporizingTemperature":500,"latentHeat":180,"specificHeatVapor":200,"chargeFeedRate":100,"initialTemperature":400,"dischargeTemperature":1200,"percentVaporized":10,"percentReacted":5,"reactionHeat":400,"additionalHeat":0}}&flueGas={"type":"Solid","flueGasTemperature":200,"excessAirPercentage": 10,"combustionAirTemperature":600, "fuelTemperature":400, "moistureInAirComposition": 10,"ashDischargeTemperature": 300,"unburnedCarbonInAsh": 20,"carbon": 10,"hydrogen": 10,"sulphur":10,"inertAsh": 10,"o2":10,"moisture": 10,"nitrogen": 10}
