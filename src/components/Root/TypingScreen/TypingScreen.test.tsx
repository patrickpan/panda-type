import mockWords from "#root/mocks/mockWords";

// mock function for the typing
const generateWordsMock = jest.fn(() => mockWords);

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TypingScreen from "./TypingScreen";

jest.mock("#root/shared/utils", () => {
  const originalModule = jest.requireActual("#root/shared/utils");

  return {
    __esModule: true,
    ...originalModule,
    generateWords: generateWordsMock,
  };
});

describe("TypingScreen", () => {
  test("works when correct words are typed in", () => {
    const totalWords = 40;
    const spy = jest.fn();

    expect(generateWordsMock).not.toHaveBeenCalled();

    render(<TypingScreen totalWords={totalWords} onComplete={spy} />);

    const textBox = screen.getByTestId("typingScreenTextBox");

    expect(generateWordsMock).toHaveBeenCalledWith(totalWords);

    expect(spy).not.toHaveBeenCalled();
    userEvent.type(textBox, mockWords.join(" "));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(Object.keys(spy.mock.calls[0][0])).toEqual(["wpm", "graphData", "rawWpm", "accuracy", "timeTaken"]);
  });

  test("forces completion even with wrong words if user enters space", async () => {
    const totalWords = 40;
    const spy = jest.fn();

    render(<TypingScreen totalWords={totalWords} onComplete={spy} />);

    const textBox = screen.getByTestId("typingScreenTextBox");

    // the typing for userEvent.type is wrong; it returns a Promise, not void
    // so we have to cast it to any here
    // we're making every word wrong on purpose
    await (userEvent.type(textBox, mockWords.map((word) => `a${word}`).join(" ")) as any).catch(() => {
      // receive "cannot get length of undefined"
      // known bug in user-event: https://github.com/testing-library/user-event/issues/356
    });

    expect(spy).not.toHaveBeenCalled();

    userEvent.type(textBox, " ");

    expect(spy).toHaveBeenCalledTimes(1);
    const spyArgs = spy.mock.calls[0][0];
    expect(Object.keys(spyArgs)).toEqual(["wpm", "graphData", "rawWpm", "accuracy", "timeTaken"]);
    expect(spyArgs.wpm).toBe(0);
  });
});
