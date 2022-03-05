// class Bits {

//   constructor(buffer) {
//     this.buffer = buffer;
//   }


// }

// module.exports = {
//   Bits
// }

class ImageDataLine {

  constructor({ width }) {
    this.width = width;
    this.buffer = Buffer.alloc(width / 8);
  }

  _pos(i) {
    let byte = Math.floor(i / 8);
    let bit = 7 - (i % 8);
    return { byte, bit };
  }

  set(i, on) {
    let pos = this._pos(i);
    let { buffer } = this;
    let byte = buffer.readUInt8(pos.byte);
    if(on) {
      byte = byte | 1 << pos.bit;
    } else {
      byte = byte & ~(1 << pos.bit);
    }
    buffer.writeUInt8(byte, pos.byte);
  }

  get(i) {
    let pos = this._pos(i);
    let { buffer } = this;
    let byte = buffer.readUInt8(pos.byte);
    return (byte >> pos.bit) % 2 !== 0;
  }

}

class ImageData {

  lines = [];

  constructor({ width, height }) {
    this.width = width;
    if(height) {
      this.lines = [ ...Array(height).keys() ].map(_ => new ImageDataLine({ width }));
    }
  }

  addLine() {
    let { width } = this;
    let line = new ImageDataLine({ width });
    this.lines.push(line);
    return line;
  }

  line(i) {
    return this.lines[i];
  }

  pack({ chunk }) {
    let { lines } = this;

    while(lines.length % chunk !== 0) {
      this.addLine();
    }

    let chunks = [];
    let i = 0;
    let len = lines.length;

    while(i < len) {
      let slice = lines.slice(i, i += chunk);
      let buffers = slice.map(line => line.buffer);
      let buffer = Buffer.concat(buffers);
      chunks.push(buffer);
    }

    return chunks;
  }

}

module.exports = {
  ImageData
}
