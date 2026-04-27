// Minimal Three.js stub – enough for scene components to import and instantiate
// without a WebGL context.

class Vector3 {
  constructor() { this.x = 0; this.y = 0; this.z = 0; }
  set() { return this; }
  copy() { return this; }
  sub() { return this; }
  normalize() { return this; }
  addScaledVector() { return this; }
  lerp() { return this; }
  unproject() { return this; }
}

class CanvasTexture {
  constructor() {
    this.wrapS = null;
    this.wrapT = null;
    this.repeat = { set: jest.fn() };
    this.needsUpdate = false;
  }
  dispose() {}
}

class BufferGeometry {
  constructor() {
    this.attributes = {
      position: { array: new Float32Array(320 * 3), needsUpdate: false },
    };
  }
  setAttribute() {}
}

class BufferAttribute {
  constructor(array) { this.array = array; }
}

const RepeatWrapping = 1000;

module.exports = {
  Vector3,
  CanvasTexture,
  BufferGeometry,
  BufferAttribute,
  RepeatWrapping,
};
