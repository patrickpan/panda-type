import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useState, useRef, useMemo, useEffect, FunctionComponent } from "react";
import styled from "styled-components";

import { generateChartData, useGenerateId, generateWords } from "#root/shared/utils";
import Wrapper from "#root/shared/GenericWrapper";
import Header from "#root/shared/GenericHeader";
import useInputLocker from "#root/shared/hooks/useInputLocker";
import { ResultData } from "#root/types";

import Word from "./Word";

export interface TypingScreenProps {
  onComplete: (args: ResultData) => void;
  totalWords: number;
}

const SECONDS_IN_MINUTE = 60;

const SubTitle = styled.span`
  font-size: 30px;
  display: block;
  margin-bottom: 40px;
  color: #555555;
`;

const TextBox = styled.input.attrs({ type: "text" })`
  border: none;
  box-sizing: border-box;
  height: 0;
  outline: none;
  position: absolute;
  width: 0;
  opacity: 0;
`;

const Label = styled.label`
  display: flex;
  text-align: justify;
  margin: 0 auto;
`;

const WordsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px 10px;
  width: 100%;
  flex-wrap: wrap;
`;

const TypingScreen: FunctionComponent<TypingScreenProps> = ({ onComplete: pushComplete, totalWords }) => {
  const timeStarted = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wpm = useRef(0);
  const [isFocused, setIsFocused] = useState(true);
  const [wordList] = useState(() => generateWords(totalWords));
  const { handleChange, handleKeyDown, userInput, userInputArray, skippedWords } = useInputLocker(wordList);
  const generateId = useGenerateId();
  const [currentTime, setCurrentTime] = useState(0);
  const graphData = useRef<Array<[number, number]>>([]);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      backgroundColor: "#232425",
      height: 300,
      width: 500,
    },
    title: {
      text: "",
    },
  });
  const correctWords = useMemo(() => wordList.filter((word, index) => userInputArray[index] === word).length, [
    userInputArray,
  ]);

  useEffect(() => {
    if (!userInput) return;

    if (!timeStarted.current) {
      timeStarted.current = performance.now();
    }

    if (timeStarted.current && currentTime === 0) {
      setChartOptions(generateChartData(graphData.current, true));
    }

    if (
      userInputArray.length > wordList.length ||
      userInputArray[wordList.length - 1] === wordList[wordList.length - 1]
    ) {
      clearInterval(intervalRef.current!);
      pushComplete({
        wpm:
          wpm.current ||
          Math.round((correctWords / ((performance.now() - timeStarted.current) / 1000)) * SECONDS_IN_MINUTE),
        graphData: generateChartData(graphData.current),
        rawWpm: Math.round((totalWords / ((performance.now() - timeStarted.current) / 1000)) * SECONDS_IN_MINUTE),
        accuracy: Math.round((correctWords / totalWords) * 100),
        timeTaken: Math.round(currentTime),
      });
    }
  }, [userInput]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (timeStarted.current) {
        setCurrentTime((performance.now() - timeStarted.current) / 1000);
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, []);

  useEffect(() => {
    wpm.current = Math.round(correctWords * (SECONDS_IN_MINUTE / currentTime));
    if (Math.round(currentTime) !== 0) {
      graphData.current.push([Math.round(currentTime), wpm.current]);
      setChartOptions(generateChartData(graphData.current, true));
    }
  }, [currentTime]);

  return (
    <Wrapper>
      <Header>Welcome to Panda Type&nbsp;&nbsp;🐼</Header>
      <SubTitle>
        {timeStarted.current ? `${isNaN(wpm.current) ? 0 : wpm.current} WPM` : "Start typing to begin test"}
      </SubTitle>
      <Label htmlFor={generateId("input")}>
        <WordsWrapper data-testid="typingScreenWords">
          {wordList.map((word, index) => (
            <Word
              isFocused={isFocused && index === userInputArray.length - 1}
              userValue={userInputArray[index]}
              skippedWords={skippedWords}
              key={index}
            >
              {word}
            </Word>
          ))}
        </WordsWrapper>
      </Label>
      <TextBox
        autoComplete="off"
        autoFocus
        data-testid="typingScreenTextBox"
        data-wordstotype={process.env.NODE_ENV === "development" ? wordList.join(" ") : undefined}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={userInput ?? ""}
        id={generateId("input")}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {timeStarted.current && (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} containerProps={{ className: "highchart" }} />
      )}
    </Wrapper>
  );
};

export default TypingScreen;
