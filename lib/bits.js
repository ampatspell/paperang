class Bits {

  constructor(buffer) {
    this.buffer = buffer;
  }

  _pos(i) {
    let byte = Math.floor(i / 8);
    let bit = i % 8;
    return { byte, bit };
  }

  set(i, on) {
    let pos = this._pos(i);
    let byte = this.buffer.readUInt8(pos.byte);
    if(on) {
      byte = byte | 1 << pos.bit;
    } else {
      byte = byte & ~(1 << pos.bit);
    }
    this.buffer.writeUInt8(byte, pos.byte);
  }

  get(i) {
    let pos = this._pos(i);
    let byte = this.buffer.readUInt8(pos.byte);
    return (byte >> pos.bit) % 2 !== 0;
  }

}

module.exports = {
  Bits
}
