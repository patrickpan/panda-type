import React from "react";
import { render } from "@testing-library/react";
import { CursorLight } from "./CursorLight";
import * as R3F from "@react-three/fiber";

const { __clearFrameCallbacks } = R3F as any;

beforeEach(() => {
  __clearFrameCallbacks();
  (R3F.useThree as jest.Mock).mockReturnValue({
    camera: { position: { x: 0, y: 0, z: 10 } },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("light intensity formula", () => {
  const targetIntensity = (wpm: number) => 0.6 + (wpm / 100) * 3.5;

  test("is 0.6 at wpm=0 (minimum)", () => {
    expect(targetIntensity(0)).toBeCloseTo(0.6);
  });

  test("is 4.1 at wpm=100", () => {
    expect(targetIntensity(100)).toBeCloseTo(4.1);
  });

  test("is 2.35 at wpm=50", () => {
    expect(targetIntensity(50)).toBeCloseTo(2.35);
  });

  test("increases with wpm", () => {
    expect(targetIntensity(80)).toBeGreaterThan(targetIntensity(40));
  });
});

describe("mouse NDC conversion", () => {
  const ndcX = (clientX: number, width: number) => (clientX / width) * 2 - 1;
  const ndcY = (clientY: number, height: number) => -(clientY / height) * 2 + 1;

  test("center of screen maps to (0, 0) in NDC", () => {
    expect(ndcX(400, 800)).toBeCloseTo(0);
    expect(ndcY(300, 600)).toBeCloseTo(0);
  });

  test("left edge maps to -1 in X", () => {
    expect(ndcX(0, 800)).toBeCloseTo(-1);
  });

  test("right edge maps to +1 in X", () => {
    expect(ndcX(800, 800)).toBeCloseTo(1);
  });

  test("top edge maps to +1 in Y (Y axis is flipped)", () => {
    expect(ndcY(0, 600)).toBeCloseTo(1);
  });

  test("bottom edge maps to -1 in Y", () => {
    expect(ndcY(600, 600)).toBeCloseTo(-1);
  });
});

describe("CursorLight component", () => {
  test("renders without crashing", () => {
    expect(() => render(<CursorLight wpm={0} />)).not.toThrow();
  });

  test("registers a mousemove listener on mount", () => {
    const spy = jest.spyOn(window, "addEventListener");
    render(<CursorLight wpm={50} />);
    expect(spy).toHaveBeenCalledWith("mousemove", expect.any(Function), expect.anything());
  });

  test("removes the mousemove listener on unmount", () => {
    const spy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<CursorLight wpm={50} />);
    unmount();
    expect(spy).toHaveBeenCalledWith("mousemove", expect.any(Function));
  });

  test("registers a useFrame callback", () => {
    render(<CursorLight wpm={60} />);
    expect(R3F.useFrame).toHaveBeenCalled();
  });
});
