const NUMBER_OF_PUMP_STYLES = 12;
const NUMBER_OF_DRIVES = 5;
const NUMBER_OF_EFFICIENCY_CLASS = 4;
const NUMBER_OF_LOAD_ESTIMATION_METHODS = 2;
var psat = require("../../node_modules/amo-tools-suite/build/Release/psat.node");
var express = require('express');
/*
		Notes about Values
			Pump Style (0-11)
				0 - END_SUCTION_SLURRY
				1 - END_SUCTION_SEWAGE
				2 - END_SUCTION_STOCK
				3 - END_SUCTION_SUBMERSIBLE_SEWAGE
				4 - API_DOUBLE_SUCTION
				5 - MULTISTAGE_BOILER_FEED
				6 - END_SUCTION_ANSI_API
				7 - AXIAL_FLOW
				8 - DOUBLE_SUCTION
				9 - VERTICAL_TURBINE
				10 - LARGE_END_SUCTION
				11 - SPECIFIED_OPTIMAL_EFFICIENCY
			Drive (0-4)
				0- DIRECT_DRIVE
				1 - V_BELT_DRIVE
				2 - N_V_BELT_DRIVE
				3 - S_BELT_DRIVE
				4 - SPECIFIED
			Efficiency Class
				0 - Standard
				1 - ENERGY_EFFICIENT
				2 - PREMIUM
				3 - SPECIFIED
			LoadEstimationMethod
				0 - Power
				1 - Current
	*/
var setUpPump = function(req, res)
{
	var pump = {
		pump_style: 0,
		pump_specified: 1,
		pump_rated_speed: 1780,
		drive: 0,
		kinematic_viscosity: 1.107,
		specific_gravity: 1.0,
		stages: 1.0,
		specifiedDriveEfficiency: 100.0,
		line_frequency: 0,
		motor_rated_power: 200,
		motor_rated_speed: 1780,
		efficiency_class: 1,
		motor_rated_voltage: 460,
		motor_rated_fla: 225.8,
		flow_rate: 100,
		head: 277,
		load_estimation_method: 0,
		motor_field_power: 0,
		motor_field_current: 0,
		motor_field_voltage: 460,
		operating_hours: 8760,
		cost_kw_hour: .066,
		efficiency: 0,
		margin: 0,
		fixed_speed: 0
		};
	var errorMessage = "";
	if(req.query.pumpStyle)
	{
		if(Number.isInteger(parseInt(req.query.pumpStyle)))
		{
			var value = parseInt(req.query.pumpStyle);
			if(value < 0 || value >= NUMBER_OF_PUMP_STYLES)
			{
				errorMessage += "Pump Style was not a valid Pump Style";
				res.send(errorMessage);
				return;
			}
			else
			{
				pump.pump_style = value;
			}
		}
		else
		{
			errorMessage += "Pump Style was sent as an incorrect value.";
			res.send(errorMessage);
			return;
		}
	}
	else
	{
		errorMessage +=" Pump Style was not found as a parameter using default value. ";
	}
	if(req.query.pumpSpecified && parseFloat(req.query.pumpSpecified) >= 0)
	{
		pump.pump_specified = parseFloat(req.query.pumpSpecified);
	}
	else
	{
		errorMessage += " Pump Specified was not found as a parameter using a default value.";
	}
	if(req.query.pumpRatedSpeed && parseFloat(req.query.pumpRatedSpeed) >= 0)
	{
		pump.pump_rated_speed = parseFloat(req.query.pumpRatedSpeed);
	}
	else
	{
		errorMessage += " Pump Rated speed was not found as a parameter using default value.";
	}
	if(req.query.drive)
	{
		if(Number.isInteger(parseInt(req.query.drive)))
		{
			var value = parseInt(req.query.drive);
			if(value < 0 || value >= NUMBER_OF_DRIVES)
			{
				errorMessage +=" Motor Drive was passed in with a value that was too large to choose an appropriate drive using default.";
				res.send(errorMessage);
			}
			else
			{
				pump.drive = value;
			}
		}
		else
		{
			errorMessage += " Drive was passed into as an incorrect data type.";
			res.send(errorMessage);
			return;
		}
	}
	else
	{
		errorMessage += " Drive was not passed as a parameter using default value.";
	}
	if(req.query.kinematicViscosity && parseFloat(req.query.kinematicViscosity) >= 0)
	{
		pump.kinematic_viscosity = parseFloat(req.query.kinematicViscosity);
	}
	else
	{
		errorMessage += " Kinematic Viscosity was not passed as a parameter using default value.";
	}
	if(req.query.specificGravity && parseFloat(req.query.specificGravity) >= 0)
	{
		pump.specific_gravity = parseFloat(req.query.specificGravity);
	}
	else
	{
		errorMessage += " Specific Gravity was not passed in as a parameter using default value.";
	}
	if(req.query.stages && parseFloat(req.query.stages) >= 1)
	{
		pump.stages = parseFloat(req.query.stages);
	}
	else
	{
		errorMessage += " Stages was not passed in as a parameter or was an incorrect value using default value.";
	}
	if(pump.drive == 4)
	{
		if(req.query.specifiedDriveEfficiency && parseFloat(req.query.specifiedDriveEfficiency))
		{
			pump.specifiedDriveEfficiency = parseFloat(req.query.specifiedDriveEfficiency);
		}
		else
		{
			errorMessage += " Drive was SPECIFIED and drive efficiency was not included as a parameter.";
			res.send(errorMessage);
			return;
		}
	}
	if(req.query.lineFrequency && parseInt(req.query.lineFrequency) >= 0 && parseInt(req.query.lineFrequency) <= 1)
	{
		pump.line_frequency = parseInt(req.query.lineFrequency)
	}
	else if(req.query.lineFrequency)
	{
		errorMessage = "Line Frequency was an incorrect value. Correct values are either 1 or 2.";
		res.send(errorMessage);
		return;
	}
	else{
		errorMessage += " Line Frequency was not passed in an as a parameter using defaut value.";
	}
	if(req.query.motorRatedPower && parseFloat(req.query.motorRatedPower) >= 0)
	{
		pump.motor_rated_power = parseFloat(req.query.motorRatedPower);
	}
	else
	{
		errorMessage += " Motor Rated Power was not passed in as a parameter using default value. ";
	}
	if(req.query.motorRatedSpeed && parseFloat(req.query.motorRatedSpeed) >= 0)
	{
		pump.motor_rated_speed = parseFloat(req.query.motorRatedSpeed);
	}
	else
	{
		errorMessage += " Motor Rated Speed was not passed in as a parameter using default values. ";
	}
	if(req.query.efficiencyClass)
	{
		if(Number.isInteger(parseInt(req.query.efficiencyClass)))
		{
			var value = parseInt(req.query.efficiencyClass);
			if(value < 0 || value >= NUMBER_OF_EFFICIENCY_CLASS)
			{
				errorMessage += " Efficiency class was out of the bounds of acceptable efficiency classes.";
				res.send(errorMessage);
				return;
			}
			pump.efficiency_class = value;
		}
		else
		{
			errorMessage += " Efficiency class was passed in as a wrong data type.";
			res.send(errorMessage);
			return;
		}
	}
	else
	{
		errorMessage += " Efficiency class was not passed in as a parameter using default value.";
	}
	if(req.query.motorRatedVoltage && parseFloat(req.query.motorRatedVoltage) >= 0)
	{
		pump.motor_rated_voltage = parseFloat(req.query.motorRatedVoltage);
	}
	else
	{
		errorMessage += " Motor Rated Voltage was not passed in as a parameter using default value.";
	}
	if(req.query.motorRatedFla && parseFloat(req.query.motorRatedFla) >= 0)
	{
		pump.motor_rated_fla = parseFloat(req.query.motorRatedFla);
	}
	else
	{
		var value = psat.estFLA(pump);
		pump.motor_rated_fla = parseFloat(value);
	}
	if(req.query.flowRate && parseFloat(req.query.flowRate) >= 0)
	{
		pump.flow_rate = parseFloat(req.query.flowRate);
	}
	else
	{
		errorMessage += " Flow Rate was not passed in as a parameter using a default value.";
	}
	if(req.query.head && parseFloat(req.query.head) >= 0)
	{
		pump.head = parseFloat(req.query.head);
	}
	else
	{
		errorMessage += " Head was not passed in as a parameter";
	}
	if(req.query.loadEstimationMethod)
	{
		if(Number.isInteger(parseInt(req.query.loadEstimationMethod)))
		{
			var value = parseInt(req.query.loadEstimationMethod);
			if(value < 0 || value >= NUMBER_OF_LOAD_ESTIMATION_METHODS)
			{
				errorMessage += " Load Estiamtion Method was outside of the acceptable values for load estimation methods. ";
				res.send(errorMessage);
				return;
			}
			pump.load_estimation_method = value;
		}
		else
		{
			errorMessage += " Load estimation method was passed in as an incorrect data type.";
			res.send(errorMessage);
			return;
		}
	}
	else
	{
		errorMessage += " Load Estimation Method was not included as a parameter using default value.";
	}
	if(pump.load_estimation_method == 0)
	{
		if(req.query.motorFieldPower && parseFloat(req.query.motorFieldPower))
		{
			pump.motor_field_power = parseFloat(req.query.motorFieldPower);
		}
		else
		{
			errorMessage +=  " Motor Field Power was not included using default values.";
		}
	}
	else if(pump.load_estimation_method == 1)
	{
		if(req.query.motorFieldCurrent && parseFloat(req.query.motorFieldCurrent))
		{
			pump.motor_field_current = parseFloat(req.query.motorFieldCurrent);
		}
		else
		{
			errorMessage += " Motor Field Current was not included using default values.";
		}
	}
	if(req.query.motorFieldVoltage && parseFloat(req.query.motorFieldVoltage) >= 0)
	{
		pump.motor_field_voltage = parseFloat(req.query.motorFieldVoltage);
	}
	else
	{
		errorMessage += " Motor Field Voltage was not included as a parameter using default values.";
	}
 	if(req.query.operatingHours && parseFloat(req.query.operatingHours) >= 0 && parseFloat(req.query.operatingHours) <= 8760)
	{
		pump.operating_hours = parseFloat(req.query.operatingHours);
	}
	else
	{
		errorMessage += " Operating Hours was not included using the default value.";
	}
	if(req.query.costKwHour && parseFloat(req.query.costKwHour) >= 0)
	{
		pump.cost_kw_hour = parseFloat(req.query.costKwHour);
	}
	else
	{
		errorMessage += " Cost Kw Hour was not included as a parameter using default value.";
	}
	if(req.query.efficiency && parseFloat(req.query.efficiency) >= 0)
	{
		pump.efficiency = parseFloat(req.query.efficiency);
	}
	else
	{
		errorMessage += " Efficiency was not included as a parameter using default value.";
	}
	return [pump, errorMessage];
}


exports.CalculateCurrentPumpEfficiency =function(req, res)
{

	var array = setUpPump(req, res);
	var errorMessage = array[1];
	var pump = array[0];
	var pumpResults = psat.resultsExisting(pump);
	if(req.query.testingAPI && req.query.testingAPI == 'true')
	{
		res.json([pumpResults, errorMessage]);
		return;
	}
	res.json([pumpResults]);

}


exports.CalculateModifiedPumpEfficiency =function(req, res)
{
	//modified pump assessment code goes here if it fits the design
	var array = setUpPump(req,res);
	var pump = array[0];
	var modPump = JSON.parse(JSON.stringify(pump));
	var errorMessage = array[1];
	var pumpResultOriginal = psat.resultsExisting(pump);
	var pump_specified;
	modPump.pump_style = 11;
	
	if(req.query.modifiedPumpStyle)
	{
		if(Number.isInteger(parseInt(req.query.modifiedPumpStyle)))
		{
			var value = parseInt(req.query.modifiedPumpStyle);
			if(value < 0 || value >= NUMBER_OF_PUMP_STYLES)
			{
				errorMessage += " Modified Pump Style was not a valid Pump Style";
				res.send(errorMessage);
				return;
			}
			else
			{
				modPump.pump_style = value;
				var values = psat.pumpEfficiency(modPump);
				modPump.pump_specified = parseFloat(values.max);
			}
		}
		else
		{
			errorMessage += " Modified Pump Style was sent as an incorrect value.";
			res.send(errorMessage);
			return;
		}
	}
	else if(pumpResultOriginal.pump_efficiency != null)
	{
		modPump.pump_specified = parseInt(pumpResultOriginal.pump_efficiency*100)/100.0;
	}
	if(req.query.modifiedPumpRatedSpeed && parseFloat(req.query.modifiedPumpRatedSpeed) >= 0)
	{
		modPump.pump_rated_speed = parseFloat(req.query.modifiedPumpRatedSpeed);
	}
	else
	{
		errorMessage += " Modified Pump Rated speed was not found as a parameter using default value.";
	}
	if(req.query.modifiedDrive)
	{
		if(Number.isInteger(parseInt(req.query.modifiedDrive)))
		{
			var value = parseInt(req.query.modifiedDrive);
			if(value < 0 || value >= NUMBER_OF_DRIVES)
			{
				errorMessage += " Modified Motor Drive was passed in with a value that was too large to choose an appropriate drive using default.";
				res.send(errorMessage);
			}
			else
			{
				modPump.drive = value;
			}
		}
		else
		{
			errorMessage += " Modified Drive was passed into as an incorrect data type.";
			res.send(errorMessage);
			return;
		}
	}
	else
	{
		errorMessage += " Modified Drive was not passed as a parameter using default value.";
	}
	if(req.query.modifiedKinematicViscosity && parseFloat(req.query.modifiedKinematicViscosity) >= 0)
	{
		modPump.kinematic_viscosity = parseFloat(req.query.modifiedKinematicViscosity);
	}
	else
	{
		errorMessage += " Modified Kinematic Viscosity was not passed as a parameter using default value.";
	}
	if(req.query.modifiedSpecificGravity && parseFloat(req.query.modifiedSpecificGravity) >= 0)
	{
		modPump.specific_gravity = parseFloat(req.query.modifiedSpecificGravity);
	}
	else
	{
		errorMessage += " Modified Specific Gravity was not passed in as a parameter using default value.";
	}
	if(req.query.modifiedStages && parseFloat(req.query.modifiedStages) >= 1)
	{
		modPump.stages = parseFloat(req.query.modifiedStages);
	}
	else
	{
		errorMessage += " Modified Stages was not passed in as a parameter or was an incorrect value using default value.";
	}
	if(modPump.drive == 4)
	{
		if(req.query.modifiedSpecifiedDriveEfficiency && parseFloat(req.query.modifiedSpecifiedDriveEfficiency))
		{
			modPump.specifiedDriveEfficiency = parseFloat(req.query.modifiedSpecifiedDriveEfficiency);
		}
	}
	if(req.query.modifiedLineFrequency && (parseFloat(req.query.modifiedLineFrequency) == 0.0 || parseFloat(req.query.modifiedLineFrequency) == 1.0))
	{
		modPump.line_frequency = parseFloat(req.query.modifiedLineFrequency);
	}
	else if(req.query.modifiedLineFrequency)
	{
		errorMessage = " Modified Line Frequency was an incorrect value. Correct values are either 50Hz or 60Hz.";
		res.send(errorMessage);
		return;
	}
	else{
		errorMessage += " Modified Line Frequency was not passed in an as a parameter using defaut value.";
	}
	if(req.query.modifiedMotorRatedPower && parseFloat(req.query.modifiedMotorRatedPower) >= 0)
	{
		modPump.motor_rated_power = parseFloat(req.query.modifiedMotorRatedPower);
	}
	else
	{
		errorMessage += " Modified Motor Rated Power was not passed in as a parameter using default value. ";
	}
	if(req.query.modifiedMotorRatedSpeed && parseFloat(req.query.modifiedMotorRatedSpeed) >= 0)
	{
		modPump.motor_rated_speed = parseFloat(req.query.modifiedMotorRatedSpeed);
	}
	else
	{
		errorMessage += " Modified Motor Rated Speed was not passed in as a parameter using default values. ";
	}
	if(req.query.modifiedEfficiencyClass)
	{
		if(Number.isInteger(parseInt(req.query.modifiedEfficiencyClass)))
		{
			var value = parseInt(req.query.modifiedEfficiencyClass);
			if(value < 0 || value >= NUMBER_OF_EFFICIENCY_CLASS)
			{
				errorMessage += " Modified Efficiency class was out of the bounds of acceptable efficiency classes.";
				res.send(errorMessage);
				return;
			}
			modPump.efficiency_class = value;
		}
		else
		{
			errorMessage += " Modified Efficiency class was passed in as a wrong data type.";
			res.send(errorMessage);
			return;
		}
	}
	else
	{
		errorMessage += " Modified Efficiency class was not passed in as a parameter using default value.";
	}
	if(req.query.modifiedMotorRatedVoltage && parseFloat(req.query.modifiedMotorRatedVoltage) >= 0)
	{
		modPump.motor_rated_voltage = parseFloat(req.query.modifiedMotorRatedVoltage);
	}
	else
	{
		errorMessage += " Modified Motor Rated Voltage was not passed in as a parameter using default value.";
	}
	if(req.query.modifiedMotorRatedFla && parseFloat(req.query.modifiedMotorRatedFla) >= 0)
	{
		modPump.motor_rated_fla = parseFloat(req.query.modifiedMotorRatedFla);
	}
	else
	{
		var value = psat.estFLA(pump);
		modPump.motor_rated_fla = parseFloat(value);
	}
	if(req.query.modifiedFlowRate && parseFloat(req.query.modifiedFlowRate) >= 0)
	{
		modPump.flow_rate = parseFloat(req.query.modifiedFlowRate);
	}
	else
	{
		errorMessage += " Modified Flow Rate was not passed in as a parameter using a default value.";
	}
	if(req.query.modifiedHead && parseFloat(req.query.modifiedHead) >= 0)
	{
		modPump.head = parseFloat(req.query.modifiedHead);
	}
	else
	{
		errorMessage += " Modified Head was not passed in as a parameter";
	}
 	if(req.query.modifiedOperatingHours && parseFloat(req.query.modifiedOperatingHours) >= 0 && parseFloat(req.query.modifiedOperatingHours) <= 8760)
	{
		modPump.operating_hours = parseFloat(req.query.modifiedOperatingHours);
	}
	else
	{
		errorMessage += " Modified Operating Hours was not included using the default value.";
	}
	if(req.query.modifiedCostKwHour && parseFloat(req.query.modifiedCostKwHour) >= 0)
	{
		modPump.cost_kw_hour = parseFloat(req.query.modifiedCostKwHour);
	}
	else
	{
		errorMessage += " Modified Cost Kw Hour was not included as a parameter using default value.";
	}
	if(req.query.modifiedEfficiency && parseFloat(req.query.modifiedEfficiency) >= 0)
	{
		modPump.efficiency = parseFloat(req.query.modifiedEfficiency);
	}
	else
	{
		errorMessage += " Modified Efficiency was not included as a parameter using default value.";
	}
	if(req.query.margin && parseFloat(req.query.margin) >= 0)
	{
		modPump.margin = parseFloat(req.query.margin);
	}
	

	pumpResultOriginal = psat.resultsExisting(pump);
	
	var pumpResults = psat.resultsModified(modPump);

	pumpResults.annual_energy_savings= Math.round(-1 * parseFloat(pumpResults.annual_energy) + parseFloat(pumpResultOriginal.annual_energy));
	pumpResults.annual_savings_potential= Math.round(parseInt(-1 * parseFloat(pumpResults.annual_cost) + parseFloat(pumpResultOriginal.annual_cost)));
	var baseline = {
		Name:"BaseLine",
		Results: pumpResultOriginal
	};
	var scenario1 = {
		Name:"Scenario 1",
		Results: pumpResults
	};
	if(req.query.testingAPI && req.query.testingAPI == 'true')
	{
		res.json([baseline, scenario1, errorMessage]);
		return;
	}
	
	res.json([baseline, scenario1]);
}

