import mockWords from "#root/mocks/mockWords";

// mock function for the typing
const generateWordsMock = jest.fn(() => mockWords);

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Root from "./Root";

jest.mock("#root/shared/utils", () => {
  const originalModule = jest.requireActual("#root/shared/utils");

  return {
    __esModule: true,
    ...originalModule,
    generateWords: generateWordsMock,
  };
});

describe("Root", () => {
  test("starts with typing screen and moves to result when complete", async () => {
    render(<Root />);
    const textBox = screen.getByTestId("typingScreenTextBox");

    // the typing for userEvent.type is wrong; it returns a Promise, not void
    // so we have to cast it to any here
    await (userEvent.type(textBox, mockWords.join(" ")) as any).catch(() => {
      // receive "cannot get length of undefined"
      // known bug in user-event: https://github.com/testing-library/user-event/issues/356
    });

    const wpmContainer = screen.getByTestId("resultWpm");
    const rawWpmContainer = screen.getByTestId("resultRawWpm");
    const accuracyContainer = screen.getByTestId("resultAccuracy");
    const timeTakenContainer = screen.getByTestId("resultTimeTaken");

    expect(textBox).not.toBeInTheDocument();
    expect(wpmContainer).toBeInTheDocument();
    expect(rawWpmContainer).toBeInTheDocument();
    expect(accuracyContainer).toBeInTheDocument();
    expect(timeTakenContainer).toBeInTheDocument();
  });
});
