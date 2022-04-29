(async () => {

  const { getDeviceList, WebUSBDevice } = require('usb');
  const { sleep } = require('./sleep');

  let isPrinter = device => device.deviceDescriptor.idVendor === 17224 && device.deviceDescriptor.idProduct === 21892;

  for(let i = 0; i < 100; i++) {
    let devices = getDeviceList();
    await sleep(100);
    console.log(i);
    let printers = devices.filter(device => isPrinter(device));
    await Promise.all(printers.map(async printer => {
      let device = await WebUSBDevice.createInstance(printer);
      if(!device) {
        return;
      }
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      await device.close();
    }));
    console.log(printers);
  }

})();
