import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import Root from "./components/Root";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #232425;
    font-family: Lato;
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .highchart {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

render(
  <>
    <GlobalStyle />
    <Root />
  </>,
  document.getElementById("root")
);
