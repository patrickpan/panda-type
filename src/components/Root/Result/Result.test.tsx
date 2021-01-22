import React from "react";
import { render, screen } from "@testing-library/react";

import { generateChartData } from "#root/shared/utils";

import Result from "./Result";

describe("Word", () => {
  test("renders props correctly", () => {
    const data = {
      wpm: 45,
      rawWpm: 50,
      accuracy: 90,
      timeTaken: 20,
      graphData: generateChartData([
        [0, 25],
        [1, 20],
        [2, 30],
      ]),
    };
    render(<Result {...data} />);

    const wpmContainer = screen.getByTestId("resultWpm");
    const rawWpmContainer = screen.getByTestId("resultRawWpm");
    const accuracyContainer = screen.getByTestId("resultAccuracy");
    const timeTakenContainer = screen.getByTestId("resultTimeTaken");

    expect(wpmContainer).toHaveTextContent(data.wpm.toString());
    expect(rawWpmContainer).toHaveTextContent(data.rawWpm.toString());
    expect(accuracyContainer).toHaveTextContent(`${data.accuracy}%`);
    expect(timeTakenContainer).toHaveTextContent(`${data.timeTaken}s`);
  });
});
