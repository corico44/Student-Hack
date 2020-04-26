const express = require('express')
const app = express()
const port = 80
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;
//var async = require('async');

function publish(){
		
		var name = document.getElementById("name").value;
		var zone = document.getElementById("zone").value;
		var email = document.getElementById("email").value;
		var phone = document.getElementById("phone").value;
			document.getElementById("demo").innerHTML = name;
//		Insert(name, zone);
  
};



function executeStatement1(connection, name, zone, email, phone) { 
		request = new Request("INSERT INTO Helpers (Name, Zone, Email, Phone) VALUES (@Name, @Zone, @Email, @Phone);", function(err) {  
         if (err) {  
            console.log(err);}  
        });
		request.addParameter('Name', TYPES.NVarChar,name);	
		request.addParameter('Zone', TYPES.NVarChar ,zone); 
		request.addParameter('Email', TYPES.NVarChar,email);
		request.addParameter('Phone', TYPES.NVarChar,phone);
		request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                console.log("Product id of inserted item is " + column.value);  
              }  
            });  
        });
		connection.execSql(request);
		
};

var config = {
  server: 'studenthackathon.database.windows.net',
  authentication: {
      type: 'default',
      options: {
          userName: 'student', // update me
          password: 'Hackathon3' // update me
      }
  },
  options: {
	encrypt: true,
    database: 'Supermarkets'
  }
};

function main(name,zone,email,phone){

		//var email = document.getElementById("email").value;
		//var phone = document.getElementById("phone").value;
		console.log("hola1");
	//		document.getElementById("demo").innerHTML = name;
	// Create connection to database
	var connection = new Connection(config);
	connection.on('connect', function(err) {  
		// If no error, then good to proceed.  
		console.log("Connected");  
		executeStatement1(connection,name,zone,email,phone);
	});
	
};

app.get('/login', (req, res) => {
	console.log(req.query.name,req.query.zone,req.query.email,req.query.phone);
	main(req.query.name,req.query.zone,req.query.email,req.query.phone);

})

app.get('/helpers', (req, res) => {
	var connection = new Connection(config);
	connection.on('connect', function(err) {  
		// If no error, then good to proceed.  
		console.log("Connected");  
		
		request = new Request("SELECT * FROM Helpers;", function(err) {  
			if (err) {  
				console.log(err);
			}  
		});
		var list = [];	
		request.on('row', function(columns) {  
			list.push(columns);		
		});
		request.on('requestCompleted', function () { res.send(list) });	
		connection.execSql(request);
	});
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))