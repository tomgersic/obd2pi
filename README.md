# obd2pi

More information at [http://gersic.com/ive-connected-my-car-to-salesforce-com](http://gersic.com/ive-connected-my-car-to-salesforce-com)

This repository contains two scripts that run in conjunction on a Raspberry Pi while connected to an Automotive OBD-II Bluetooth Adapter.

## obd.js

Node.js script that reads from an OBD-II adapter connected to a serial (/dev/rfcomm0) port and logs messages to a TingoDB Database.

Started from the command line with "node obd.js"

###Example Log Output
*{ mode: '43',  
  name: 'requestdtc',  
  value: { errors: [ 'P0444', '-', '-' ] } }  
{ mode: '41', pid: '0D', name: 'vss', value: 0 }  
{ mode: '41', pid: '0C', name: 'rpm', value: 715 }  
{ mode: '41', pid: '05', name: 'temp', value: 60 }  
{ mode: '41', pid: '04', name: 'load_pct', value: 5.46875 }  
{ mode: '43',  
  name: 'requestdtc',  
  value: { errors: [ 'P0444', '-', '-' ] } }  
{ mode: '41', pid: '0D', name: 'vss', value: 0 }  
{ mode: '41', pid: '0C', name: 'rpm', value: 714 }  
{ mode: '41', pid: '05', name: 'temp', value: 62 }  
{ mode: '41', pid: '04', name: 'load_pct', value: 5.078125 }  
{ mode: '43',  
  name: 'requestdtc',  
  value: { errors: [ 'P0444', '-', '-' ] } }  
{ mode: '41', pid: '0D', name: 'vss', value: 0 }  
{ mode: '41', pid: '0C', name: 'rpm', value: 715 }  
{ mode: '41', pid: '05', name: 'temp', value: 63 }  
{ mode: '41', pid: '04', name: 'load_pct', value: 4.6875 }*

##obdsync.js

Node.js Script to send the logged OBD-II Messages from obd.js to Cloud API from Raspberry Pi.

API is [YOUR DOMAIN]/log/:json

Started from the command line with "node obdsync.js your.domain.here.com"

###Example RPM Value
{ mode: '41', pid: '0C', name: 'rpm', value: 706 }
###Example Error Code (response mode 43)
{ mode: '43', name: 'requestdtc', value: { errors: [ ]'P0444', '-', '-' ] } }

###Example payload to API
{ obddata: { mode: '41', pid: '04', name: 'load_pct', value: 10.9375 },  
vin: 'JF1BJ673XPH968228',  
localdatetime: Sun Nov 10 2013 17:23:10 GMT+0000 (UTC),  
_id: 160 } 

###Example Log Output
*Syncing... 3 records remain  
{ obddata: { mode: '41', pid: '04', name: 'load_pct', value: 11.328125 },  
  vin: 'JF1BJ673XPH968228',  
  localdatetime: Sun Nov 10 2013 17:25:55 GMT+0000 (UTC),  
  _id: 180 }  
200  
success  
Syncing... 2 records remain  
{ obddata: { mode: '43', name: 'requestdtc', value: { errors: [Object] } },  
  vin: 'JF1BJ673XPH968228',  
  localdatetime: Sun Nov 10 2013 17:26:05 GMT+0000 (UTC),  
  _id: 181 }  
200  
success  
Syncing... 1 records remain  
{ obddata: { mode: '41', pid: '0D', name: 'vss', value: 0 },  
  vin: 'JF1BJ673XPH968228',  
  localdatetime: Sun Nov 10 2013 17:26:10 GMT+0000 (UTC),  
  _id: 182 }  
200  
success*



