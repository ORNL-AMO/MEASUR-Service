# ORNL Team 7 Project

Pump Head Tool Service.  Currently, there are two services created for this project:  the pump head tool service for Suction Guage Elevation and the Suction Tank Elevation.

To access PumpHeadTool service for the SuctionGaugeElevation, using a local browser type in the url 'localhost:8080/pumpheadtool/suctionGaugeElevation? Parameters' (local host due to not having it linked to a url at the current moment), replacing "Parameters" with the parameters being passed in.  Parameters are given names based on what they are from the bindings in the ORNL Tool Suite Bindings.  There is one extra parameter added for helping test the API known as "testingAPI".  If this value is set to true the API will return error messages for which parameters were not read in and also units required to send in and returned values units.

To access PumpHeadTool service for the SuctionTankElevation, using a local browser type in the url 'localhost:8080/pumpheadtool/suctionTankElevation? Parameters', replacing "Parameters" with the parameters being passed in.  Parameters are also given names based on what they have bindings in the ORNL Tool Suite Bindings.  There is no extra parameter for testing this API and this will probably be discussed with the team and the client about whether or not this is a good choice for these services.

For initial setup to run the project, make sure to call "npm install" so that the dependencies are installed.

Afterwards, run "openssl genrsa -out key.pem" and "openssl req -new -key key.pem -out csr.pem" and "openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem" and " rm csr.pem"
finally type in the terminal "node main.js" and that will run the server.

To run the unit tests run "node main.js" and while the node server is running in another terminal run "npm test". 

At the current moment with a self-signed certificate this will fail due to not accepting self-signed certificates. The code that needs to be added to the top of the unit tests.js file to prevent this is listed below but has not been committed due to not being as secure as the development team would like. The code is: "process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;"
