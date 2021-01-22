import { renderHook } from "@testing-library/react-hooks";
import { SeriesLineOptions, YAxisOptions } from "highcharts";

import { formatSeconds, getRandomWord, generateChartData, generateWords, useGenerateId } from "./utils";

describe("formatSeconds", () => {
  test("formats seconds correctly", () => {
    expect(formatSeconds(30)).toBe("30s");
    expect(formatSeconds(60)).toBe("1m");
    expect(formatSeconds(61)).toBe("1m 1s");
    expect(formatSeconds(150)).toBe("2m 30s");
  });
});

describe("getRandomWord", () => {
  test("generates one word", () => {
    const word = getRandomWord();

    expect(typeof word).toBe("string");
    // contains no spaces
    expect(/ /.test(word)).toBe(false);
  });
});

describe("generateChartData", () => {
  test("respects arguments", () => {
    const graphData1 = generateChartData([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
    const graphData2 = generateChartData(
      [
        [2, 1],
        [4, 3],
        [6, 5],
      ],
      true
    );

    expect((graphData1.series![0] as SeriesLineOptions).data).toStrictEqual([4, 6]);
    expect((graphData1.yAxis as YAxisOptions).visible).toBe(true);
    expect((graphData2.series![0] as SeriesLineOptions).data).toStrictEqual([3, 5]);
    expect((graphData2.yAxis as YAxisOptions).visible).toBe(false);
  });
});

describe("generateWords", () => {
  test("generates provided number of words", () => {
    const numWords = 10;

    const words = generateWords(numWords);

    expect(words.length).toBe(10);
  });
});

describe("useGenerateId", () => {
  test("ids from same hook should be in the same group", () => {
    const { result: generateId } = renderHook(() => useGenerateId());

    const id1 = generateId.current("dummy");
    const id2 = generateId.current("dummy");

    expect(id1).toEqual(id2);
  });

  test("ids generated from different hooks should be in different groups", () => {
    const { result: generateId1 } = renderHook(() => useGenerateId());
    const { result: generateId2 } = renderHook(() => useGenerateId());

    const id1 = generateId1.current("dummy");
    const id2 = generateId2.current("dummy");

    expect(id1).not.toEqual(id2);
  });
});
