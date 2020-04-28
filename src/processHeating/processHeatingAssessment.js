var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

var globalErrors = [];


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
        ChargeMaterials: 0,
		HeatingValue: 0,
		EnergyIntensityforChargeMaterials: 0,
        atmosphereLosses: Atmosphere(req),
        auxiliaryPowerLosses: AuxiliaryPowerLoss(req),
        leakageLosses: LeakageLoss(req),
        fixtureLosses: FixtureLoss(req),
        wallLosses: WallLoss(req),
        openingLosses: OpeningLoss(req),
        coolingLosses: CoolingLoss(req),
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
    
    
    
    output.totalLosses = output.ChargeMaterials + output.atmosphereLosses + output.auxiliaryPowerLosses + output.leakageLosses + output.fixtureLosses;
    
    output.grossHeatInput = output.totalLosses + output.flueGasLosses;
    
    //console.log(output.totalLosses);
    
    if(globalErrors != "")
        res.json(globalErrors);
    else  
        res.json([output]);
    
    globalErrors = [];
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
function Atmosphere(req)
{   
    
    if(req.query.atmosphereLossObject == undefined)
        return 0;
    else if(!TestJSON(req.query.atmosphereLossObject))
    {
        globalErrors.push("The atmosphereLossObject was not passed in as a JSON object.");
        return 0;
    }
    
    var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/atmosphereInput.json"));
	var atmosphere = JSON.parse(req.query.atmosphereLossObject);

	var value = v.validate(atmosphere, schema);
	if(value.errors != "")
	{
		globalErrors.push(value.errors);
		return 0;
	}
	var atmosphereLosses = phast.atmosphere(atmosphere);
    
    //console.log(atmosphereLosses);
	return atmosphereLosses;
}





//***************************************************************************
//input [[motorPhase, supplyVoltage, avgCurrent, powerFactor, operatingTime]]
function AuxiliaryPowerLoss(req)
{
    
    if(req.query.auxiliaryPowerLossArray == undefined)
        return 0;
    else if(!TestJSON(req.query.auxiliaryPowerLossArray))
    {
        globalErrors.push("The auxiliaryPowerLossArray was not passed in as a JSON object array.");
        return 0;
    }
    
    var v = new Validator();
	var auxiliaryPowerLossArray = JSON.parse(req.query.auxiliaryPowerLossArray);
    var auxiliaryPowerLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/auxiliaryPowerLossInput.json"));
    
    var totalAuxiliaryPowerLoss = 0;

    
    for(let x = 0; x < auxiliaryPowerLossArray.length; x++)
    {

        auxiliaryPowerLoss = auxiliaryPowerLossArray[x];
        var auxiliaryPowerLossValidate = v.validate(auxiliaryPowerLoss,auxiliaryPowerLossSchema);
        
        
        if(auxiliaryPowerLossValidate.errors != "")
        {
            globalErrors.push(auxiliaryPowerLossValidate.errors);
            return 0;
        }
        
        totalAuxiliaryPowerLoss += phast.auxiliaryPowerLoss(auxiliaryPowerLoss);
    }
    
    //console.log(totalAuxiliaryPowerLoss);
    return totalAuxiliaryPowerLoss;
}




//**************************************************************************
//input [[draftPressure, openingArea, leakageGasTemperature, ambientTemperature, coefficient, specificGravity, correctionFactor]]
function LeakageLoss(req)
{
    if(req.query.leakageLossArray == undefined)
        return 0;
    else if(!TestJSON(req.query.leakageLossArray))
    {
        globalErrors.push("The leakageLossArray was not passed in as a JSON object array.");
        return 0;
    }
    
    var v = new Validator();
    var leakageLossArray = JSON.parse(req.query.leakageLossArray);
    var leakageLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/leakageLossesInput.json"));
    
    var totalLeakageLoss = 0;
    
    for(let x = 0; x < leakageLossArray.length; x++)
    {
        leakageLosses = leakageLossArray[x];

        var leakageLossValidate = v.validate(leakageLosses,leakageLossSchema);
        
        
        if(leakageLossValidate.errors != "")
        {
            globalErrors.push(leakageLossValidate.errors);
            return 0;
        }
        
        totalLeakageLoss += phast.leakageLosses(leakageLosses);
    }
    //console.log(totalLeakageLoss);
    return totalLeakageLoss;
}

//**************************************************************************
// input [[specificHeat, feedRate, initialTemperature, finalTemperature, correctionFactor]]
function FixtureLoss(req)
{
    if(req.query.fixtureLossArray == undefined)
        return 0;
    else if(!TestJSON(req.query.fixtureLossArray))
    {
        globalErrors.push("The auxiliaryPowerLossArray was not passed in as a JSON object array.");
        return 0;
    }
    
    var v = new Validator();
    var fixtureLossArray = JSON.parse(req.query.fixtureLossArray);
    var fixtureLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/fixtureLosses.json"));
    
    var totalFixtureLoss = 0;
    
    for(let x = 0; x < fixtureLossArray.length; x++)
    {
        fixtureLosses = fixtureLossArray[x];

        
        var fixtureLossValidate = v.validate(fixtureLosses,fixtureLossSchema);
        
        
        if(fixtureLossValidate.errors != "")
        {
            globalErrors.push(fixtureLossValidate.errors);
            return 0;
        }
        
        totalFixtureLoss += phast.fixtureLosses(fixtureLosses);
    }
    //console.log(totalFixtureLoss);
    return totalFixtureLoss;
}

function WallLoss(req)
{
    
    if(req.query.wallLossArray == undefined)
        return 0;
    else if(!TestJSON(req.query.wallLossArray))
    {
        globalErrors.push("The wallLossArray was not passed in as a JSON object array.");
        return 0;
    }
    
    var v = new Validator();
    var wallLossArray = JSON.parse(req.query.wallLossArray);
    var wallLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/wallLosses.json"));
    
    var totalWallLoss = 0;
    
    for(let x = 0; x < wallLossArray.length; x++)
    {
        wallLosses = wallLossArray[x];

        var wallLossValidate = v.validate(wallLosses, wallLossSchema);
        
        if(wallLosses.surfaceTemperature < wallLosses.ambientTemperature)
        {
            globalErrors.push("ERROR: surfaceTemperature is greater than ambientTemperature in element " + x + "of the wallLossArray.");
            return 0;
        }
        if(wallLossValidate.errors != "")
        {
            globalErrors.push(wallLossValidate.errors);
            return 0;
        }
        
        totalWallLoss += phast.wallLosses(wallLosses);
    }
    
    return totalWallLoss;
}

//*******************************************************************************************************
//input [[emissivity, diameter, thickness, ratio, ambientTemperature, insideTemperature, percentTimeOpen, viewFactor]]
function OpeningLoss(req)
{
    if(req.query.openingLossArray == undefined)
        return 0;
    else if(!TestJSON(req.query.openingLossArray))
    {
        globalErrors.push("The openingLossArray was not passed in as a JSON object array.");
        return 0;
    }
    
    var v = new Validator();
    var openingLossArray = JSON.parse(req.query.openingLossArray);
    var openingLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/openingLosses.json"));
    
    var totalOpeningLoss = 0;
    
    for(let x = 0; x < openingLossArray.length; x++)
    {
        openingLosses = openingLossArray[x];

        var openingLossValidate = v.validate(openingLosses, openingLossSchema);

        if(openingLosses.ambientTemperature > openingLosses.insideTemperature)
        {
            globalErrors.push("ERROR: ambientTemperature is greater than insideTemperature in element " + x + "of the openingLossArray.");
            return 0;
        }
        if(openingLossValidate.errors != "")
        {
            globalErrors.push(openingLossValidate.errors);
            return 0;
        }
        
        if(openingLosses.diameter != undefined)
        {
            if(openingLosses.width != undefined || openingLosses.length != undefined)
            {
                globalErrors.push("ERROR: both diameter and length or both diameter and width are defined for element " + x + "of the openingLossArray, please only pass in diameter or length and width.");
                return 0;
            }
            
            totalOpeningLoss += phast.openingLossesCircular(openingLosses);
        }
        else if(openingLosses.width != undefined && openingLosses.length != undefined)
        {
            if(openingLosses.diameter != undefined)
            {
                globalErrors.push("ERROR: both diameter and length or both diameter and width are defined for element " + x + "of the openingLossArray, please only pass in diameter or length and width.");
                return 0;
            }
            
            totalOpeningLoss += phast.openingLossesQuad(openingLosses);
        }
    }
    
    return totalOpeningLoss;
}


function CoolingLoss(req)
{
    if(req.query.coolingLossArray == undefined)
        return 0;
    else if(!TestJSON(req.query.coolingLossArray))
    {
        globalErrors.push("The coolingLossArray was not passed in as a JSON object array.");
        return 0;
    }
    
    var v = new Validator();
    var coolingLossArray = JSON.parse(req.query.coolingLossArray);
    
    var waterCoolingLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/waterCoolingLossesInput.json"));
    var liquidCoolingLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/liquidCoolingLossesInput.json"));
    var gasCoolingLossSchema = JSON.parse(fs.readFileSync(inputDirectory+"/gasCoolingLossesInput.json"));
    
    var totalCoolingLoss = 0;
    
    for(let x = 0; x < coolingLossArray.length; x++)
    {
        coolingLosses = coolingLossArray[x];
        
        if(coolingLosses.type == "water")
        {
            //console.log("water");
            var waterCoolingLossValidate = v.validate(coolingLosses, waterCoolingLossSchema);
            
            if(waterCoolingLossValidate.errors != "")
            {
                globalErrors.push(waterCoolingLossValidate.errors);
                return 0;
            }
            
            totalCoolingLoss += phast.waterCoolingLosses(coolingLosses);
            //console.log("water " + totalCoolingLoss);
        }
        else if(coolingLosses.type == "liquid")
        {
            //console.log("liquid");
            var liquidCoolingLossValidate = v.validate(coolingLosses, liquidCoolingLossSchema);
            
            if(liquidCoolingLossValidate.errors != "")
            {
                globalErrors.push(liquidCoolingLossValidate.errors);
                return 0;
            }
            
            totalCoolingLoss += phast.liquidCoolingLosses(coolingLosses);
            //console.log("liquid " + totalCoolingLoss);
        }
        else if(coolingLosses.type == "gas")
        {
            //console.log("gas");
            var gasCoolingLossValidate = v.validate(coolingLosses, gasCoolingLossSchema);
            
            if(gasCoolingLossValidate.errors != "")
            {
                globalErrors.push(gasCoolingLossValidate.errors);
                return 0;
            }
            
            totalCoolingLoss += phast.gasCoolingLosses(coolingLosses);
            //console.log("gas " + totalCoolingLoss);
        }
        else
        {
            globalErrors.push("ERROR: Invalid type supplied for element " + x + " of the coolingLossArray");
            return 0;
        }

    }
    
    return totalCoolingLoss;
}


//amo test input
//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":0.5,"feedRate":1000,"percentVapor":15,"initialTemperature":80,"dischargeTemperature":1150,"specificHeatVapor":0.5,"specificHeatGas":0.24,"percentReacted":100,"reactionHeat":80,"additionalHeat":5000}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":0.15, "latentHeat":60,"specificHeatLiquid":0.481,"meltingPoint":2900,"chargeFeedRate":10000,"waterContentCharged":0.1,"waterContentDischarged":0,"initialTemperature":70,"dischargeTemperature":2200,"waterVaporDischargeTemperature":500,"chargeMelted":0,"chargeReacted":1,"reactionHeat":100,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":0.48,"vaporizingTemperature":240,"latentHeat":250,"specificHeatVapor":0.25,"chargeFeedRate":1000,"initialTemperature":70,"dischargeTemperature":320,"percentVaporized":100,"percentReacted":25,"reactionHeat":50,"additionalHeat":0}}&flueGas={"type":"Solid","flueGasTemperature":700,"excessAirPercentage": 9.0,"combustionAirTemperature":125, "fuelTemperature":70, "moistureInAirComposition": 1.0,"ashDischargeTemperature": 100,"unburnedCarbonInAsh": 1.5,"carbon": 75.0,"hydrogen": 5.0,"sulphur":1.0,"inertAsh": 9.0,"o2":7.0,"moisture": 0.0,"nitrogen": 1.5}&atmosphereLossObject= {"inletTemperature":100.0, "outletTemperature":1400.0, "flowRate":1200.0, "correctionFactor":1.0, "specificHeat":0.02}&auxiliaryPowerLossArray=[{"motorPhase":3, "supplyVoltage":460, "avgCurrent":19, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":19, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.55, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.55, "operatingTime":75}]&wallLossArray=[{"surfaceArea":500, "ambientTemperature":80, "surfaceTemperature":225, "windVelocity":10, "surfaceEmissivity":0.9, "conditionFactor":1.394, "correctionFactor":1}]&openingLossArray=[{"emissivity": 0.95, "diameter": 12, "thickness": 9, "ratio": 1.33, "ambientTemperature": 75,"insideTemperature": 1600, "percentTimeOpen": 100, "viewFactor": 0.70}, {"emissivity": 0.95, "length": 48, "width": 15, "thickness": 9, "ratio": 1.67, "ambientTemperature": 75,"insideTemperature": 1600, "percentTimeOpen": 20, "viewFactor": 0.64}]&coolingLossArray=[{"type":"water", "flowRate": 100, "initialTemperature": 80, "outletTemperature": 120, "correctionFactor": 1},{ "type":"liquid",       "flowRate": 100, "density": 9.35, "initialTemperature": 80, "outletTemperature": 210,"specificHeat": 0.52, "correctionFactor": 1.0}, {"type":"gas","flowRate": 2500, "initialTemperature": 80, "finalTemperature": 280, "specificHeat": 0.02, "correctionFactor": 1.0,"gasDensity": 1}]&leakageLossArray=[{"draftPressure":0.1,"openingArea":3,"leakageGasTemperature":1600,"ambientTemperature":80,"coefficient":0.8052,"specificGravity":1.02,"correctionFactor":1.0}]&fixtureLossArray=[{"specificHeat":0.122,"feedRate":1250.0, "initialTemperature":300, "finalTemperature":1800.0,"correctionFactor":1.0}]

//broken input to test jsonTest
//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":0.5,"feedRate":1000,"percentVapor":15,"initialTemperature":80,"dischargeTemperature":1150,"specificHeatVapor":0.5,"specificHeatGas":0.24,"percentReacted":100,"reactionHeat":80,"additionalHeat":5000}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":0.15, "latentHeat":60,"specificHeatLiquid":0.481,"meltingPoint":2900,"chargeFeedRate":10000,"waterContentCharged":0.1,"waterContentDischarged":0,"initialTemperature":70,"dischargeTemperature":2200,"waterVaporDischargeTemperature":500,"chargeMelted":0,"chargeReacted":1,"reactionHeat":100,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":0.48,"vaporizingTemperature":240,"latentHeat":250,"specificHeatVapor":0.25,"chargeFeedRate":1000,"initialTemperature":70,"dischargeTemperature":320,"percentVaporized":100,"percentReacted":25,"reactionHeat":50,"additionalHeat":0}}&flueGas={"type":"Solid","flueGasTemperature":700,"excessAirPercentage": 9.0,"combustionAirTemperature":125, "fuelTemperature":70, "moistureInAirComposition": 1.0,"ashDischargeTemperature": 100,"unburnedCarbonInAsh": 1.5,"carbon": 75.0,"hydrogen": 5.0,"sulphur":1.0,"inertAsh": 9.0,"o2":7.0,"moisture": 0.0,"nitrogen": 1.5}&atmosphereLossObject= {"inletTemperature":100.0, "outletTemperature":1400.0, "flowRate":1200.0, "correctionFactor":1.0, "specificHeat":0.02&auxiliaryPowerLossArray=[{"motorPhase":3, "supplyVoltage":460, "avgCurrent":19, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":19, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.55, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.55, "operatingTime":75}&wallLossArray=[{"surfaceArea":500, "ambientTemperature":80, "surfaceTemperature":225, "windVelocity":10, "surfaceEmissivity":0.9, "conditionFactor":1.394, "correctionFactor":1}&openingLossArray=[{"emissivity": 0.95, "diameter": 12, "thickness": 9, "ratio": 1.33, "ambientTemperature": 75,"insideTemperature": 1600, "percentTimeOpen": 100, "viewFactor": 0.70}&coolingLossArray=[{"flowRate": 100, "initialTemperature": 80, "outletTemperature": 120, "correctionFactor": 1}&leakageLossArray=[{"draftPressure":0.1,"openingArea":3,"leakageGasTemperature":1600,"ambientTemperature":80,"coefficient":0.8052,"specificGravity":1.02,"correctionFactor":1.0}&fixtureLossArray=[{"specificHeat":0.122,"feedRate":1250.0, "initialTemperature":300, "finalTemperature":1800.0,"correctionFactor":1.0}

//input to test optional parameters
//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066

//error for flue gas missing
//https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":0.5,"feedRate":1000,"percentVapor":15,"initialTemperature":80,"dischargeTemperature":1150,"specificHeatVapor":0.5,"specificHeatGas":0.24,"percentReacted":100,"reactionHeat":80,"additionalHeat":5000}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":0.15, "latentHeat":60,"specificHeatLiquid":0.481,"meltingPoint":2900,"chargeFeedRate":10000,"waterContentCharged":0.1,"waterContentDischarged":0,"initialTemperature":70,"dischargeTemperature":2200,"waterVaporDischargeTemperature":500,"chargeMelted":0,"chargeReacted":1,"reactionHeat":100,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":0.48,"vaporizingTemperature":240,"latentHeat":250,"specificHeatVapor":0.25,"chargeFeedRate":1000,"initialTemperature":70,"dischargeTemperature":320,"percentVaporized":100,"percentReacted":25,"reactionHeat":50,"additionalHeat":0}}
