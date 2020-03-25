process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
var expect = require('chai').expect;
var request = require('request');


it('Baseline Fan Assessment', function(done)
{
	request('https://localhost:8080/fan/assessment?fanSpeed=1180&airDensity=1.02&drive=0&lineFrequency=0&motorRatedPower=600&motorRpm=1180&efficiencyClass=1&specifiedEfficiency=100&motorRatedVoltage=460&fullLoadAmps=683.2505707137&sizeMargin=1&measuredVoltage=460&measuredAmps=460&measuredPower=460&flowRate=129691&inletPressure=-16.36&outletPressure=1.1&compressibilityFactor=.988&loadEstimationMethod=0&operatingHours=8760&costKwHour=.06&testingAPI=true', function (error, response, body){
	var output = JSON.parse(body)[0];
	expect((output.fanEfficiency.toFixed(7))).to.equal('59.5398315');
	expect((output.motorRatedPower.toFixed(1))).to.equal('600.0');
	expect((output.motorShaftPower.toFixed(9))).to.equal('590.622186263');
	expect((output.fanShaftPower.toFixed(9))).to.equal('590.622186263');
	expect((output.motorEfficiency.toFixed(8))).to.equal('95.78351108');
	expect((output.motorPowerFactor.toFixed(8))).to.equal('85.77466651');
	expect((output.motorCurrent.toFixed(10))).to.equal('673.1011529439');
	expect((output.motorPower.toFixed(1))).to.equal('460.0');
	expect((''+output.annualEnergy)).to.equal('4030');//rounded due to being calculated in the output to nearest whole number
	expect((output.annualCost)).to.equal(241776);//note order of magnitude larger than the js unti test because expected unit cost is Kw/hour same as the pump assessment
	expect(output.estimatedFLA.toFixed(10)).to.equal('683.2505707137');
	expect((output.fanEnergyIndex.toFixed(6))).to.equal('1.247872');
	
	done();
	});
});


it('Modified Fan Assessment', function(done)
{
	request('https://localhost:8080/fan/modifiedAssessment?modifiedFanSpeed=1180&modifiedAirDensity=1.02&modifiedDrive=0&modifiedLineFrequency=0&modifiedMotorRatedPower=600&modifiedMotorRpm=1180&modifiedEfficiencyClass=1&modifiedSpecifiedEfficiency=100&modifiedMotorRatedVoltage=460&modifiedFullLoadAmps=683.2505707137&modifiedSizeMargin=1&modifiedMeasuredVoltage=460&modifiedMeasuredAmps=460&modifiedIsSpecified=0&modifiedFlowRate=129691&modifiedInletPressure=-16.36&modifiedOutletPressure=1.1&modifiedCompressibilityFactor=.988&modifiedFanEfficiency=59.5398315&modifiedOperatingHours=8760&modifiedCostKwHour=.06&testingAPI=true', function (error, response, body){
	var output = JSON.parse(body)[1];
	output = (output.Results);
	expect((output.fanEfficiency.toFixed(7))).to.equal('59.5398315');
	expect((output.motorRatedPower.toFixed(1))).to.equal('600.0');
	expect((output.motorShaftPower.toFixed(9))).to.equal('590.622186298');
	expect((output.fanShaftPower.toFixed(9))).to.equal('590.622186298');
	expect((output.motorEfficiency.toFixed(6))).to.equal('95.783511');
	expect((output.motorPowerFactor.toFixed(6))).to.equal('85.774801');
	expect((output.motorCurrent.toFixed(6))).to.equal('673.100309');
	expect((output.motorPower.toFixed(6))).to.equal('460.000144');
	expect((output.annualEnergy.toFixed(6))).to.equal('4029.601262');
	expect((output.annualCost.toFixed(6))).to.equal('241.776076');//note order of magnitude larger than the js unti test because expected unit cost is Kw/hour same as the pump assessment
	expect((output.fanEnergyIndex.toFixed(6))).to.equal('1.247872');
	done();
	});
});

