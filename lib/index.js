let { getDevice } = require('./device');
let { pack, unpack, commands } = require('./packet');
let { Bits } = require('./bits');
let { image } = require('./png');

(async () => {

  let { device, transfer } = await getDevice();

  if(!device) {
    return;
  }

  await transfer(commands.paperType(0));

  //

  // 1 line is 1152px wide

  let line = async () => {
    let buffer = Buffer.alloc(1152);
    buffer.fill(100);
    for(let i = 0; i < 50; i++) {
      await transfer(pack(0x00, buffer));
    }
  }

  let space = (v=1) => transfer(commands.printFeedLine(v));

  await line();
  await space(250);

})();
