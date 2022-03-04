const crc32 = require('crc-32');

let pack = (cmd, data) => {
  data = data || Buffer.alloc(0);

  let crc = crc32.buf(data, 0x35769521 & 0xffffffff);

  let add = (len, fn, ...args) => {
    let name  = `write${fn}`;
    let buffer = Buffer.alloc(len);
    buffer[name].call(buffer, ...args);
    return buffer;
  };

  let buffers = [
    add(1, 'UInt8', 0x02),
    add(1, 'UInt8', cmd),
    add(1, 'UInt8', 0), // index?
    add(2, 'UInt16LE', data.length),
    data,
    add(4, 'IntLE', crc, 0, 4),
    add(1, 'UInt8', 0x03)
  ];

  return Buffer.concat(buffers);
};

let unpack = buffer => {
  let offset = 0;

  let read = (len, name, ...args) => {
    let value = buffer[`read${name}`].call(buffer, offset, ...args);
    offset += len;
    return value;
  };

  let header = read(1, 'UInt8');
  let cmd = read(2, 'UInt16LE');
  let length = read(2, 'UInt16LE');

  let data = buffer.slice(offset, offset + length);
  offset += length;

  let crc = read(4, 'IntLE', 4);
  let footer = read(1, 'UInt8');

  return {
    header,
    cmd,
    length,
    data,
    crc,
    footer
  };
};

let commands = {
  status: () => pack(0x0C),
  batteryLevel: () => pack(0x10),
  printTestPage: () => pack(0x1B),
  printFeedLine: (lines=1) => {
    let buffer = Buffer.alloc(2);
    buffer.writeUIntLE(lines, 0, 2);
    return pack(0x1A, buffer);
  },
  paperType: (type=0) => {
    let buffer = Buffer.alloc(1);
    buffer.writeUInt8(type, 0)
    return pack(0x2C, buffer);
  }
};

module.exports = {
  pack,
  unpack,
  commands
};
