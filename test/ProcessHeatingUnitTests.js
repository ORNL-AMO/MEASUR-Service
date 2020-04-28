var expect = require('chai').expect;
var request = require('request');

//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

describe('Process Heating Unit Tests', function()
{	
	it('ProcessHeatingAssessmentUnitTest', function(done){
		request('https://localhost:8080/processheating/assessment?operatingHours=8760&fuelCosts=3.99&steamCosts=4.69&electricityCosts=.066&chargeMaterials={"one":{"type":"Gas","thermicReactionType":0,"specificHeatType":0.5,"feedRate":1000,"percentVapor":15,"initialTemperature":80,"dischargeTemperature":1150,"specificHeatVapor":0.5,"specificHeatGas":0.24,"percentReacted":100,"reactionHeat":80,"additionalHeat":5000}, "two": {"type":"Solid","thermicReactionType":0,"specificHeatSolid":0.15, "latentHeat":60,"specificHeatLiquid":0.481,"meltingPoint":2900,"chargeFeedRate":10000,"waterContentCharged":0.1,"waterContentDischarged":0,"initialTemperature":70,"dischargeTemperature":2200,"waterVaporDischargeTemperature":500,"chargeMelted":0,"chargeReacted":1,"reactionHeat":100,"additionalHeat":0},"three": {"type":"Liquid","thermicReactionType": 0, "specificHeatLiquid":0.48,"vaporizingTemperature":240,"latentHeat":250,"specificHeatVapor":0.25,"chargeFeedRate":1000,"initialTemperature":70,"dischargeTemperature":320,"percentVaporized":100,"percentReacted":25,"reactionHeat":50,"additionalHeat":0}}&flueGas={"type":"Solid","flueGasTemperature":700,"excessAirPercentage": 9.0,"combustionAirTemperature":125, "fuelTemperature":70, "moistureInAirComposition": 1.0,"ashDischargeTemperature": 100,"unburnedCarbonInAsh": 1.5,"carbon": 75.0,"hydrogen": 5.0,"sulphur":1.0,"inertAsh": 9.0,"o2":7.0,"moisture": 0.0,"nitrogen": 1.5}&atmosphereLossObject= {"inletTemperature":100.0, "outletTemperature":1400.0, "flowRate":1200.0, "correctionFactor":1.0, "specificHeat":0.02}&auxiliaryPowerLossArray=[{"motorPhase":3, "supplyVoltage":460, "avgCurrent":19, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":19, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.85, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.55, "operatingTime":100},{"motorPhase":3, "supplyVoltage":510, "avgCurrent":25, "powerFactor":0.55, "operatingTime":75}]&wallLossArray=[{"surfaceArea":500, "ambientTemperature":80, "surfaceTemperature":225, "windVelocity":10, "surfaceEmissivity":0.9, "conditionFactor":1.394, "correctionFactor":1}]&openingLossArray=[{"emissivity": 0.95, "diameter": 12, "thickness": 9, "ratio": 1.33, "ambientTemperature": 75,"insideTemperature": 1600, "percentTimeOpen": 100, "viewFactor": 0.70}, {"emissivity": 0.95, "length": 48, "width": 15, "thickness": 9, "ratio": 1.67, "ambientTemperature": 75,"insideTemperature": 1600, "percentTimeOpen": 20, "viewFactor": 0.64}]&coolingLossArray=[{"type":"water", "flowRate": 100, "initialTemperature": 80, "outletTemperature": 120, "correctionFactor": 1},{ "type":"liquid",       "flowRate": 100, "density": 9.35, "initialTemperature": 80, "outletTemperature": 210,"specificHeat": 0.52, "correctionFactor": 1.0}, {"type":"gas","flowRate": 2500, "initialTemperature": 80, "finalTemperature": 280, "specificHeat": 0.02, "correctionFactor": 1.0,"gasDensity": 1}]&leakageLossArray=[{"draftPressure":0.1,"openingArea":3,"leakageGasTemperature":1600,"ambientTemperature":80,"coefficient":0.8052,"specificGravity":1.02,"correctionFactor":1.0}]&fixtureLossArray=[{"specificHeat":0.122,"feedRate":1250.0, "initialTemperature":300, "finalTemperature":1800.0,"correctionFactor":1.0}]', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.ChargeMaterials).to.equal(3.96193028);
		expect(value.HeatingValue).to.equal(0.013877969543147206);
		expect(value.EnergyIntensityforChargeMaterials).to.equal(0);
		expect(value.atmosphereLosses).to.equal(31200);
		expect(value.auxiliaryPowerLosses).to.equal(229159.2531478799);
		expect(value.leakageLosses).to.equal(2850767.216228273);
        expect(value.fixtureLosses).to.equal(228750);
        expect(value.wallLosses).to.equal(404627.551342992);
        expect(value.openingLosses).to.equal(34708.49586390799);
        expect(value.coolingLosses).to.equal(6381392.793613424);
        expect(value.flueGasLosses).to.equal(0.8222977480707968);
        expect(value.totalLosses).to.equal(3339880.431306433);
        expect(value.grossHeatInput).to.equal(3339881.253604181);
        
		done();
		});
	});
});
