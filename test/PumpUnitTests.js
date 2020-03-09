var expect = require('chai').expect;
var request = require('request');

describe('Pump Head Suction Tank Elevation Unit Tests', function()
{	
	it('Pump Head Tool Suction Tank Elevation Unit Test 1', function(done){
		request('https://localhost:8080/pumpheadtool/suctionTankElevation?flowRate=2000&specificGravity=1&suctionPipeDiameter=17.9&suctionTankGasOverPressure=115&suctionTankFluidSurfaceElevation=0&suctionLineLossCoefficients=1&dischargePipeDiameter=10&dischargeGaugePressure=124&dischargeGaugeElevation=0&dischargeLineLossCoefficients=1', function(error, response, body){
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
		request('https://localhost:8080/pumpheadtool/suctionTankElevation?flowRate=2000&specificGravity=1&suctionPipeDiameter=17.9&suctionTankGasOverPressure=105&suctionTankFluidSurfaceElevation=5&suctionLineLossCoefficients=1&dischargePipeDiameter=15&dischargeGaugePressure=124&dischargeGaugeElevation=0&dischargeLineLossCoefficients=1', function(error, response, body){
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
	it('Pump Achievable Efficiency Calculator unit Test', function(done){
		request('https://localhost:8080/pumpachievableefficiency/pumpefficiency?pump_style=6&flow_rate=2000', function(error, response, body){
		var value = JSON.parse(body)[0];
		expect(value.average).to.equal(83.97084437955112);
		expect(value.max).to.equal(86.99584193768345);
		done();
		});
	});
});


describe('Pump Assessment Unit Tests', function()
{
	it('Pump Assessment Results Existing', function(done)
	{
		request('https://localhost:8080/pump/assessment?pump_style=2&pump_specified=90&pump_rated_speed=1780&drive=4&stages=1&kinematic_viscosity=1.0&specific_gravity=1.0&specifiedDriveEfficiency=95&line_frequency=1&motor_rated_power=300&motor_rated_speed=1780&efficiency_class=0&efficiency=95&motor_rated_voltage=460&motor_rated_fla=337.3&flow_rate=1840&head=277&load_estimation_method=0&motor_field_current=80.5&motor_field_voltage=460&cost_kw_hour=.006&motor_field_power=150&operating_hours=8760&margin=0', function (error, response, body){
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
		request('https://localhost:8080/pump/modifiedAssessment?pump_style=6&pump_specified=80&pump_rated_speed=1780&drive=0&stages=2&kinematic_viscosity=1&specific_gravity=1&line_frequency=0&motor_rated_power=100&motor_rated_speed=1780&efficiency_class=3&efficiency=95&motor_rated_voltage=460&motor_rated_fla=225.0&flow_rate=1840&head=174.85&load_estimation_method=0&motor_field_current=125.857&motor_field_voltage=480&motor_field_power=80&cost_kw_hour=.05&operating_hours=8760', function(error, response, body)
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
		request('https://localhost:8080/pump/modifiedAssessment?pump_style=11&pump_specified=90&pump_rated_speed=1780&drive=0&kinematic_viscosity=1.0&specific_gravity=1.0&stages=2.0&fixed_speed=1&line_frequency=0&motor_rated_power=100&motor_rated_speed=1780&efficiency_class=3&efficiency=95&motor_rated_voltage=460&motrRatedFla=225&margin=0&operating_hours=8760&cost_kw_hour=.05&flow_rate=1840&head=174.85&load_estimation_method=0&motor_field_power=80&motor_field_current=125.857&motor_field_voltage=480&efficiency=80', function(error, response, body)
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