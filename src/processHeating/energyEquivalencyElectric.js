var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
var fs = require('fs');
var inputDirectory = './Input_Documentation/processHeating';
var Validator = require('jsonschema').Validator;

exports.CalculateEnergyEquivalencyElectric =function(req, res)
{
	var v = new Validator();
	var schema = JSON.parse(fs.readFileSync(inputDirectory+"/energyEquivalencyElectricInput.json"));

	var energyEquivalencyElectric = {
	fuelFiredEfficiency: parseFloat(req.query.fuelFiredEfficiency),
	electricallyHeatedEfficiency: parseFloat(req.query.electricallyHeatedEfficiency),
	fuelFiredHeatInput: parseFloat(req.query.fuelFiredHeatInput),
	};
	
	var value = v.validate(energyEquivalencyElectric, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	var energyElectric = phast.energyEquivalencyElectricInput(energyEquivalencyElectric);
	res.json([energyElectric]);
}

