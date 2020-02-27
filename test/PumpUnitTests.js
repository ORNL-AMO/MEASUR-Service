var expect = require('chai').expect;
var request = require('request');


describe('Pump Head Suction Tank Elevation Unit Tests', function()
{	
	it('Pump Head Tool Suction Tank Elevation Calculator Default', function(done){
		request('https://localhost:8080/pumpheadtool/suctionTankElevation', function(error, response, body)	{
		var value = JSON.parse(body)[0];
		expect(value.pumpHead).to.equal(287.7901739748372);
		expect(value.differentialElevationHead).to.equal(0);
		expect(value.differentialPressureHead).to.equal(286.53957183930777);
		expect(value.differentialVelocityHead.toFixed(16)).to.equal('0.5002408542117751');
		expect(value.estimatedDischargeFrictionHead.toFixed(16)).to.equal('0.5002408542117751');
		expect(value.estimatedSuctionFrictionHead).to.equal(0.25012042710588756);
		done();
		});
	});

	it('Pump Head Tool Suction Tank Elevation Unit Test 1', function(done){
		request('https://localhost:8080/pumpheadtool/suctionTankElevation?flowRate=2000&specificGravity=1&suctionPipeDiameter=17.9&suctionTankGasOverPressure=115&suctionTankFluidSurfaceElevation=0&suctionLineLossCoefficients=1&dischargePipeDiameter=10&dischargeGaugePressure=124&dischargeGaugeElevation=0&dischargeLineLossCoefficients=1&testingAPI=true', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.pumpHead).to.equal(22.972865551821844);
		expect(value.differentialElevationHead).to.equal(0.0);
		expect(value.differentialPressureHead).to.equal(20.797226988336853);
		expect(value.differentialVelocityHead).to.equal(1.0372994352935365);
		expect(value.estimatedDischargeFrictionHead).to.equal(1.0372994352935365);
		expect(value.estimatedSuctionFrictionHead).to.equal(0.10103969289791588);
		done();
		});
	});

	it('Pump Head Tool Suction Tank Elevation Unit Test 2', function(done){
		request('https://localhost:8080/pumpheadtool/suctionTankElevation?flowRate=2000&specificGravity=1&suctionPipeDiameter=17.9&suctionTankGasOverPressure=105&suctionTankFluidSurfaceElevation=5&suctionLineLossCoefficients=1&dischargePipeDiameter=15&dischargeGaugePressure=124&dischargeGaugeElevation=0&dischargeLineLossCoefficients=1&testingAPI=true', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.pumpHead).to.equal(39.41609397604601);
		expect(value.differentialElevationHead).to.equal(-5);
		expect(value.differentialPressureHead).to.equal(43.9052569753778);
		expect(value.differentialVelocityHead).to.equal(0.20489865388514306);
		expect(value.estimatedDischargeFrictionHead).to.equal(0.20489865388514306);
		expect(value.estimatedSuctionFrictionHead).to.equal(0.10103969289791588);
		done();
		});
	});
});

describe('Pump Head Gauge Elevation Unit Tests', function()
{
	it('Pump Head Tool Gauge Tank Elevation Calculator Default', function(done){
		request('https://localhost:8080/pumpheadtool/suctionGaugeElevation', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.pumpHead).to.equal(275.735918127105);
		expect(value.differentialElevationHead).to.equal(0);
		expect(value.differentialPressureHead).to.equal(274.9855568457873);
		expect(value.differentialVelocityHead).to.equal(0);
		expect(value.estimatedDischargeFrictionHead).to.equal(0.5002408542117751);
		expect(value.estimatedSuctionFrictionHead).to.equal(0.25012042710588756);
		done();
		});
	});

	it('Pump Head Tool Gauge Elevation Calculator Unit Test 1', function(done){
		request('https://localhost:8080/pumpheadtool/suctionGaugeElevation?specificGravity=1.0&flowRate=2000&suctionPipeDiameter=17.9&suctionGaugePressure=5&suctionGaugeElevation=5&suctionLineLossCoefficients=1&dischargePipeDiameter=15&dischargeGaugePressure=50&dischargeGaugeElevation=1&dischargeLineLossCoefficients=1', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.pumpHead).to.equal(100.39593224945455);
		expect(value.differentialElevationHead).to.equal(-4);
		expect(value.differentialPressureHead).to.equal(103.98613494168427);
		expect(value.differentialVelocityHead).to.equal(0.10385896098722718);
		expect(value.estimatedDischargeFrictionHead).to.equal(0.20489865388514306);
		expect(value.estimatedSuctionFrictionHead).to.equal(0.10103969289791588);
		done();
		});
	});

	it('Pump Head Tool Gauge Elevation Calculator Unit Test 2', function(done){
		request('https://localhost:8080/pumpheadtool/suctionGaugeElevation?specificGravity=1.0&flowRate=2000&suctionPipeDiameter=17.9&suctionGaugePressure=10&suctionGaugeElevation=15&suctionLineLossCoefficients=.1&dischargePipeDiameter=60&dischargeGaugePressure=20&dischargeGaugeElevation=10&dischargeLineLossCoefficients=.9', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.pumpHead).to.equal(18.018614995629626);
		expect(value.differentialElevationHead).to.equal(-5);
		expect(value.differentialPressureHead).to.equal(23.108029987040947);
		expect(value.differentialVelocityHead).to.equal(-0.10023930753117705);
		expect(value.estimatedDischargeFrictionHead).to.equal(0.0007203468300649561);
		expect(value.estimatedSuctionFrictionHead).to.equal(0.01010396928979159);
		done();
		});
	});
});

describe("Pump Achievable Efficiency Unit Tests", function()
{
	it('Pump Achievable Efficiency Calculator Default', function(done){
		request('https://localhost:8080/pumpachievableefficiency/pumpefficiency', function(error, response, body)	{
		var value = JSON.parse(body)[0];
		expect(value.average).to.equal(72.99786733498414);
		expect(value.max).to.equal(75.6275702046979);
		done();
		});
	});

	it('Pump Achievable Efficiency Calculator Modified', function(done){
		request('https://localhost:8080/pumpachievableefficiency/pumpefficiency?pumpStyle=6&flowRate=2000', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.average).to.equal(83.97084437955112);
		expect(value.max).to.equal(86.99584193768345);
		done();
		});
	});
});


describe('Pump Assessment Unit Tests', function()
{
	it('Pump Assessment Default Values', function(done)
	{
		request('https://localhost:8080/pump/assessment', function (error, response, body){
			var value = JSON.parse(body)[0];
			expect(value.pump_efficiency).to.equal(null);
			expect(value.motor_shaft_power).to.equal(0);
			expect(value.pump_shaft_power).to.equal(0);
			expect(value.motor_efficiency).to.equal(0);
			done();
		});
	});

	it('Pump Assessment Results Existing', function(done)
	{
		request('https://localhost:8080/pump/assessment?pumpStyle=2&pumpSpecified=90&pumpRatedSpeed=1780&drive=4&stages=1&kinematicViscosity=1.0&specificGravity=1.0&specifiedDriveEfficiency=95&lineFrequency=1&motorRatedPower=300&motorRatedSpeed=1780&efficiencyClass=0&efficiency=95&motorRatedVoltage=460&motorRatedFla=337.3&flowRate=1840&head=277&loadEstimationMethod=0&motorFieldCurrent=80.5&motorFieldVoltage=460&costKwHour=.006&motorFieldPower=150&operatingHours=8760&margin=0', function (error, response, body){
			var value = JSON.parse(body)[0];
			expect(value.pump_efficiency.toFixed(10)).to.equal('71.5541741283');
			expect(value.motor_shaft_power.toFixed(10)).to.equal('189.2746748003');
			expect(value.pump_shaft_power.toFixed(10)).to.equal('179.8109410603');
			expect(value.motor_efficiency.toFixed(9)).to.equal('94.132604934');
			done();
		});
	});


	it('Pump Modified Assessment 1', function(done)
	{
		request('https://localhost:8080/pump/modifiedAssessment?pumpStyle=6&pumpSpecified=80&pumpRatedSpeed=1780&drive=0&stages=2&kinematicViscosity=1&specificGravity=1&lineFrequency=0&motorRatedPower=100&motorRatedSpeed=1780&efficiencyClass=3&efficiency=95&motorRatedVoltage=460&motorRatedFla=225.0&flowRate=1840&head=174.85&loadEstimationMethod=0&motorFieldCurrent=125.857&motorFieldVoltage=480&motorFieldPower=80&costKwHour=.05&operatingHours=8760&pumpEfficiency=80', function(error, response, body)
		{
			var value = JSON.parse(body)[1].Results;
			expect(value.pump_efficiency).to.equal(80);
			expect(value.motor_rated_power).to.equal(100);
			expect(value.motor_shaft_power).to.equal(101.51891512553706);
			expect(value.pump_shaft_power).to.equal(101.51891512553706);
			expect(value.motor_efficiency.toFixed(6)).to.equal('94.973283');
			expect(value.motor_power_factor.toFixed(6)).to.equal('86.926875');
			expect(value.motor_current.toFixed(6)).to.equal('110.338892');
			expect(value.motor_power.toFixed(6)).to.equal('79.741528');
			expect(value.annual_energy.toFixed(6)).to.equal('698.535785');
			expect(value.annual_cost.toFixed(6)).to.equal('34926.789251');
			done();
		});
	});

	it('Pump Modified Assessment 2', function(done)
	{
		request('https://localhost:8080/pump/modifiedAssessment?pumpStyle=11&pumpSpecified=90&pumpRatedSpeed=1780&drive=0&kinematicViscosity=1.0&specificGravity=1.0&stages=2.0&fixedSpeed=1&lineFrequency=0&motorRatedPower=100&motorRatedSpeed=1780&efficiencyClass=3&efficiency=95&motorRatedVoltage=460&motrRatedFla=225&margin=0&operatingHours=8760&costKwHour=.05&flowRate=1840&head=174.85&loadEstimationMethod=0&motorFieldPower=80&motorFieldCurrent=125.857&motorFieldVoltage=480&efficiency=80', function(error, response, body)
		{
			var value = JSON.parse(body)[1].Results;
			expect(value.pump_efficiency).to.equal(90);
			expect(value.motor_rated_power).to.equal(100);
			expect(value.motor_shaft_power).to.equal(90.23903566714407);
			expect(value.pump_shaft_power).to.equal(90.23903566714407);
			expect(value.motor_efficiency.toFixed(6)).to.equal('95.118454');
			expect(value.motor_power_factor.toFixed(5)).to.equal('85.44077');
			expect(value.motor_current.toFixed(5)).to.equal('99.63262');
			expect(value.motor_power.toFixed(6)).to.equal('70.773157');
			expect(value.annual_energy.toFixed(6)).to.equal('619.972854');
			expect(value.annual_cost.toFixed(6)).to.equal('30998.642708');
			done();
		});
	});
});