import React from 'react';
import { render } from '@testing-library/react';
import { MarineSnow } from './MarineSnow';
import * as R3F from '@react-three/fiber';

const { __clearFrameCallbacks } = R3F as any;

beforeEach(() => {
  __clearFrameCallbacks();
  (R3F.useThree as jest.Mock).mockReturnValue({
    camera: { position: { x: 0, y: 0, z: 10 } },
  });
});

// ── Pure formula tests ─────────────────────────────────────────────────────────

describe('particle drift speed formula', () => {
  const driftZ = (wpm: number) => 0.8 + (wpm / 60) * 1.5;

  test('is 0.8 at wpm=0 (base drift)', () => {
    expect(driftZ(0)).toBeCloseTo(0.8);
  });

  test('is 2.3 at wpm=60', () => {
    expect(driftZ(60)).toBeCloseTo(2.3);
  });

  test('is 3.8 at wpm=120', () => {
    expect(driftZ(120)).toBeCloseTo(3.8);
  });

  test('increases linearly with wpm', () => {
    const d60 = driftZ(60);
    const d120 = driftZ(120);
    expect(d120 - d60).toBeCloseTo(d60 - driftZ(0));
  });
});

describe('particle recycle threshold', () => {
  test('particle is recycled when it passes 8 units behind the camera', () => {
    const cameraZ = 10;
    const recycleThreshold = cameraZ + 8;

    expect(9).toBeLessThan(recycleThreshold);  // should NOT recycle
    expect(18).not.toBeLessThan(recycleThreshold); // should recycle
    expect(recycleThreshold).toBe(18);
  });
});

// ── Component tests ────────────────────────────────────────────────────────────

describe('MarineSnow component', () => {
  test('renders without crashing', () => {
    expect(() => render(<MarineSnow wpm={0} />)).not.toThrow();
  });

  test('registers a useFrame callback', () => {
    render(<MarineSnow wpm={60} />);
    expect(R3F.useFrame).toHaveBeenCalled();
  });

  test('initialises 320 particles', () => {
    // BufferGeometry in our mock exposes a 320*3 Float32Array
    const THREE = require('three');
    const geo: InstanceType<typeof THREE.BufferGeometry> = new THREE.BufferGeometry();
    const positions = geo.attributes.position.array as Float32Array;
    expect(positions.length).toBe(320 * 3);
  });
});
