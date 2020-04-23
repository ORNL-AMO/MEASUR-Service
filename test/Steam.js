
var expect = require('chai').expect;
var request = require('request');

describe('Steam Modeler Unit Test', function()
{	
    it('Steam Modeler Unit Test 1', function(done) {
        request('https://localhost:8080/steam/SteamAssessment?baselinePowerDemand=1&isBaselineCalc=true&operationsInput={"sitePowerImport":18000000,"makeUpWaterTemperature":283.15,"operatingHoursPerYear":8000,"fuelCosts":0.000005478,"electricityCosts":1.39E-05,"makeUpWaterCosts":0.66}&boilerInput={"fuelType":1,"fuel":1,"combustionEfficiency":85,"blowdownRate":2,"blowdownFlashed":true,"preheatMakeupWater":true,"steamTemperature":514.2,"deaeratorVentRate":0.1,"deaeratorPressure":0.204747, "approachTemperature": 10}&headerInput={"highPressureHeader":{"pressure":1.136,"processSteamUsage":22680,"condensationRecoveryRate":50,"heatLoss":0.1,"condensateReturnTemperature":338.7,"flashCondensateReturn":true}}&turbineInput={"highToLowTurbine":{"isentropicEfficiency":2,"generationEfficiency":2,"condenserPressure":2,"operationType":2,"operationValue1":2,"operationValue2":2,"useTurbine":true},"highToMediumTurbine":{"isentropicEfficiency":3,"generationEfficiency":3,"condenserPressure":3,"operationType":3,"operationValue1":3,"operationValue2":3,"useTurbine":true},"mediumToLowTurbine":{"isentropicEfficiency":4,"generationEfficiency":4,"condenserPressure":4,"operationType":4,"operationValue1":4,"operationValue2":4,"useTurbine":true},"condensingTurbine":{"isentropicEfficiency":1,"generationEfficiency":1,"condenserPressure":1,"operationType":1,"operationValue":1,"useTurbine":true}}', function(error, response, body){
        var value = JSON.parse(body)[0];
        
        done();
        });
    });
}); 