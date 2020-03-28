var expect = require('chai').expect;
var request = require('request');

describe('Motor Unit Tests', function()
{	
	it('Motor Performance Unit Test', function(done){
		request('https://localhost:8080/motor/motorPerformance?line_frequency=0&efficiency_class=1&motor_rated_power=200&motor_rated_speed=1780&efficiency=0&load_factor=.25&motor_rated_voltage=460&motor_rated_fla=225.8', function(error, response, body){
			var value = JSON.parse(body)[0];
			expect(value.motor_current).to.equal(36.1065805345533);
			expect(value.efficiency).to.equal(93.03933838910918);
			expect(value.motor_power_factor).to.equal(61.718229798145316);
			done();
		});
	});
	it('Motor Estimate Full Load Amperes Unit Test', function(done) {
		request('https://localhost:8080/motor/motorEstFLA?&motor_rated_power=200&motor_rated_speed=1780&line_frequency=1&efficiency_class=1&efficiency=0&motor_rated_voltage=460', function(error, response, body){
			var value = JSON.parse(body)[0];
			expect(value).to.equal(225.800612262395);
			done();
		});
	});
});