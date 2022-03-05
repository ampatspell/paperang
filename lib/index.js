let { getDevice } = require('./device');
let { pack, unpack, commands } = require('./packet');
let { ImageData } = require('./image');
let { createImageData } = require('./png');
let { sleep } = require('./sleep');

(async () => {

  let { device, transfer } = await getDevice();

  if(!device) {
    return;
  }

  let space = (v=1) => transfer(commands.printFeedLine(v));

  let full = true;

  if(full) {
    await space(250);
    await sleep(60000);
    await transfer(commands.paperType(0));
    for(let i = 0; i < 20; i++) {
      let buffers = await createImageData();
      for(let buffer of buffers) {
        await transfer(pack(0x00, buffer));
      }
      await sleep(60000);
    }
  }

  await space(250);

})();
