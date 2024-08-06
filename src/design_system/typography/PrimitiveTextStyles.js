// Implementation of factory style data components includes two way data binding in this scenario
import React, { Children } from "react";
import styled from "styled-components";
import Color from "../colors/colors.js";
import Typography from "./Typography";
const textSize = {
  h1: 96,
  h2: 60,
  h3: 48,
  h4: 34,
  h5: 24,
  bodyBig: 20,
  body1: 16,
  subtitle2: 14,
  button: 14,
  body2: 14,
  caption: 12,
  overline: 10,
};
const textWeight = {
  1: 400,
  2: 600,
  3: 800,
};

const StyledText = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-size: ${({ size }) => textSize[size]}px;
  font-weight: ${({ assignWeight }) => textWeight[assignWeight]};
  color: ${({ textColor }) => Color[textColor]};
  line-height : ${({ size }) => textSize[size] * 1.5}px;
`;

const NavbarLink = styled((props) => <Typography {...props} />)`
  &:hover {
    color: ${Color.primary1};
    cursor: pointer;
  }
`;

const taskProps = {
  completedTaskProps: {
    size: "bodyBig",
    weight: "1",
    textColor: "signalSuccess1",
  },
  currentTaskProps: {
    size: "bodyBig",
    weight: "2",
    textColor: "neutral1",
  },
  futureTaskProps: {
    size: "bodyBig",
    weight: "1",
    textColor: "neutral3",
  },
  unlockFutureTaskProps: {
    size: "bodyBig",
    weight: "1",
    textColor: "neutral3",
  },
  lockFutureTaskProps: {
    size: "bodyBig",
    weight: "1",
    textColor: "neutral3",
  },
};

const TaskText = styled((props) => (
  <Typography {...taskProps[props.type]}> {props.children} </Typography>
))``;

export { StyledText, NavbarLink, TaskText };
