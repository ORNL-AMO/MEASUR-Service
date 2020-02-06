var expect = require('chai').expect;
var request = require('request');


it('Pump Head Tool Suction Tank Elevation Calculator Default', function(done){
	request('https://localhost:8080/pumpheadtool/suctionTankElevation', function(error, response, body)	{
	expect(body).to.equal('[{"differentialElevationHead":0,"differentialPressureHead":286.53957183930777,"differentialVelocityHead":0.5002408542117751,"estimatedSuctionFrictionHead":0.25012042710588756,"estimatedDischargeFrictionHead":0.5002408542117751,"pumpHead":287.7901739748372}]');
	done();
	});
});

it('Pump Head Tool Suction Tank Elevation Calculator Modified', function(done){
	request('https://localhost:8080/pumpheadtool/suctionTankElevation?flowRate=2200&specificGravity=2&suctionPipeDiameter=14&suctionTankGasOverPressure=1&suctionTankFluidSurfaceElevation=11&suctionLineLossCoefficients=.6&dischargePipeDiameter=14&dischargeGaugePressure=140&dischargeGaugeElevation=11&dischargeLineLossCoefficients=2',
function(error, response, body){
	expect(body).to.equal('[{"differentialElevationHead":0,"differentialPressureHead":160.6008084099346,"differentialVelocityHead":0.32672124029185207,"estimatedSuctionFrictionHead":0.19603274417511124,"estimatedDischargeFrictionHead":0.6534424805837041,"pumpHead":161.77700487498524}]');
	done();
	});
});


it('Pump Head Tool Gauge Tank Elevation Calculator Default', function(done){
	request('https://localhost:8080/pumpheadtool/suctionGaugeElevation', function(error, response, body){
	expect(body).to.equal('[{"differentialElevationHead":0,"differentialPressureHead":274.9855568457873,"differentialVelocityHead":0,"estimatedSuctionFrictionHead":0.25012042710588756,"estimatedDischargeFrictionHead":0.5002408542117751,"pumpHead":275.735918127105}]');
	done();
	});
});

it('Pump Head Tool Gauge Tank Elevation Calculator Modified', function(done){
	request('https://localhost:8080/pumpheadtool/suctionGaugeElevation?specificGravity=.8&flowRate=1900&suctionPipeDiameter=11&suctionGaugePressure=6&suctionGaugeElevation=9&suctionLineLossCoefficients=.4&dischargePipeDiameter=14&dischargeGaugePressure=132&dischargeGaugeElevation=11&dischargeLineLossCoefficients=.8', function(error, response, body){
	expect(body).to.equal('[{"differentialElevationHead":2,"differentialPressureHead":363.95147229589486,"differentialVelocityHead":-0.3957209056230499,"estimatedSuctionFrictionHead":0.2557646992288552,"estimatedDischargeFrictionHead":0.19495267395927046,"pumpHead":366.00646876345996}]');
	done();
	});
});

it('Pump Achievable Efficiency Calculator Default', function(done){
	request('https://localhost:8080/pumpachievableefficiency/pumpefficiency', function(error, response, body)	{
	expect(body).to.equal('[{"average":72.99786733498414,"max":75.6275702046979},"Errors Found: Pump style Parameter not found using  0Flow Rate Parameter not found using default. "]');
	done();
	});
});

it('Pump Achievable Efficiency Calculator Modified', function(done){
	request('https://localhost:8080/pumpachievableefficiency/pumpefficiency?pumpStyle=7&flowRate=3000',
function(error, response, body){
	expect(body).to.equal('[{"average":86.2582381586152,"max":88.97084634992157},"Errors Found: "]');
	done();
	});
});




	
it('Pump Assessment Default Values', function(done)
{
	request('https://localhost:8080/pump/assessment', function (error, response, body){
		expect(body).to.equal('[{"pump_efficiency":null,"motor_rated_power":200,"motor_shaft_power":0,"pump_shaft_power":0,"motor_efficiency":0,"motor_power_factor":0,"motor_current":null,"motor_power":0,"load_factor":0,"drive_efficiency":100,"annual_energy":0,"annual_cost":0,"annual_savings_potential":0,"optimization_rating":0}]');
		done();
	});
});

it('Pump Assessment With Checking Different Parameters', function(done)
{
	request('https://localhost:8080/pump/assessment?pumpStyle=9&pumpRatedSpeed=1900&drive=4&stages=2&kinematicViscosity=1.2&specificGravity=2&specifiedDriveEfficiency=96&lineFrequency=1&motorRatedPower=150&motorRatedSpeed=1300&efficiencyClass=2&efficiency=95&motorRatedVoltage=300&motorRatedFla=250&flowRate=300&head=290&loadEstimationMethod=1&motorFieldCurrent=45&motorFieldVoltage=500&costKwHour=.007&operatingHours=5000', function (error, response, body){
		'https://localhost:8080/pump/assessment?pumpStyle=9&pumpRatedSpeed=1900&drive=4&stages=2&kinematicViscosity=1.2&specificGravity=2&specifiedDriveEfficiency=96&lineFrequency=1&motorRatedPower=150&motorRatedSpeed=1300&efficiencyClass=2&efficiency=95&motorRatedVoltage=300&motorRatedFla=250&flowRate=300&head=290&loadEstimationMethod=1&motorFieldCurrent=45&motorFieldVoltage=500&costKwHour=.007&operatingHours=5000'

		expect(body).to.equal('[{"pump_efficiency":0.11118610795818455,"motor_rated_power":150,"motor_shaft_power":41151.05582431908,"pump_shaft_power":39505.01359134632,"motor_efficiency":33787.75332140182,"motor_power_factor":233.1402993133724,"motor_current":45,"motor_power":90.85743983307968,"load_factor":1.6201884155731876,"drive_efficiency":96,"annual_energy":454.2871991653984,"annual_cost":3180.010394157789,"annual_savings_potential":0,"optimization_rating":0}]');
		done();
	});
});


it('Pump Modified Assessment 1', function(done)
{
	request('https://localhost:8080/pump/modifiedAssessment?pumpStyle=9&pumpRatedSpeed=1900&drive=4&stages=2&kinematicViscosity=1.2&specificGravity=2&specifiedDriveEfficiency=96&lineFrequency=1&motorRatedPower=150&motorRatedSpeed=1300&efficiencyClass=2&efficiency=95&motorRatedVoltage=300&motorRatedFla=250&flowRate=300&head=290&loadEstimationMethod=1&motorFieldCurrent=45&motorFieldVoltage=500&costKwHour=.007&operatingHours=5000', function(error, response, body)
	{
		expect(body).to.equal('[{"Name":"BaseLine","Results":{"pump_efficiency":0.11118610795818455,"motor_rated_power":150,"motor_shaft_power":41151.05582431908,"pump_shaft_power":39505.01359134632,"motor_efficiency":33787.75332140182,"motor_power_factor":233.1402993133724,"motor_current":45,"motor_power":90.85743983307968,"load_factor":1.6201884155731876,"drive_efficiency":96,"annual_energy":454.2871991653984,"annual_cost":3180.010394157789,"annual_savings_potential":0,"optimization_rating":0}},{"Name":"Scenario 1","Results":{"pump_efficiency":0.11,"motor_rated_power":150,"motor_shaft_power":41594.77941341837,"pump_shaft_power":39930.98823688163,"motor_efficiency":-1750.5573063175361,"motor_power_factor":-24.95166408745909,"motor_current":-170023.2653523746,"motor_power":36739.944800580015,"load_factor":277.2985294227822,"drive_efficiency":96,"annual_energy":183699.72400290007,"annual_cost":1285898.0680203005,"annual_savings_potential":-1282718,"optimization_rating":0,"annual_energy_savings":-183245}}]');
		done();
	});
});


it('Pump Modified Assessment 2', function(done)
{
	request('https://localhost:8080/pump/modifiedAssessment?pumpStyle=9&pumpRatedSpeed=1900&drive=4&stages=2&kinematicViscosity=1.2&specificGravity=2&specifiedDriveEfficiency=96&lineFrequency=1&motorRatedPower=150&motorRatedSpeed=1300&efficiencyClass=2&efficiency=95&motorRatedVoltage=300&motorRatedFla=250&flowRate=300&head=290&loadEstimationMethod=1&motorFieldCurrent=45&motorFieldVoltage=500&costKwHour=.007&operatingHours=5000&modifiedPumpStyle=9', function(error, response, body)
	{
		expect(body).to.equal('[{"Name":"BaseLine","Results":{"pump_efficiency":0.11118610795818455,"motor_rated_power":150,"motor_shaft_power":41151.05582431908,"pump_shaft_power":39505.01359134632,"motor_efficiency":33787.75332140182,"motor_power_factor":233.1402993133724,"motor_current":45,"motor_power":90.85743983307968,"load_factor":1.6201884155731876,"drive_efficiency":96,"annual_energy":454.2871991653984,"annual_cost":3180.010394157789,"annual_savings_potential":0,"optimization_rating":0}},{"Name":"Scenario 1","Results":{"pump_efficiency":82.17713832682072,"motor_rated_power":150,"motor_shaft_power":55.67759876572274,"pump_shaft_power":53.45049481509383,"motor_efficiency":95.0796763264815,"motor_power_factor":36.42991358022122,"motor_current":138.46546056829868,"motor_power":43.6847874811668,"load_factor":0.37118399177148503,"drive_efficiency":96,"annual_energy":218.423937405834,"annual_cost":1528.967561840838,"annual_savings_potential":1651,"optimization_rating":0,"annual_energy_savings":236}}]');
		done();
	});
});

it('Pump Modified Assessment 3', function(done)
{
	request('https://localhost:8080/pump/modifiedAssessment?pumpStyle=9&pumpRatedSpeed=1900&drive=4&stages=2&kinematicViscosity=1.2&specificGravity=2&specifiedDriveEfficiency=96&lineFrequency=1&motorRatedPower=150&motorRatedSpeed=1300&efficiencyClass=2&efficiency=95&motorRatedVoltage=300&motorRatedFla=250&flowRate=300&head=290&loadEstimationMethod=1&motorFieldCurrent=45&motorFieldVoltage=500&costKwHour=.007&operatingHours=5000&modifiedPumpRatedSpeed=2500&modifiedDrive=0&modifiedSpecificGravity=3&modifiedKinematicViscosity=2&modifiedStages=3&modifiedLineFrequency=0&modifiedMotorRatedPower=400&modifiedMotorRatedSpeed=1500&modifiedMotorRatedFla=647&modifiedFlowRate=500', function(error, response, body)
	{
		expect(body).to.equal('[{"Name":"BaseLine","Results":{"pump_efficiency":0.11118610795818455,"motor_rated_power":150,"motor_shaft_power":41151.05582431908,"pump_shaft_power":39505.01359134632,"motor_efficiency":33787.75332140182,"motor_power_factor":233.1402993133724,"motor_current":45,"motor_power":90.85743983307968,"load_factor":1.6201884155731876,"drive_efficiency":96,"annual_energy":454.2871991653984,"annual_cost":3180.010394157789,"annual_savings_potential":0,"optimization_rating":0}},{"Name":"Scenario 1","Results":{"pump_efficiency":0.11,"motor_rated_power":400,"motor_shaft_power":99827.47059220409,"pump_shaft_power":99827.47059220409,"motor_efficiency":-1587.0053129744385,"motor_power_factor":-25.36439970491887,"motor_current":-401161.3198286945,"motor_power":88119.95598936701,"load_factor":249.5686764805024,"drive_efficiency":100,"annual_energy":440599.779946835,"annual_cost":3084198.4596278453,"annual_savings_potential":-3081018,"optimization_rating":0,"annual_energy_savings":-440145}}]');
		done();
	});
});


it('Pump Modified Assessment 4', function(done)
{
	request('https://localhost:8080/pump/modifiedAssessment?pumpStyle=9&pumpRatedSpeed=1900&drive=4&stages=2&kinematicViscosity=1.2&specificGravity=2&specifiedDriveEfficiency=96&lineFrequency=1&motorRatedPower=150&motorRatedSpeed=1300&efficiencyClass=2&efficiency=95&motorRatedVoltage=300&motorRatedFla=250&flowRate=300&head=290&loadEstimationMethod=1&motorFieldCurrent=45&motorFieldVoltage=500&costKwHour=.007&operatingHours=5000&modifiedPumpRatedSpeed=2500&modifiedDrive=0&modifiedSpecificGravity=3&modifiedKinematicViscosity=2&modifiedStages=3&modifiedLineFrequency=0&modifiedMotorRatedPower=400&modifiedMotorRatedSpeed=1500&modifiedMotorRatedFla=647&modifiedFlowRate=500&modifiedPumpStyle=9', function(error, response, body)
	{
		expect(body).to.equal('[{"Name":"BaseLine","Results":{"pump_efficiency":0.11118610795818455,"motor_rated_power":150,"motor_shaft_power":41151.05582431908,"pump_shaft_power":39505.01359134632,"motor_efficiency":33787.75332140182,"motor_power_factor":233.1402993133724,"motor_current":45,"motor_power":90.85743983307968,"load_factor":1.6201884155731876,"drive_efficiency":96,"annual_energy":454.2871991653984,"annual_cost":3180.010394157789,"annual_savings_potential":0,"optimization_rating":0}},{"Name":"Scenario 1","Results":{"pump_efficiency":82.17713832682072,"motor_rated_power":400,"motor_shaft_power":133.6262370377346,"pump_shaft_power":133.6262370377346,"motor_efficiency":95.09155332764526,"motor_power_factor":34.96363164859302,"motor_current":346.2088513206717,"motor_power":104.82993944082479,"load_factor":0.3340655925943366,"drive_efficiency":100,"annual_energy":524.149697204124,"annual_cost":3669.0478804288678,"annual_savings_potential":-489,"optimization_rating":0,"annual_energy_savings":-70}}]');
		done();
	});
});

it('Pump Modifeid Assessment 5', function(done)
{
	request('https://localhost:8080/pump/modifiedAssessment?pumpStyle=9&pumpRatedSpeed=1900&drive=4&stages=2&kinematicViscosity=1.2&specificGravity=2&specifiedDriveEfficiency=96&lineFrequency=1&motorRatedPower=150&motorRatedSpeed=1300&efficiencyClass=2&efficiency=95&motorRatedVoltage=300&motorRatedFla=250&flowRate=300&head=290&loadEstimationMethod=1&motorFieldCurrent=45&motorFieldVoltage=500&costKwHour=.007&operatingHours=5000&modifiedPumpStyle=5', function(error, response, body)
	{
		expect(body).to.equal('[{"Name":"BaseLine","Results":{"pump_efficiency":0.11118610795818455,"motor_rated_power":150,"motor_shaft_power":41151.05582431908,"pump_shaft_power":39505.01359134632,"motor_efficiency":33787.75332140182,"motor_power_factor":233.1402993133724,"motor_current":45,"motor_power":90.85743983307968,"load_factor":1.6201884155731876,"drive_efficiency":96,"annual_energy":454.2871991653984,"annual_cost":3180.010394157789,"annual_savings_potential":0,"optimization_rating":0}},{"Name":"Scenario 1","Results":{"pump_efficiency":73.5309057704546,"motor_rated_power":150,"motor_shaft_power":62.22452569480614,"pump_shaft_power":59.73554466701389,"motor_efficiency":95.52520448191555,"motor_power_factor":39.73656176332016,"motor_current":141.20797140167954,"motor_power":48.593718376123775,"load_factor":0.41483017129870764,"drive_efficiency":96,"annual_energy":242.96859188061887,"annual_cost":1700.7801431643322,"annual_savings_potential":1479,"optimization_rating":0,"annual_energy_savings":211}}]');
		done();
	});
});
