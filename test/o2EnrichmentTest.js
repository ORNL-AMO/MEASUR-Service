process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
var expect = require('chai').expect;
var request = require('request');

it('o2 Enrichment Calculator',function(done)
	{
		request('https://localhost:8080/furnace/o2Enrichment/?o2CombAir=21&o2CombAirEnriched=100&flueGasTemp=1800&flueGasTempEnriched=1900&o2FlueGas=5&o2FlueGasEnriched=1&combAirTemp=900&fuelConsumption=10',function(error,response,body)
{
var output = JSON.parse(body)[0];
expect((output.availableHeatInput.toFixed(14))).to.equal('61.97028577716948');
expect((output.availableHeatEnriched.toFixed(13))).to.equal('74.2210855230995');
expect((output.fuelSavingsEnriched.toFixed(15))).to.equal('16.505821303458657');
expect((output.fuelConsumptionEnriched.toFixed(15))).to.equal('8.349417869654134');
done();
});

});
