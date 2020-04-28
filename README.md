# MEASUR Service Web API

This API is a webservice to use for the AMO Tool Suite.  Dependencies for the suite can be found here:

    https://github.com/ORNL-AMO/AMO-Tools-Suite

In order to run the service, run:

    set-up.sh

The shell script is set up to run the approved code in order to generate the openssl key as well as npm install.  This helps set up the initial steps for the project.

To run the unit tests run "node main.js" and while the node server is running in another terminal run "npm test". 

At the current moment with a self-signed certificate this will fail due to not accepting self-signed certificates. The code that needs to be added to the top of the unit tests.js file to prevent this is listed below but has not been committed due to not being as secure as the development team would like. The code is: "process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;"
