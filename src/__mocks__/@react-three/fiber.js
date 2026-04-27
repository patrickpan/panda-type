const React = require('react');

// Collect frame callbacks registered per render so tests can invoke them
const _frameCallbacks = [];

const useFrame = jest.fn().mockImplementation((cb) => {
  _frameCallbacks.push(cb);
});

const useThree = jest.fn().mockImplementation(() => ({
  camera: { position: { x: 0, y: 0, z: 10 } },
}));

// Canvas renders children into a plain div so UI tests can inspect the tree
const Canvas = ({ children, onCreated }) => {
  if (onCreated) onCreated({ gl: { setClearColor: jest.fn() } });
  return React.createElement('div', { 'data-testid': 'r3f-canvas' }, children);
};

// Test helpers – clear between tests to prevent callback accumulation
const __getFrameCallbacks = () => _frameCallbacks;
const __clearFrameCallbacks = () => { _frameCallbacks.length = 0; };

module.exports = { useFrame, useThree, Canvas, __getFrameCallbacks, __clearFrameCallbacks };
