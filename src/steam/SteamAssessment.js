var ssmt = require("../../node_modules/amo-tools-suite/build/Release/ssmt.node");
var express = require('express');

var inputDirectory = './Input_Documentation/Steam';
var Validator = require('jsonschema').Validator;
var fs = require('fs');


exports.SteamBaseline =function(req, res)
{

	var v = new Validator();
	var schema = fs.readFileSync(inputDirectory+"/SteamAssessmentInput.json");
	schema = JSON.parse(schema);
	var steam = "";
	try
	{
		var numberOfHeaders = 0;
		var a = TestJSON(req.query.headerInput) ? JSON.parse(req.query.headerInput) : "None";
		if(a != "None")
		{	
			//console.log(a);
			if(a.hasOwnProperty("highPressureHeader") && a["highPressureHeader"].hasOwnProperty("pressure")) {
				numberOfHeaders = 1;
				if(a.hasOwnProperty("lowPressureHeader") && a["lowPressureHeader"].hasOwnProperty("pressure"))
				{
					numberOfHeaders = 2;
					if(a.hasOwnProperty("mediumPressureHeader") && (a["mediumPressureHeader"].hasOwnProperty("pressure"))){
						numberOfHeaders = 3;
					}
				}
			}
			else{
				res.status(400).json("There was an issue reading in the high pressure header input object.");
				return;
			}
			//console.log(numberOfHeaders);
		}
		else{
			res.status(400).json("There was an issue reading in the header input object.");
			return;
		}

		steam = {
			baselinePowerDemand: parseFloat(req.query.baselinePowerDemand),
		
			isBaselineCalc: TestJSON(req.query.isBaselineCalc.toLowerCase())? JSON.parse(req.query.isBaselineCalc.toLowerCase()) : false,
			operationsInput: TestJSON(req.query.operationsInput)? JSON.parse(req.query.operationsInput) : "Operations input was in an incorrect JSON format",
			boilerInput: TestJSON(req.query.boilerInput)? JSON.parse(req.query.boilerInput) : "Boiler Input was in an incorrect status",
			headerInput: TestJSON(req.query.headerInput) && numberOfHeaders == 3? JSON.parse(req.query.headerInput): numberOfHeaders == 0 ? "Incorrect headerInput set up for parsing JSON." : numberOfHeaders == 1 ? {
				highPressureHeader:  a["highPressureHeader"],
				mediumPressureHeader: null,
				lowPressureHeader: null
			} : 
			{
				highPressureHeader: a["highPressureHeader"],
				lowPressureHeader: a["lowPressureHeader"] ,
				mediumPressureHeader:  null
			},
			turbineInput: TestJSON(req.query.turbineInput) ? JSON.parse(req.query.turbineInput) : 
			{
				highToLowTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue1": 0,
					"operationValue2": 0,
					"useTurbine":false
				},
				highToMediumTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue1": 0,
					"operationValue2": 0,
					"useTurbine":false
				},
				mediumToLowTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue1": 0,
					"operationValue2": 0,
					"useTurbine":false
				},
				condensingTurbine:{
					"isentropicEfficiency": 0,
					"generationEfficiency": 0,
					"condenserPressure": 0,
					"operationType": 0,
					"operationValue": 0,
					"useTurbine":false
				}
			}
		};
		if(steam["boilerInput"]["preheatMakeUpWater"] == false)
		{
			steam["boilerInput"]["approachTemperature"] = steam["boilerInput"]["steamTemperature"]
		}
		//console.log(steam);
	}catch(e)
	{
		res.json([e.message, "JSON parsing failed please verify that the parameters passed in were of the correct structure"]);
		return;
	}
	var value = v.validate(steam, schema);
	if(value.errors != "")
	{
		res.json([value.errors]);
		return;
	}
	try
	{
		var results = ssmt.steamModeler(steam);
		res.json([results]);
	}catch(e){
		res.json([e.message]);
	}
}

TestJSON = function(string)
{
	try
	{
		JSON.parse(string);
		return true;
	}
	catch(e)
	{
		return false;
	}

}
