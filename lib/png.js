import { PNG } from 'pngjs';
import fs from 'fs/promises';
import path from 'path';
import ImageData from './image.js';
import assert from 'assert';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

let root = path.join(__dirname, '../images');

let load = async filename => fs.readFile(path.join(root, filename));

let parse = async buffer => new Promise((resolve, reject) => {
  new PNG({ filterType: 4 }).parse(buffer, (err, data) => {
    if(err) {
      return reject(err);
    }
    resolve(data);
  });
});

export const createImageData = async () => {
  let buffer = await load('film-0446-035.png');
  let { width, height, data } = await parse(buffer);

  assert(width === 576, 'width must be 576');

  // https://beyondloom.com/blog/dither.html

  let img = new ImageData({ width });

  for(let y = 0; y < height; y++) {
    let line = img.addLine();
    for(let x = 0; x < width; x++) {
      var idx = (width * y + x) << 2;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];
      let value = (r + g + b) / 3;
      if(value > 128) {
        value = false;
      } else {
        value = true;
      }
      line.set(x, value);
    }
  }

  let buffers = img.pack({ chunk: 16 });

  return buffers;
};
