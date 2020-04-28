
var expect = require('chai').expect;
var request = require('request');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

it('Baseline Fan Assessment', function(done)
{
	request('https://localhost:8080/fan/assessment?fanSpeed=1180&airDensity=1.02&drive=0&lineFrequency=0&motorRatedPower=600&motorRpm=1180&efficiencyClass=1&specifiedEfficiency=100&motorRatedVoltage=460&fullLoadAmps=683.2505707137&sizeMargin=1&measuredVoltage=460&measuredAmps=460&measuredPower=460&flowRate=129691&inletPressure=-16.36&outletPressure=1.1&compressibilityFactor=.988&loadEstimationMethod=0&operatingHours=8760&costKwHour=.06', function (error, response, body){
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
	request('https://localhost:8080/fan/modifiedAssessment?fanSpeed=1180&airDensity=1.02&drive=0&lineFrequency=0&motorRatedPower=600&motorRpm=1180&efficiencyClass=1&specifiedEfficiency=100&motorRatedVoltage=460&fullLoadAmps=683.2505707137&sizeMargin=1&measuredVoltage=460&measuredAmps=660&isSpecified=0&flowRate=129691&inletPressure=-16.36&outletPressure=1.1&compressibilityFactor=.988&fanEfficiency=59.5398315&operatingHours=8760&costKwHour=.06', function (error, response, body){
	
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
	expect((output.annualCost.toFixed(6))).to.equal('241776.075698');//note order of magnitude larger than the js unti test because expected unit cost is Kw/hour same as the pump assessment
	expect((output.fanEnergyIndex.toFixed(6))).to.equal('1.247872');
	done();
	});
});

function rnd(value) {
    return Number(Math.round(value + 'e' + 6) + 'e-' + 6);
}

it('Fan Traverse Analysis', function(done)
{
	request('https://localhost:8080/fan/CalculateFanTraverseAnalysis?fanSpeed=1191&motorSpeed=1191&fanSpeedCorrected=1170&densityCorrected=0.05&pressureBarometricCorrected=26.28&fanInletFlangeArea=65.09231805555557&fanInletFlangeLength=32.63&fanInletFlangeDryBulbTemp=123&fanInletFlangeBarometricPressure=26.57&fanEvaseOrOutletFlangeArea=37.916666666666664&fanEvaseOrOutletFlangeDryBulbTemp=132.7&fanEvaseOrOutletFlangeBarometricPressure=26.57&inletMstPlaneArea=65.09231805555557&inletMstPlaneDryBulbTemp=123&inletMstPlaneBarometricPressure=26.57&inletMstPlaneStaticPressure=-17.55&outletMstPlaneArea=23.280248611111112&outletMstPlaneDryBulbTemp=132.7&outletMstPlaneBarometricPressure=26.57&outletMstPlaneStaticPressure=1.8&fanShaftPowerMotorShaftPower=1759.1692438053442&fanShaftPowerEfficiencyMotor=95&fanShaftPowerEfficiencyVFD=100&fanShaftPowerEfficiencyBelt=100&fanShaftPowerSumSEF=0&planeDataPlane5upstreamOfPlane2=true&planeDataTotalPressureLossBtwnPlanes1and4=0&planeDataTotalPressureLossBtwnPlanes2and5=0.627&flowTraverseArea=32.54615902777778&flowTraverseDryBulbTemp=123&flowTraverseBarometricPressure=26.57&flowTraverseStaticPressure=-18.1&flowTraversePitotTubeCoefficient=0.87292611371180784&flowTraverseTraverseData=[[0.701,0.703,0.6675,0.815, 0.979,1.09,1.155,1.320,1.578,2.130],[0.690,0.648,0.555,0.760,0.988,1.060,1.100,1.110,1.458,1.865],[0.691,0.621,0.610,0.774,0.747,0.835,0.8825,1.23,1.210,1.569]]&addlTraversePlanesArea=32.54615902777778&addlTraversePlanesDryBulbTemp=123&addlTraversePlanesBarometricPressure=26.57&addlTraversePlanesStaticPressure=-17.0&addlTraversePlanesPitotTubeCoefficient=0.87292611371180784&addlTraversePlanesTraverseData=[[0.662,0.568,0.546,0.564,0.463,0.507,0.865,1.017,1.247,1.630],[0.639,0.542,0.530,0.570,0.603,0.750,0.965,1.014,1.246,1.596],[0.554,0.452,0.453,0.581,0.551,0.724,0.844,1.077,1.323,1.620]]&baseGasDensityDryBulbTemp=123&baseGasDensityBarometricPressure=26.57&baseGasDensityStaticPressure=-17.6&baseGasDensityGasDensity=0.0547&baseGasDensityGasType=AIR', function (error, response, body){
	
    var output = JSON.parse(body);
    
    expect(rnd(output.fanEfficiencyTotalPressure)).to.equal(rnd(53.60738684355601));
    expect(rnd(output.fanEfficiencyStaticPressure)).to.equal(rnd(49.20691409764023));
    expect(rnd(output.fanEfficiencyStaticPressureRise)).to.equal(rnd(50.768875240824116));

    expect(rnd(output.flow)).to.equal(rnd(250332.6394178045));
    expect(rnd(output.kpc)).to.equal(rnd(0.9982905074));
    expect(rnd(output.power)).to.equal(rnd(1671.2107816151));
    expect(rnd(output.pressureStatic)).to.equal(rnd(21.2207447999));
    expect(rnd(output.pressureTotal)).to.equal(rnd(23.1184721997));
    expect(rnd(output.staticPressureRise)).to.equal(rnd(21.8943488943));

    expect(rnd(output.flowCorrected)).to.equal(rnd(245498.3175715673));
    expect(rnd(output.kpcCorrected)).to.equal(rnd(0.986542913));
    expect(rnd(output.powerCorrected)).to.equal(rnd(1445.5400545013));
    expect(rnd(output.pressureStaticCorrected)).to.equal(rnd(18.6846696404));
    expect(rnd(output.pressureTotalCorrected)).to.equal(rnd(20.355601074));
    expect(rnd(output.staticPressureRiseCorrected)).to.equal(rnd(19.277771819));
	
	done();
	});
});

