// achieved listening ubuntu@ip-172-31-17-80
// git clone this file to the ubuntu with ssh - git clone https://github.com/ZeynoUstun/week9.git
// pm2 start w9
// started app 

var request = require('request');
const { Client } = require('pg');

// PARTICLE PHOTON
    // exported PHOTON_ID and PHOTON_TOKEN in the terminal 
    // changed the particle variable 
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'fototilt';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;

// AWS RDS POSTGRESQL INSTANCE

    // exported the host AWSRDS_EP and the password in the terminal AWSRDS_PW
var db_credentials = new Object();
db_credentials.user = 'zeyno';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'datastructure';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var getAndWriteData = function() {
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        // Store sensor values in variables
        var device_json_string = JSON.parse(body).result;
        var tilt = JSON.parse(device_json_string).tilt;
        var light = JSON.parse(device_json_string).light;

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        
            // changed thisQuery to my own sql table 
        var thisQuery = "INSERT INTO sensorsdata VALUES (" + tilt + "," + light + ", DEFAULT);";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// write a new row of sensor data every five minutes
setInterval(getAndWriteData, 300000);







