const { webusb } = require('usb');

let getDevice = async () => {

  let device = await webusb.requestDevice({
    filters: [
      { services: [ '00001101-0000-1000-8000-00805F9B34FB' ] }
    ]
  });

  if(!device) {
    return {};
  }

  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);

  let transfer = async data => {
    let result = await device.transferOut(2, data);
    console.log(result);
  }

  return {
    device,
    transfer
  };
};

module.exports = {
  getDevice
};
