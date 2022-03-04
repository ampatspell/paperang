const { getDeviceList, WebUSBDevice } = require('usb');

let getDevice = () => {
  let devices = getDeviceList();

  const isPrinter = device => device.deviceDescriptor.idVendor === 17224 && device.deviceDescriptor.idProduct === 21892;

  let device = devices.find(device => isPrinter(device));

  if(!device) {
    return {};
  }

  device.open();

  let { interfaces: [ interface ] } = device;

  interface.claim();

  let { endpoints } = interface;

  let inEndpoint = endpoints.find(endpoint => endpoint.direction === 'in');
  let outEndpoint = endpoints.find(endpoint => endpoint.direction === 'out');

  return {
    device,
    interface,
    inEndpoint,
    outEndpoint
  };
};

module.exports = {
  getDevice
};
