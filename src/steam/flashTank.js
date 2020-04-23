var ssmt = require("../../node_modules/amo-tools-suite/build/Release/ssmt.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/steam';
var Validator = require('jsonschema').Validator;

exports.CalculateFlashTank =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/flashTankInput.json"));

	var flashTank = {
	inletWaterPressure: parseFloat(req.query.inletWaterPressure),
	quantityValue: parseFloat(req.query.quantityValue),
	inletWaterMassFlow: parseFloat(req.query.inletWaterMassFlow),
	tankPressure: parseFloat(req.query.tankPressure)
	};
	
	var value = v.validate(flashTank, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var FT = ssmt.flashTank(flashTank);
	res.json([FT]);
}

