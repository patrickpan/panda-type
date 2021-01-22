import React, { useRef, FunctionComponent } from "react";
import styled, { keyframes } from "styled-components";

export interface WordProps {
  children: string;
  isFocused?: boolean;
  skippedWords?: string[];
  userValue?: string;
}

export const CORRECT_COLOR = "rgb(237, 190, 62)";
export const WRONG_COLOR = "red";
export const PLACEHOLDER_COLOR = "grey";

const flicker = keyframes`
  0% { 
    opacity: 0;
  }

  50% { 
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const Letter = styled.strong<{ status: string; isWordSkipped?: boolean }>`
  color: ${({ status }) =>
    status === "placeholder" ? PLACEHOLDER_COLOR : status === "correct" ? CORRECT_COLOR : WRONG_COLOR};
  opacity: ${({ status }) => (status === "opaque" ? 0.5 : 1)};
  text-decoration: ${({ isWordSkipped }) => (isWordSkipped ? "underline" : "none")};
  text-decoration-color: ${({ isWordSkipped }) => isWordSkipped && WRONG_COLOR};
`;

const Cursor = styled.div`
  animation: ${flicker} 1.5s linear infinite;
  background-color: #eb6936;
  display: inline-block;
  height: 40px;
  position: absolute;
  width: 3px;
  animation-delay: 1s;
  will-change: opacity;
`;

const Wrapper = styled.div`
  display: flex;
  position: relative;
`;

const Word: FunctionComponent<WordProps> = ({
  children: word,
  isFocused = false,
  skippedWords = [],
  userValue = "",
}) => {
  const letters = word.toString().split("");
  const cursor = useRef(null);

  return (
    <Wrapper>
      {isFocused && userValue.length < 1 && <Cursor ref={cursor} />}
      {letters.map((letter, index) => (
        <Letter
          key={index}
          status={
            userValue === undefined || userValue[index] === undefined
              ? "placeholder"
              : word[index] === userValue[index]
              ? "correct"
              : "wrong"
          }
          isWordSkipped={skippedWords.includes(word.toString())}
        >
          {letter}
          {isFocused && index === userValue.length - 1 && <Cursor />}
        </Letter>
      ))}
      {userValue &&
        userValue
          .slice(letters.length)
          .split("")
          .map((letter, index) => (
            <Letter key={index} status="opaque">
              {letter}
              {isFocused && index === userValue.length - 1 - letters.length && <Cursor />}
            </Letter>
          ))}{" "}
    </Wrapper>
  );
};

export default Word;
