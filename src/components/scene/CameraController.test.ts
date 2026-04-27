import { getCameraTargetZ } from './CameraController';

const Z_STEP = 5;
const CAMERA_START_Z = 10;

describe('getCameraTargetZ', () => {
  test('returns CAMERA_START_Z when wordIndex is 0', () => {
    expect(getCameraTargetZ(0)).toBe(CAMERA_START_Z);
  });

  test('decreases by Z_STEP for each completed word', () => {
    expect(getCameraTargetZ(1)).toBe(CAMERA_START_Z - Z_STEP);
    expect(getCameraTargetZ(2)).toBe(CAMERA_START_Z - Z_STEP * 2);
    expect(getCameraTargetZ(5)).toBe(CAMERA_START_Z - Z_STEP * 5);
  });

  test('returns negative Z after enough words', () => {
    expect(getCameraTargetZ(10)).toBeLessThan(0);
  });

  test('is linear in wordIndex', () => {
    const delta01 = getCameraTargetZ(1) - getCameraTargetZ(0);
    const delta12 = getCameraTargetZ(2) - getCameraTargetZ(1);
    expect(delta01).toBe(delta12);
  });
});

describe('camera lerp formula', () => {
  const lerp = 0.05;

  test('moves 5% of the remaining distance each frame', () => {
    const current = 10;
    const target = 0;
    const next = current + (target - current) * lerp;
    expect(next).toBeCloseTo(9.5, 5);
  });

  test('when already at target, position does not change', () => {
    const current = 5;
    const target = 5;
    const next = current + (target - current) * lerp;
    expect(next).toBe(5);
  });

  test('approaches target from below', () => {
    const current = -20;
    const target = 0;
    const next = current + (target - current) * lerp;
    expect(next).toBeGreaterThan(current);
    expect(next).toBeLessThan(target);
  });
});
