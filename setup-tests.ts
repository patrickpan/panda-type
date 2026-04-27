import "@testing-library/jest-dom";

// jsdom does not implement the canvas 2D API – provide a minimal stub so
// components that call document.createElement('canvas').getContext('2d')
// don't crash during tests.
const mockCtx = {
  fillStyle: '',
  fillRect: jest.fn(),
  font: '',
  fillText: jest.fn(),
  strokeStyle: '',
  lineWidth: 0,
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockCtx),
  writable: true,
  configurable: true,
});
