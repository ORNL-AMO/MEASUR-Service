var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateHumidityRatio =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/humidityRatioInput.json"));

	var humidityRatio = {
	atmosphericPressure: parseFloat(req.query.atmosphericPressure),
	dryBulbTemp: parseFloat(req.query.dryBulbTemp),
	relativeHumidity: parseFloat(req.query.relativeHumidity),
	wetBulbTemp: parseFloat(req.query.wetBulbTemp)
	};
	
	var value = v.validate(humidityRatio, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var humidityR = phast.humidityRatio(humidityRatio);
	res.json([humidityR]);
}

