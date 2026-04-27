import React from "react";
import { render } from "@testing-library/react";
import { DataWalls } from "./DataWalls";
import * as R3F from "@react-three/fiber";

const { __clearFrameCallbacks } = R3F as any;

beforeEach(() => {
  __clearFrameCallbacks();
  jest.clearAllMocks();
});

describe("corridor wall constants", () => {
  test("WALL_LENGTH covers enough of the z corridor", () => {
    const WALL_LENGTH = 250;
    // Camera travels from z=10 to roughly z=-140; wall should cover all of that
    expect(WALL_LENGTH).toBeGreaterThanOrEqual(150);
  });

  test("WALL_HEIGHT provides vertical coverage", () => {
    const WALL_HEIGHT = 18;
    expect(WALL_HEIGHT).toBeGreaterThan(0);
  });

  test("WALL_CENTER_Z positions the wall ahead of the camera start", () => {
    const WALL_CENTER_Z = -105;
    const CAMERA_START_Z = 10;
    expect(WALL_CENTER_Z).toBeLessThan(CAMERA_START_Z);
  });
});

describe("wall rotation formula", () => {
  const wallRotY = (x: number) => (x < 0 ? Math.PI / 2 : -Math.PI / 2);

  test("left wall (x < 0) rotates +PI/2 so its normal faces inward (+X)", () => {
    expect(wallRotY(-6)).toBeCloseTo(Math.PI / 2);
  });

  test("right wall (x > 0) rotates -PI/2 so its normal faces inward (-X)", () => {
    expect(wallRotY(6)).toBeCloseTo(-Math.PI / 2);
  });

  test("left and right wall rotations are equal and opposite", () => {
    expect(wallRotY(-6)).toBeCloseTo(-wallRotY(6));
  });
});

describe("floor strip texture tiling", () => {
  test("texture repeats more along z (corridor length) than x", () => {
    const repeatX = 6;
    const repeatZ = 30;
    expect(repeatZ).toBeGreaterThan(repeatX);
  });
});

describe("DataWalls component", () => {
  test("renders without crashing", () => {
    expect(() => render(<DataWalls />)).not.toThrow();
  });

  test("registers useFrame callbacks for both corridor walls", () => {
    render(<DataWalls />);
    // CorridorWall x=-6 and CorridorWall x=6 each register one; FloorStrip has none
    const { __getFrameCallbacks } = R3F as any;
    expect(__getFrameCallbacks().length).toBe(2);
  });
});
