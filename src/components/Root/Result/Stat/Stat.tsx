import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface StatProps {
  label: string;
  value: string;
  [key: string]: any;
}

const StatLabel = styled.span`
  color: #888888;
  font-size: 0.5em;
`;

const StatValue = styled.span`
  margin-bottom: 5px;
`;

const Wrapper = styled.div`
  flex-direction: column;
  font-size: 30px;
  display: flex;
  margin-bottom: 20px;
  color: white;
`;

const Stat: FunctionComponent<StatProps> = ({ label, value, ...rest }) => {
  return (
    <Wrapper {...rest}>
      <StatValue>{value}</StatValue>
      <StatLabel>{label}</StatLabel>
    </Wrapper>
  );
};

export default Stat;
