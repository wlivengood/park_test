const pg = require('pg');
let theClient;
let descriptions;
const connString = 'postgres://localhost/park_test';
const parse = require('./parse').parse;

var sql = "SELECT signdesc1 FROM signs LIMIT 100";

if (!theClient){
  pg.connect(connString, function(err, client) {
    theClient = client; //ensures there is only 1 client connection.
    theClient.query(sql, function(err, results) {
    	if (err)
    		console.log(err);
    	else {
    		descriptions = results.rows;
    		descriptions.forEach(function(desc) {
    			console.log("Description: ", desc.signdesc1);
    			console.log("Parsed: ", parse(desc.signdesc1));
    		});
    	}	
    });
  });
}

else {
	theClient.query(sql, function(err, results) {
		if (err)
			console.log(err);
		else {
			descriptions = results.rows;
			descriptions.forEach(function(desc) {
				console.log("Description: ", desc);
				console.log("Parsed: ", parse(desc));
			});
		}	
	});
}


// console.log(descriptions);