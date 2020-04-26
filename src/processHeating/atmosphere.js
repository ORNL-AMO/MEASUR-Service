var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateAtmosphere =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/atmosphereInput.json"));

	var atmosphere = {
		inletTemperature: parseFloat(req.query.inletTemperature),
		outletTemperature: parseFloat(req.query.outletTemperature),
		flowRate: parseFloat(req.query.flowRate),
		correctionFactor: parseFloat(req.query.correctionFactor),
		specificHeat: parseFloat(req.query.specificHeat)
	};
	
	var value = v.validate(atmosphere, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var atmo = phast.atmosphere(atmosphere);
	res.json([atmo]);
}

