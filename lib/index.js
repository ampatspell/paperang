let { getDevice } = require('./device');
let { pack, unpack, commands } = require('./packet');

let { device, inEndpoint, outEndpoint } = getDevice();

if(!device) {
  console.log('no device');
  return;
}

let packet = commands.printFeedLine(10);
console.log('packet', packet);

//

inEndpoint.startPoll(1, 64);
inEndpoint.on('data', data => {
  console.log('inEndpoint data', data);
  console.log(unpack(data));
});

outEndpoint.transfer(packet, (err, res) => {
  console.log('outEndpoint transfer result', err, res);
});
