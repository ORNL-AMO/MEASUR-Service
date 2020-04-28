
var expect = require('chai').expect;
var request = require('request');

describe("O2 Enrichment Unit Tests", function()
{

	it('o2 Enrichment Calculator',function(done)
		{
			request('https://localhost:8080/processHeating/o2Enrichment/?o2CombAir=21&o2CombAirEnriched=100&flueGasTemp=1800&flueGasTempEnriched=1900&o2FlueGas=5&o2FlueGasEnriched=1&combAirTemp=900&fuelConsumption=10&combAirTempEnriched=80',function(error,response,body)
	{
	var output = JSON.parse(body)[0];
	expect((output.availableHeatInput.toFixed(14))).to.equal('61.97028577716948');
	expect((output.availableHeatEnriched.toFixed(13))).to.equal('74.2210855230995');
	expect((output.fuelSavingsEnriched.toFixed(15))).to.equal('16.505821303458657');
	expect((output.fuelConsumptionEnriched.toFixed(15))).to.equal('8.349417869654134');
	done();
	});

	});

	it('o2 Enrichment Unit Test 2', function(done)
	{
		request('https://localhost:8080/processHeating/o2Enrichment?o2CombAir=21&o2CombAirEnriched=100&flueGasTemp=2200&flueGasTempEnriched=2300&o2FlueGas=5&o2FlueGasEnriched=1&combAirTemp=900&fuelConsumption=10&combAirTempEnriched=80', function(error,response,body)
		{
			var output= JSON.parse(body)[0];
			expect((output.availableHeatInput.toFixed(10))).to.equal('49.7183629149');
			expect((output.availableHeatEnriched.toFixed(10))).to.equal('69.9474376972');
			expect((output.fuelSavingsEnriched.toFixed(10))).to.equal('28.9203942964');
			expect((output.fuelConsumptionEnriched.toFixed(10))).to.equal('7.1079605704');
			done();
		});
	});

	it('o2 Enrichment Unit Test 3', function(done)
	{
		request('https://localhost:8080/processheating/o2Enrichment?o2CombAir=21&o2CombAirEnriched=100&flueGasTemp=2200&flueGasTempEnriched=2300&o2FlueGas=8&o2FlueGasEnriched=3&combAirTemp=900&fuelConsumption=10&combAirTempEnriched=80', function(error,response,body)
		{
			var output= JSON.parse(body)[0];
			expect((output.availableHeatInput.toFixed(10))).to.equal('42.6248055296');
			expect((output.availableHeatEnriched.toFixed(10))).to.equal('65.7672982588');
			expect((output.fuelSavingsEnriched.toFixed(10))).to.equal('35.1884497948');
			expect((output.fuelConsumptionEnriched.toFixed(10))).to.equal('6.4811550205');
			done();
		});
	});

	it('o2 Enrichment Unit Test 4', function(done)
	{
		request('https://localhost:8080/processheating/o2Enrichment?o2CombAir=21&o2CombAirEnriched=100&flueGasTemp=2200&flueGasTempEnriched=2300&o2FlueGas=8&o2FlueGasEnriched=3&combAirTemp=1100&fuelConsumption=10&combAirTempEnriched=110', function(error,response,body)
		{
			var output= JSON.parse(body)[0];
			expect((output.availableHeatInput.toFixed(10))).to.equal('49.1204784776');
			expect((output.availableHeatEnriched.toFixed(10))).to.equal('66.3723712295');
			expect((output.fuelSavingsEnriched.toFixed(10))).to.equal('25.9925816002');
			expect((output.fuelConsumptionEnriched.toFixed(8))).to.equal('7.40074184');
			done();
		});
	});
});