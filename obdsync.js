/**
 * Node.js Script to send OBD-II Messages to Cloud API from Raspberry Pi
 * API is [YOUR DOMAIN]/log/:json
 * 
 * Example RPM Value: { mode: '41', pid: '0C', name: 'rpm', value: 706 }
 * Example Error Code (response mode 43): { mode: '43', name: 'requestdtc', value: { errors: [ 'P0444', '-', '-' ] } }
 * 
 * Example payload to API:
 * { obddata: { mode: '41', pid: '04', name: 'load_pct', value: 10.9375 },
 * vin: 'JF1BJ673XPH968228',
 * localdatetime: Sun Nov 10 2013 17:23:10 GMT+0000 (UTC),
 * _id: 160 }
 **/


var http = require('http');
var Db = require('tingodb')().Db,
    assert = require('assert');

var logFileName = "./obdLog.db";

var db = new Db(logFileName, {});
var logger = db.collection("logger");

var cursor = logger.find({}).limit(1);

var argHost = process.argv[2];

var options = {
	host:argHost,
	path:"",
	method:"GET",
	port:"80"
};

setInterval(syncOneRecord,2000);

function syncOneRecord(){

	//check to see if we're connected and can reach the remote API
	require('dns').resolve(argHost, function(err) {
		if (err){
	     	// no connection
	     	console.log("not connected");
		}
		else {
			logger.find({}).count(function (err, count) {
				console.log("Syncing... "+count+" records remain");
				if(count == 0) return;
			});


			logger.findOne({}, function(err, item) {
				assert.equal(null, err);
				if(item==null) return;

				console.log(item);

				options.path = "/log/"+JSON.stringify(item);

				http.get(options,function(resp) {
					console.log(resp.statusCode);

					//if(resp.statusCode == 200) {
						logger.remove({'_id':item._id});
					//}

					var respstr = '';

					resp.on('data',function(chunk){
						respstr += chunk;
					});

					resp.on('end',function() {
						console.log(respstr);
					});
				}).on("error", function(e){
					console.log("Got error: " + e.message);
				});
			});		
		}
	});
}