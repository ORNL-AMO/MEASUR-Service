var fan = require("../../node_modules/amo-tools-suite/build/Release/fan.node");
var express = require('express');
var Validator = require('jsonschema').Validator;
var fs = require("fs");

const gasTypeEnum = ["AIR", "STANDARDAIR", "OTHERGAS"];

//https://localhost:8080/fan/CalculateFanTraverseAnalysis?fanSpeed=1191&motorSpeed=1191&fanSpeedCorrected=1170&densityCorrected=0.05&pressureBarometricCorrected=26.28&fanInletFlangeArea=65.09231805555557&fanInletFlangeLength=32.63&fanInletFlangeDryBulbTemp=123&fanInletFlangeBarometricPressure=26.57&fanEvaseOrOutletFlangeArea=37.916666666666664&fanEvaseOrOutletFlangeDryBulbTemp=132.7&fanEvaseOrOutletFlangeBarometricPressure=26.57&inletMstPlaneArea=65.09231805555557&inletMstPlaneDryBulbTemp=123&inletMstPlaneBarometricPressure=26.57&inletMstPlaneStaticPressure=-17.55&outletMstPlaneArea=23.280248611111112&outletMstPlaneDryBulbTemp=132.7&outletMstPlaneBarometricPressure=26.57&outletMstPlaneStaticPressure=1.8&fanShaftPowerMotorShaftPower=1759.1692438053442&fanShaftPowerEfficiencyMotor=95&fanShaftPowerEfficiencyVFD=100&fanShaftPowerEfficiencyBelt=100&fanShaftPowerSumSEF=0&planeDataPlane5upstreamOfPlane2=true&planeDataTotalPressureLossBtwnPlanes1and4=0&planeDataTotalPressureLossBtwnPlanes2and5=0.627&flowTraverseArea=32.54615902777778&flowTraverseDryBulbTemp=123&flowTraverseBarometricPressure=26.57&flowTraverseStaticPressure=-18.1&flowTraversePitotTubeCoefficient=0.87292611371180784&flowTraverseTraverseData=[[0.701,0.703,0.6675,0.815,%200.979,1.09,1.155,1.320,1.578,2.130],[0.690,0.648,0.555,0.760,0.988,1.060,1.100,1.110,1.458,1.865],[0.691,0.621,0.610,0.774,0.747,0.835,0.8825,1.23,1.210,1.569]]&addlTraversePlanesArea=32.54615902777778&addlTraversePlanesDryBulbTemp=123&addlTraversePlanesBarometricPressure=26.57&addlTraversePlanesStaticPressure=-17.0&addlTraversePlanesPitotTubeCoefficient=0.87292611371180784&addlTraversePlanesTraverseData=[[0.662,0.568,0.546,0.564,0.463,0.507,0.865,1.017,1.247,0.630],[0.639,0.542,0.530,0.570,0.603,0.750,0.965,1.014,1.246,1.596],[0.554,0.452,0.453,0.581,0.551,0.724,0.844,1.077,1.323,1.620]]&baseGasDensityDryBulbTemp=123&baseGasDensityBarometricPressure=26.57&baseGasDensityStaticPressure=-17.6&baseGasDensityGasDensity=0.0547&baseGasDensityGasType=AIR


exports.CalculateFanTraverseAnalysis = function(req, res)
{
    var fan203 =
    {
        FanRatedInfo: getFanRatedInfo(req, res),
        PlaneData: getPlaneData(req, res),
        BaseGasDensity: getBaseGasDensity(req, res),
        FanShaftPower: getFanShaftPower(req, res)
    };
    

    var input = validateInput(fan203);
    
    
    if(input.errors != "")
    {
        res.json(input.errors);
        return;
    }

    var result = fan.fan203(fan203);
    
    //console.log(result);
    
    res.json(result);
}


var getFanRatedInfo = function(req, res)
{
    var FanRatedInfo = 
    {
        fanSpeed: parseFloat(req.query.fanSpeed),
        motorSpeed: parseFloat(req.query.motorSpeed),
        fanSpeedCorrected: parseFloat(req.query.fanSpeedCorrected),
        densityCorrected: parseFloat(req.query.densityCorrected),
        pressureBarometricCorrected: parseFloat(req.query.pressureBarometricCorrected)
    };

    return FanRatedInfo;
    
}    

var getPlaneData = function(req, res)
{
    var PlaneData =
    {
        plane5upstreamOfPlane2: req.query.planeDataPlane5upstreamOfPlane2,
        totalPressureLossBtwnPlanes1and4: parseFloat(req.query.planeDataTotalPressureLossBtwnPlanes1and4),
        totalPressureLossBtwnPlanes2and5: parseFloat(req.query.planeDataTotalPressureLossBtwnPlanes2and5),
        FanInletFlange: getFanInletFlange(req, res),
        FanEvaseOrOutletFlange: getFanEvaseOrOutletFlange(req, res),
        FlowTraverse: getFlowTraverse(req, res),
        AddlTraversePlanes: getAddlTraversePlanes(req, res),
        InletMstPlane: getInletMstPlane(req, res),
        OutletMstPlane: getOutletMstPlane(req, res)
        
    };
    
    return PlaneData;
}; 

var getFanInletFlange = function(req, res)
{
    var fanInletFlange =
    {
        area: parseFloat(req.query.fanInletFlangeArea),
        length: parseFloat(req.query.fanInletFlangeLength),
        dryBulbTemp: parseFloat(req.query.fanInletFlangeDryBulbTemp),
        barometricPressure: parseFloat(req.query.fanInletFlangeBarometricPressure)
    };

    return fanInletFlange
}; 

var getFanEvaseOrOutletFlange = function(req, res)
{
    var fanEvaseOrOutletFlange =
    {
        area: parseFloat(req.query.fanEvaseOrOutletFlangeArea),
        dryBulbTemp: parseFloat(req.query.fanEvaseOrOutletFlangeDryBulbTemp),
        barometricPressure: parseFloat(req.query.fanEvaseOrOutletFlangeBarometricPressure)
    };
    
    return fanEvaseOrOutletFlange;
}; 

var getFlowTraverse = function(req, res)
{
    var flowTraverse = 
    {
        area: parseFloat(req.query.flowTraverseArea),
        dryBulbTemp: parseFloat(req.query.flowTraverseDryBulbTemp),
        barometricPressure: parseFloat(req.query.flowTraverseBarometricPressure),
        staticPressure: parseFloat(req.query.flowTraverseStaticPressure),
        pitotTubeCoefficient: parseFloat(req.query.flowTraversePitotTubeCoefficient),
        traverseData: JSON.parse(req.query.flowTraverseTraverseData)
    };
    
    return flowTraverse;
}; 

var getAddlTraversePlanes = function(req, res)
{
    var addlTraversePlanes = 
    [
        {
            area: parseFloat(req.query.addlTraversePlanesArea),
            dryBulbTemp: parseFloat(req.query.addlTraversePlanesDryBulbTemp),
            barometricPressure: parseFloat(req.query.addlTraversePlanesBarometricPressure),
            staticPressure: parseFloat(req.query.addlTraversePlanesStaticPressure),
            pitotTubeCoefficient: parseFloat(req.query.addlTraversePlanesPitotTubeCoefficient),
            traverseData: JSON.parse(req.query.addlTraversePlanesTraverseData)
        }
    ];
    
    return addlTraversePlanes;
}; 

var getInletMstPlane = function(req, res)
{
    var inletMstPlane =
    {
        area: parseFloat(req.query.inletMstPlaneArea),
        dryBulbTemp: parseFloat(req.query.inletMstPlaneDryBulbTemp),
        barometricPressure: parseFloat(req.query.inletMstPlaneBarometricPressure),
        staticPressure: parseFloat(req.query.inletMstPlaneStaticPressure)

    };
    
    return inletMstPlane;
};

var getOutletMstPlane = function(req, res)
{
    var outletMstPlane = 
    {
        area: parseFloat(req.query.outletMstPlaneArea),
        dryBulbTemp: parseFloat(req.query.outletMstPlaneDryBulbTemp),
        barometricPressure: parseFloat(req.query.outletMstPlaneBarometricPressure),
        staticPressure: parseFloat(req.query.outletMstPlaneStaticPressure)
    };
    
    return outletMstPlane;
};


//******************************************************************

var getBaseGasDensity = function(req, res)
{
    var BaseGasDensity =
    {
        dryBulbTemp: parseFloat(req.query.baseGasDensityDryBulbTemp),
        staticPressure: parseFloat(req.query.baseGasDensityStaticPressure),
        barometricPressure: parseFloat(req.query.baseGasDensityBarometricPressure),
        gasDensity: parseFloat(req.query.baseGasDensityGasDensity),
        gasType: req.query.baseGasDensityGasType
    };
    
    
    return BaseGasDensity;
}; 



var getFanShaftPower = function(req, res)
{
    var FanShaftPower =
    {
            motorShaftPower: parseFloat(req.query.fanShaftPowerMotorShaftPower),
            efficiencyMotor: parseFloat(req.query.fanShaftPowerEfficiencyMotor),
            efficiencyVFD: parseFloat(req.query.fanShaftPowerEfficiencyVFD),
            efficiencyBelt: parseFloat(req.query.fanShaftPowerEfficiencyBelt),
            sumSEF: parseFloat(req.query.fanShaftPowerSumSEF)
    };
    
    return FanShaftPower;
};


var validateInput = function(fan203)
{
    var input =
    {
        fanSpeed: fan203.FanRatedInfo.fanSpeed,
        motorSpeed: fan203.FanRatedInfo.motorSpeed,
        fanSpeedCorrected: fan203.FanRatedInfo.fanSpeedCorrected,
        densityCorrected: fan203.FanRatedInfo.densityCorrected,
        pressureBarometricCorrected: fan203.FanRatedInfo.pressureBarometricCorrected,
        planeDataPlane5upstreamOfPlane2: fan203.PlaneData.plane5upstreamOfPlane2,
        planeDataTotalPressureLossBtwnPlanes1and4: fan203.PlaneData.totalPressureLossBtwnPlanes1and4,
        planeDataTotalPressureLossBtwnPlanes2and5: fan203.PlaneData.totalPressureLossBtwnPlanes2and5,
        fanInletFlangeArea: fan203.PlaneData.FanInletFlange.area,
        fanInletFlangeLength: fan203.PlaneData.FanInletFlange.length,
        fanInletFlangeDryBulbTemp: fan203.PlaneData.FanInletFlange.dryBulbTemp,
        fanInletFlangeBarometricPressure: fan203.PlaneData.FanInletFlange.barometricPressure,
        fanEvaseOrOutletFlangeArea: fan203.PlaneData.FanEvaseOrOutletFlange.area,
        fanEvaseOrOutletFlangeDryBulbTemp: fan203.PlaneData.FanEvaseOrOutletFlange.dryBulbTemp,
        fanEvaseOrOutletFlangeBarometricPressure: fan203.PlaneData.FanEvaseOrOutletFlange.barometricPressure,
        flowTraverseArea: fan203.PlaneData.FlowTraverse.area,
        flowTraverseDryBulbTemp: fan203.PlaneData.FlowTraverse.dryBulbTemp,
        flowTraverseBarometricPressure: fan203.PlaneData.FlowTraverse.barometricPressure,
        flowTraverseStaticPressure: fan203.PlaneData.FlowTraverse.staticPressure,
        flowTraversePitotTubeCoefficient: fan203.PlaneData.FlowTraverse.pitotTubeCoefficient,
        flowTraverseTraverseData: fan203.PlaneData.FlowTraverse.traverseData,
        addlTraversePlanesArea: fan203.PlaneData.AddlTraversePlanes[0].area,
        addlTraversePlanesDryBulbTemp: fan203.PlaneData.AddlTraversePlanes[0].dryBulbTemp,
        addlTraversePlanesBarometricPressure: fan203.PlaneData.AddlTraversePlanes[0].barometricPressure,
        addlTraversePlanesStaticPressure: fan203.PlaneData.AddlTraversePlanes[0].staticPressure,
        addlTraversePlanesPitotTubeCoefficient: fan203.PlaneData.AddlTraversePlanes[0].pitotTubeCoefficient,
        addlTraversePlanesTraverseData: fan203.PlaneData.AddlTraversePlanes[0].traverseData,
        inletMstPlaneArea: fan203.PlaneData.InletMstPlane.area,
        inletMstPlaneDryBulbTemp: fan203.PlaneData.InletMstPlane.dryBulbTemp,
        inletMstPlaneBarometricPressure: fan203.PlaneData.InletMstPlane.barometricPressure,
        inletMstPlaneStaticPressure: fan203.PlaneData.InletMstPlane.staticPressure,
        outletMstPlaneArea: fan203.PlaneData.OutletMstPlane.area,
        outletMstPlaneDryBulbTemp: fan203.PlaneData.OutletMstPlane.dryBulbTemp,
        outletMstPlaneBarometricPressure: fan203.PlaneData.OutletMstPlane.barometricPressure,
        outletMstPlaneStaticPressure: fan203.PlaneData.OutletMstPlane.staticPressure,
        baseGasDensityDryBulbTemp: fan203.BaseGasDensity.dryBulbTemp,
        baseGasDensityStaticPressure: fan203.BaseGasDensity.staticPressure,
        baseGasDensityBarometricPressure: fan203.BaseGasDensity.barometricPressure,
        baseGasDensityGasDensity: fan203.BaseGasDensity.gasDensity,
        baseGasDensityGasType: fan203.BaseGasDensity.gasType,
        fanShaftPowerMotorShaftPower: fan203.FanShaftPower.motorShaftPower,
        fanShaftPowerEfficiencyMotor: fan203.FanShaftPower.efficiencyMotor,
        fanShaftPowerEfficiencyVFD: fan203.FanShaftPower.efficiencyVFD,
        fanShaftPowerEfficiencyBelt: fan203.FanShaftPower.efficiencyBelt,
        fanShaftPowerSumSEF: fan203.FanShaftPower.sumSEF
    };
    
    
    var v = new Validator();
    var schema = JSON.parse(fs.readFileSync("./Input_Documentation/Fan/Fan203Input.json"));
    
    var value = v.validate(input, schema);
    
    return value;
    
    
}
