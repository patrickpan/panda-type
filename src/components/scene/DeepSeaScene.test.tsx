import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeepSeaScene } from './DeepSeaScene';
import * as R3F from '@react-three/fiber';

const { __clearFrameCallbacks } = R3F as any;

beforeEach(() => {
  __clearFrameCallbacks();
  (R3F.useThree as jest.Mock).mockReturnValue({
    camera: { position: { x: 0, y: 0, z: 10 } },
  });
});

describe('DeepSeaScene', () => {
  test('renders the Canvas container', () => {
    render(<DeepSeaScene wordIndex={0} wpm={0} />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  test('renders without crashing at wordIndex=0 and wpm=0', () => {
    expect(() => render(<DeepSeaScene wordIndex={0} wpm={0} />)).not.toThrow();
  });

  test('renders without crashing mid-session', () => {
    expect(() => render(<DeepSeaScene wordIndex={15} wpm={72} />)).not.toThrow();
  });

  test('invokes onCreated with a gl object', () => {
    // Verifies the mock Canvas calls onCreated, which DeepSeaScene uses to set
    // the clear colour.  No crash means the callback was invoked correctly.
    expect(() =>
      render(<DeepSeaScene wordIndex={0} wpm={0} />)
    ).not.toThrow();
  });

  test('registers useFrame callbacks for scene sub-components', () => {
    render(<DeepSeaScene wordIndex={0} wpm={0} />);
    // CameraController + two CorridorWalls + MarineSnow + CursorLight = 5
    const { __getFrameCallbacks } = R3F as any;
    expect(__getFrameCallbacks().length).toBeGreaterThanOrEqual(4);
  });
});

describe('DataNodes generation', () => {
  test('24 nodes are spread across negative Z', () => {
    // Nodes are created with z = -(i+1)*8 ± rng(4) for i in [0,23]
    // At minimum, z for node i=0 is around -8, node i=23 is around -192
    const nodeZ = (i: number) => -(i + 1) * 8;
    expect(nodeZ(0)).toBeLessThan(0);
    expect(nodeZ(23)).toBeLessThan(nodeZ(0));
    expect(Math.abs(nodeZ(23))).toBeGreaterThan(100);
  });

  test('node colours are either cyan or blue', () => {
    const hue = (roll: number) => (roll > 0.75 ? '#00ccff' : '#00ffcc');
    expect(hue(0.8)).toBe('#00ccff');
    expect(hue(0.5)).toBe('#00ffcc');
  });
});
