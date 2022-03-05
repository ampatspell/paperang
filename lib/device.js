const { webusb } = require('usb');
const { unpack } = require('./packet');

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

  let transfer = async (data, { read=false }={}) => {
    let promise = device.transferOut(2, data);
    let ret;
    if(read) {
      let result = await device.transferIn(2, 8192);;
      ret = unpack(Buffer.from(result.data.buffer));
    }
    let result = await promise;
    // console.log(result);
    return ret;
  }

  return {
    device,
    transfer
  };
};

module.exports = {
  getDevice
};
