import styled from "styled-components";
import Color from "../colors/colors.js";
import React from "react";
import Button from "./Button";
import { Shadow } from "../shadows/shadow.js";
let textSize = {
  h1: 40,
  h2: 32,
  h3: 24,
  h4: 16,
  h5: 12,
};
let textWeight = {
  1: 400,
  2: 600,
  3: 800,
};

const paddingSize = {
  h1: "0px 32px",
  h2: "0px 32px",
  h3: "4px 32px",
  h4: "4px 24px",
  h5: "4px 24px",
};

const ButtonBackground = styled.div`
  padding: ${({ size }) => {
    return paddingSize[size];
  }};
  background-color: ${({ btnColor, clear }) => {
    if (clear === "1") {
      return "transparent";
    }
    return Color[btnColor];
  }};
  border-radius: 90px;
  position: relative;
  border: 1px solid ${({ btnColor }) => Color[btnColor]};
  &:hover {
    cursor: pointer;
    background-color: ${({ clear, btnColor }) => {
      let hoveredBackground =
        clear === "1" ? "transparent" : Color[btnColor.slice(0, -1) + "2"];
      return hoveredBackground;
    }};
    border-color: ${({ btnColor }) => Color[btnColor.slice(0, -1) + "2"]};
    box-shadow: ${Shadow.l3};
  }
  &:active {
    background-color: ${({ clear, btnColor }) => {
      let tappedBackground =
        clear === "1" ? "transparent" : Color[btnColor.slice(0, -1) + "1"];
      return tappedBackground;
    }};
    border-color: ${({ btnColor }) => Color[btnColor.slice(0, -1) + "1"]};
    box-shadow: ${Shadow.l1};
  }
`;

const ButtonIconBackground = styled(ButtonBackground)`
  display: flex;
  align-items: center;
`

const PrimaryBtn = styled((props) => <Button {...props} />)``;

const ButtonText = styled.div`
  font-family: Poppins;
  font-size: ${({ size }) => textSize[size]}px;
  line-height: ${({ size }) => textSize[size] * 2}px;
  font-weight: ${({ assignWeight }) => {
    if (!assignWeight) {
      return textWeight[1];
    }
    return textWeight[assignWeight];
  }};
  color: ${({ textColor, clear, btnColor }) => {
    //Default scenario
    if (!textColor) {
      // textColor in button is by default white unless given transparency is false and button background color is white
      textColor = "#fff";
      console.log(clear);
      if (clear === "1") {
        textColor = Color[btnColor];
      }
      // Fulfilling the unless condition from above
      if (clear === "0" && btnColor === "white1") {
        textColor = "#2B2B2B";
      }
    } else {
      textColor = Color[textColor];
    }
    return textColor;
  }};
  justifycontent: center;
  display: flex;
  align-items: center;
`;

export { ButtonBackground, ButtonText, ButtonIconBackground };
