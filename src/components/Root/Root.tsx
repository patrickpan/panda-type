import React, { FunctionComponent, useState } from "react";

import { ResultData } from "#root/types";

import Result from "./Result";
import TypingScreen from "./TypingScreen";

const TOTAL_WORDS = 40;

const Root: FunctionComponent = () => {
  const [result, setResult] = useState<ResultData | null>(null);

  const handleComplete = (data: ResultData) => {
    setResult(data);
  };

  const handleRetry = () => {
    setResult(null);
  };

  return (
    <>
      {!result ? (
        <TypingScreen onComplete={handleComplete} totalWords={TOTAL_WORDS} />
      ) : (
        <>
          <Result {...result} onRetry={handleRetry} />
        </>
      )}
    </>
  );
};

export default Root;
