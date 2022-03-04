const PNG = require("pngjs").PNG;
const fs = require('fs');
const path = require('path');

let root = path.join(__dirname, '../images');

let load = async filename => fs.promises.readFile(path.join(root, filename));

let parse = async buffer => new Promise((resolve, reject) => {
  new PNG({ filterType: 4 }).parse(buffer, (err, data) => {
    if(err) {
      return reject(err);
    }
    resolve(data);
  });
});

(async () => {

  let buffer = await load('film-0446-035.png');
  let { width, height, data } = await parse(buffer);
  console.log({ width, height, data });

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var idx = (width * y + x) << 2;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];
      let a = data[idx + 3];
      console.log(x, y, { r, g, b });
    }
  }

})();

