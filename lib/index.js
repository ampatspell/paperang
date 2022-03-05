let { getDevice } = require('./device');
let { pack, unpack, commands } = require('./packet');
let { ImageData } = require('./image');
let { createImageData } = require('./png');

(async () => {

  let { device, transfer } = await getDevice();

  if(!device) {
    return;
  }

  await transfer(commands.paperType(0));

  let buffers = await createImageData();
  for(let buffer of buffers) {
    await transfer(pack(0x00, buffer));
  }


  // let image = new ImageData({ width: 576 });
  // for(let y = 0; y < 50; y++) {
  //   let line = image.addLine();
  //   if(y === 0 || y === 49) {
  //     for(let x = 0; x < line.width; x++) {
  //       line.set(x, true);
  //     }
  //   }
  // }

  // for(let i = 0; i < 49; i++) {
  //   let line = image.line(i + 1);
  //   line.set(i, true);
  // }

  // let buffers = image.pack({ chunk: 16 });
  // for(let buffer of buffers) {
  //   await transfer(pack(0x00, buffer));
  // }

  let space = (v=1) => transfer(commands.printFeedLine(v));
  await space(250);

})();
