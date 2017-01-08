var express = require('express');
var pg = require('pg');
var app = express();

const spawn = require('child_process').spawn;

var connect = 'postgress://postgres:123456@localhost/work';

var client = new pg.Client(connect);

const dedworker = spawn('test.bat', []);

dedworker.stdout.on('data', (data) => {
	console.log(data);
});

dedworker.on('error', function (data) {
	console.log('The Error is: '+ data)
});

client.connect(function (err) {

	if(err){
		throw err;
	}

	client.on('notification', function(msg) {

		var job = JSON.parse(msg.payload);

		// var time = new Date();

		// console.log(time.getTime() / 1000);

		client.query('SELECT * FROM jobs WHERE name=\''+job.name+'\' AND user_id='+job.user_id+' AND status=\'RUNNING\'',

			function (err, res) {

				if(err){
					throw err;
				}

				if(res.rowCount == 0){

					// const dedworker = spawn('cmd.exe', ['/c/xampp/htdocs', 'test.bat'], { shell:true });

					// dedworker.stdout.on('data', (data) => {
					// 	console.log(data);
					// });

					// dedworker.stdin.on('data', (data) => {
					// 	console.log(data);
					// });

					// dedworker.stderr.on('error', function (data) {
					// 	console.log('The Error is: '+ data);
					// });

				}
		});


	});
	var query = client.query("LISTEN watchers");

	console.log('Connect to PostgreSQL');
});

app.get('/', function (req, res) {

	res.send('index');
});

//console.log(time.toISOString().replace(/T/, ' ').replace(/\..+/, '')); Timestamp

app.listen(3000, function() {
	console.log('Server running');
});