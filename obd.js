/**
 * Reads from an OBD-II adapter connected to a serial (/dev/rfcomm0) port and logs
 * messages to a TingoDB Database
 **/

var OBDReader = require('serial-obd');
var Db = require('tingodb')().Db,
    assert = require('assert');
var mkdirp = require('mkdirp');
var _ = require('underscore')._;

var options = {};
options.baudrate = 115200;

//The Bluetooth OBDII Reader is connected on the Raspberry Pi to /dev/rfcomm0
var serialOBDReader = new OBDReader("/dev/rfcomm0", options);

var dataReceivedMarker = {};
var logFileName = "./obdLog.db";

//create the log directory if not exists
mkdirp(logFileName, function (err) {
    if (err) console.error(err)
});

//Using TingoDB (file-based MongoDB), we'll log any OBD-II messages to the SD Card
var db = new Db(logFileName, {});
var logger = db.collection("logger");

//Just spoof a VIN number for now for public demo purposes
//We could grab the VIN from OBD-II with a mode 09 query with a PID value of 02, but...
//I don't really know if VIN numbers should be kept private, so just in case
var vinNumber = "JF1BJ673XPH968228"; 

//Log messages as they're received
serialOBDReader.on('dataReceived', function (data) {
    console.log(data);
    //don't log empty responses or responses to commands that are just "OK"
    if(data != null && !_.isEmpty(data) && data.value != null && data.value != 'OK' && data.value != '?') {
        logMessage(data);
    }
	else {
		console.log("Empty message, not logging");
	}

    dataReceivedMarker = data;
});

//
serialOBDReader.on('connected', function (data) {
	//this.addPoller("vinsupp0"); //don't pull the VIN for demo purposes
	this.addPoller("requestdtc");
    this.addPoller("vss");
    this.addPoller("rpm");
    this.addPoller("temp");
    this.addPoller("load_pct");

    this.startPolling(5000*6); //Polls all added pollers each 2000 ms.
});

serialOBDReader.connect();

//actual logging
function logMessage(data) {
    var logLine = new Object();
    logLine["obddata"] = data;
    logLine["vin"] = vinNumber;
    logLine["localdatetime"] = new Date();

    logger.insert(logLine,function(err,result){
        assert.equal(null, err);
    });
}
