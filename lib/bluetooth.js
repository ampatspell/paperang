let noble = require('@abandonware/noble');

noble.on('discover', peripheral => {
  console.log('discover:', peripheral);
});

noble.on('warning', warning => {
  console.log('warning:', warning);
});

noble.on('stateChange', async (state) => {
  console.log('state change:', state);
  if(state === 'poweredOn') {
    noble.startScanning([ '00001101-0000-1000-8000-00805F9B34FB' ], true, err => {
      console.log(err);
    });
  }
});
