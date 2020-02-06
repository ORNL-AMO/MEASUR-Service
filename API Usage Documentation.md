For initial setup to run the project, make sure to call:

    npm install

from the command line so that the required dependencies are installed.  Afterwards, type
in the terminal:

    node main.js

and that will run the server.  Once that is set up, using any browser, type in the URL
address bar:

    localhost:8080

followed by the desired service you are looking to use.  A list of the services are below:

    ----------------------------|------------------------------------
    Pump Head Tool Services:    | /pumpheadtool
        Suction Gauge Elevation | /pumpheadtool/suctionGaugeElevation
        Suction Tank Elevation  | /pumpheadtool/suctionTankElevation
    ----------------------------|------------------------------------

Afterwards, add ? followed by the parameters for your selected service.  Parameters are
given their names based on what they are from the bindings in the ORNL Tool Suite 
Bindings.  The parameters for each service are as follows (Replace # with your numbers):

    -----------------------------------------|----------------------------------|----------------
    Suction Gauge Elevation:                 |                                  | Default  Values
    -----------------------------------------|----------------------------------|----------------
        Specific Gravity                     | specificGravity=#.#              |             1.0
        Flow Rate                            | flowRate=#                       |            2000
        Suction Pipe Diameter                | suctionPipeDiameter=#.#          |            12.0
        Suction Gauge Presure                | suctionGaugePressure=#.#         |             5.0
        Suction Gauge Elevation              | suctionGaugeElevation=#.#        |            10.0
        Suction Line Loss Coefficients       | suctionLineLossCoefficient=#.#   |             0.5
        Discharge Pipe Diameter              | dischargePipeDiameter=#.#        |            12.0
        Discharge Gauge Pressure             | dischargeGaugePressure=#.#       |           124.0
        Discharge Gauge Elevation            | dischargeGaugeElevation=#.#      |            10.0
        Discharge Line Loss Coefficient      | dischargeLineLossCoefficient=#.# |             1.0
    -----------------------------------------|----------------------------------|----------------
    Suction Tank Elevation:                  |                                  | Default  Values
    -----------------------------------------|----------------------------------|----------------
        Specific Gravity                     | specificGravity=#.#              |             1.0
        Flow Rate                            | flowRate=#                       |            2000
        Suction Pipe Diameter                | suctionPipeDiameter=#.#          |            12.0
        Suction Tank Gas Over Presure        | suctionTankGasOverPressure=#.#   |             5.0
        Suction Tank Fluid Surface Elevation | suctionTankFluidOverPressure=#.# |            10.0
        Suction Line Loss Coefficients       | suctionLineLossCoefficient=#.#   |             0.5
        Discharge Pipe Diameter              | dischargePipeDiameter=#.#        |            12.0
        Discharge Gauge Pressure             | dischargeGaugePressure=#.#       |           124.0
        Discharge Gauge Elevation            | dischargeGaugeElevation=#.#      |            10.0
        Discharge Line Loss Coefficient      | dischargeLineLossCoefficient=#.# |             1.0
    -----------------------------------------|----------------------------------|----------------
    Test API:  Used when testing functionality of code, uses default values     | testingAPI=true
    -----------------------------------------|----------------------------------|----------------

Be sure to include an & between each parameter.  An example of accessing the Suction Gauge
Elevation of the Pump Head Tool Service is:

    localhost:8080/pumpheadtool/suctionGaugeElevation?specificGravity=1.0&flowRate=2000&
    suctionPipeDiameter=12.0&suctionGaugePressure=5.0&suctionGaugeElevation=10.0&suction
    LineLossCoefficient=0.5&dischargePipeDiameter=12.0&dischargeGaugePressure=124.0&
    dischargeGaugeElevation=10.0&dischargeLineLossCoefficient=1.0

There is one extra parameter added for helping test the API known as "testingAPI".  If
this value is set to true, the API will return error messages for the parameters which
were not read in as well as units required to send in and returned values units.  An
example of using the test parameter for the Suction Gauge Elevation for the Pump Head
Tool Service is as follows:

    localhost:8080/pumpheadtool/suctionGaugeElevation?testingAPI=true
