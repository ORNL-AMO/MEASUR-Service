var phast = require("../../node_modules/amo-tools-suite/build/Release/phast.node");
var express = require('express');
exports.Calculateo2Enrichment =function(req, res)
{
	var o2Enrichment = {
	o2CombAir: 1,
	o2CombAirEnriched:1,
	flueGasTemp:1 ,
	flueGasTempEnriched: 1,
	o2FlueGas:1,
	o2FlueGasEnriched:1,
	combAirTemp:1,
	combAirTempEnriched:1,
	fuelConsumption:1
	};
	var message = "Errors Found: ";

if(req.query.o2CombAir && parseFloat(req.query.o2CombAir))
	{
		o2Enrichment.o2CombAir = req.query.o2CombAir;
	}
	else
	{
		message += "Specific Gravity Parameter not found. ";
	}
	if(req.query.o2CombAir && parseFloat(req.query.o2CombAir))
	{
		o2Enrichment.o2CombAir= req.query.o2CombAir;
	}
	else
	{
		message += "Orifice Diameter parameter not found. ";
	}

	if(req.query.o2CombAirEnriched && parseFloat(req.query.o2CombAirEnriched))
	{
		o2Enrichment.o2CombAirEnriched = req.query.o2CombAirEnriched;
	}
	else
	{
		message += "Inside PipeDiameter Diameter parameter not found. ";
	}	
	if(req.query.flueGasTemp && parseFloat(req.query.flueGasTemp))
	{
		o2Enrichment.flueGasTemp= req.query.flueGasTemp;
	}
	else
	{
		message += "Discharge Coefficient parameter not found. ";
	}
if(req.query.flueGasTempEnriched && parseFloat(req.query.flueGasTempEnriched))
	{
		o2Enrichment.flueGasTempEnriched = req.query.flueGasTempEnriched;
	}
	else
	{
		message += "Gas Heating Value parameter not found. ";
	}
if(req.query.o2FlueGas && parseFloat(req.query.o2FlueGas))
	{
		o2Enrichment.o2FlueGas = req.query.o2FlueGas;
	}
	else
	{
		message += "Gas Temperature  parameter not found. ";
	}
if(req.query.o2FlueGasEnriched && parseFloat(req.query.o2FlueGasEnriched))
	{
		o2Enrichment.o2FlueGasEnriched = req.query.o2FlueGasEnriched;
	}
	else
	{
		message += "Gas Pressure parameter not found. ";
	}
if(req.query.combAirTemp && parseFloat(req.query.combAirTemp))
	{
		o2Enrichment.combAirTemp = req.query.combAirTemp;
	}
	else
	{
		message += "Orifice Pressure Drop parameter not found. ";
	}


if(req.query.combAirTempEnriched && parseFloat(req.query.combAirTempEnriched))
	{
		o2Enrichment.combAirTempEnriched= req.query.combAirTempEnriched;
	}
	else
	{
		message += "Operating Time parameter not found. ";
	}
if(req.query.fuelConsumption && parseFloat(req.query.fuelConsumption))
	{
		o2Enrichment.fuelConsumption = req.query.fuelConsumption;
	}
	else
	{
		message += "Discharge Line Loss Coefficients parameter not found. ";
	}


	var o2=phast.o2Enrichment(o2Enrichment);
	res.json([o2]);
	
}
