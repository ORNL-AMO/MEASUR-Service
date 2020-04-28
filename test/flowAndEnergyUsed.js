process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var expect = require('chai').expect;
var request = require('request');

describe("Flow and Energy Used Unit Tests", function()
{
	it('Flow and Energy Used',function(done)
		{
	request('https://localhost:8080/processheating/flowAndEnergyUsed/?gasType=5&specificGravity=1&orificeDiameter=3.5&insidePipeDiameter=8.0&sectionType=1&dischargeCoefficient=0.6&gasHeatingValue=0.0&gasTemperature=85&gasPressure=20&orificePressureDrop=10&operatingTime=10',function(error,response,body)
	{
	var output = JSON.parse(body)[0];
	expect((output.flow.toFixed(11))).to.equal('46200.32759080445');
	expect((output.heatInput.toFixed(1))).to.equal('0.0');
	expect((output.totalFlow.toFixed(11))).to.equal('462003.27590804454');
	done();
	});
	});

	it('Flow Calculations Unit Test 2',function(done)
		{
	request('https://localhost:8080/processheating/flowAndEnergyUsed/?gasType=7&specificGravity=0.14&orificeDiameter=5&insidePipeDiameter=9&sectionType=1&dischargeCoefficient=0.6&gasHeatingValue=7325&gasTemperature=52&gasPressure=63&orificePressureDrop=26&operatingTime=16',function(error,response,body)
	{
	var output = JSON.parse(body)[0];
	expect((output.flow.toFixed(10))).to.equal('647312.3211663722');
	expect((output.heatInput.toFixed(11))).to.equal('75865.00404069883');
	expect((output.totalFlow.toFixed(9))).to.equal('10356997.138661955');
	done();
	});
	});
});