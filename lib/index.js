import { getDevice } from './device.js';
import { pack, unpack, commands } from './packet.js';
import ImageData from './image.js';
import { createImageData } from './png.js';
import { sleep } from './sleep.js';

let { device, transfer } = await getDevice();

if(!device) {
  console.log('no device');
  process.exit(-1);
}

let space = (v=1) => transfer(commands.printFeedLine(v));

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

let full = true;

if(full) {
  await space(250);
  await transfer(commands.paperType(0));
  for(let i = 0; i < 3; i++) {
    let buffers = await createImageData();
    for(let buffer of buffers) {
      await transfer(pack(0x00, buffer));
    }
  }
}

await space(250);
