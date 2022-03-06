let { getDevice } = require('./device');
let { pack, unpack, commands } = require('./packet');
let { ImageData } = require('./image');
let { createImageData } = require('./png');
let { sleep } = require('./sleep');

(async () => {

  let { device, transfer } = await getDevice();

  if(!device) {
    console.log('no device');
    return;
  }

  // let status = await transfer(commands.status(), { read: true });
  // console.log(status);

  let space = (v=1) => transfer(commands.printFeedLine(v));

  let full = false;

  // get temperature: 0x12
  // receive temperature: 0x13

  // let getTemperature = async () => {
  //   let result = await transfer(pack(0x12), { read: true });
  //   if(result.data.length > 0) {
  //     return result.data.readUInt8(0);
  //   } else {
  //     return 0;
  //   }
  // };

  // console.log('baseline', await getTemperature());

  // let controlTemperature = async () => {
  //   let curr;
  //   do {
  //     await sleep(10000);
  //     curr = await getTemperature();
  //     console.log('current', curr);
  //   } while(curr === 0 && curr > 50);
  //   console.log('ok, go', curr);
  // }

  if(full) {
    await space(250);
    await transfer(commands.paperType(0));
    for(let i = 0; i < 3; i++) {
      // await controlTemperature();
      let buffers = await createImageData();
      for(let buffer of buffers) {
        await transfer(pack(0x00, buffer));
      }
    }
  }

  await space(250);

})();
