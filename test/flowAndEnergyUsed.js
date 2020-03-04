process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
var expect = require('chai').expect;
var request = require('request');

it('Flow and Energy Used',function(done)
	{
request('https://localhost:8080/furnace/flowAndEnergyUsed/?gasType=5&specificGravity=1&orificeDiameter=3.5&insidePipeDiameter=8.0&sectionType=1&dischargeCoefficient=0.6&gasHeatingValue=0.0&gasTemperature=85&gasPressure=20&orificePressureDrop=10&operatingTime=10&dischargeLineLossCoefficients=1',function(error,response,body)
{
var output = JSON.parse(body)[0];
expect((output.flow.toFixed(11))).to.equal('46200.32759080445');
expect((output.heatInput.toFixed(1))).to.equal('0.0');
expect((output.totalFlow.toFixed(11))).to.equal('462003.27590804454');
done();
});

});
