import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { FunctionComponent } from "react";
import styled from "styled-components";

import Wrapper from "#root/shared/GenericWrapper";
import Header from "#root/shared/GenericHeader";

import Stat from "./Stat";

export interface ResultProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  timeTaken: number;
  graphData: Highcharts.Options;
  onRetry?: () => void;
}

const ResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const RetryButton = styled.button`
  color: white;
  border: none;
  outline: none;
  background: none;
  box-shadow: 0 0 3px white;
  width: 100px;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 15px;
`;

const Result: FunctionComponent<ResultProps> = ({ accuracy, wpm, rawWpm, timeTaken, graphData, onRetry }) => {
  return (
    <Wrapper>
      <Header>Test Complete!</Header>
      <ResultContainer>
        <StatsContainer>
          <Stat data-testid="resultWpm" label="WPM" value={wpm.toString()} />
          <Stat data-testid="resultRawWpm" label="RAW" value={rawWpm.toString()} />
          <Stat data-testid="resultAccuracy" label="ACC" value={`${accuracy}%`} />
          <Stat
            data-testid="resultTimeTaken"
            label="TIME"
            value={timeTaken < 60 ? `${timeTaken}s` : `${Math.floor(timeTaken / 60)}:${timeTaken % 60}`}
          />
        </StatsContainer>
        <div>
          <HighchartsReact highcharts={Highcharts} options={graphData} containerProps={{ className: "highchart" }} />
        </div>
      </ResultContainer>
      <RetryButton onClick={onRetry}>Try again</RetryButton>
    </Wrapper>
  );
};

export default Result;
