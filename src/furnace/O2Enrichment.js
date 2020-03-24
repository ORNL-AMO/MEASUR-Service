var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');

var inputDirectory = './Input_Documentation/furnace';
var Validator = require('jsonschema').Validator;
var fs = require('fs');

exports.Calculateo2Enrichment =function(req, res)
{

	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/O2EnrichmentInput.json"));

	var o2Enrichment = {
	o2CombAir: parseFloat(req.query.o2CombAir),
	o2CombAirEnriched: parseFloat(req.query.o2CombAirEnriched),
	flueGasTemp: parseFloat(req.query.flueGasTemp),
	flueGasTempEnriched: parseFloat(req.query.flueGasTempEnriched),
	o2FlueGas: parseFloat(req.query.o2FlueGas),
	o2FlueGasEnriched: parseFloat(req.query.o2FlueGasEnriched),
	combAirTemp: parseFloat(req.query.combAirTemp),
	combAirTempEnriched: parseFloat(req.query.combAirTempEnriched),
	fuelConsumption: parseFloat(req.query.fuelConsumption)
	};

	var value = v.validate(o2Enrichment, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}

	var o2=phast.o2Enrichment(o2Enrichment);
	res.json([o2]);
	
}
