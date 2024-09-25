import { ButtonBackground, ButtonText, ButtonIconBackground } from "./PrimitiveButtonStyles"
import React from "react"
import styled from "styled-components";
import Color from "../colors/colors";
import Shadow from "../shadows/shadow";

const InvertBackground = styled(ButtonBackground)`
    color : ${({ btnColor }) => Color[btnColor]};
    &:hover {
    background-color: ${({ btnColor }) => {
    return Color[btnColor];
  }};
    color : ${Color.white1};
  }
  &:active {
    background-color: ${({ btnColor }) => {
    return Color[btnColor];
  }};
    color : ${Color.white1};
  }
`

const InvertText = styled(ButtonText)`
  color : inherit;
`


const InvertColorButton = (props) => {
  // clear - transparent button bg color setting
  // btnColor - Overall button color
  // text - Content to put on button

  let { text, btnColor, size, textColor, weight, children } = props;

  return (
    <div className="size1">

      <InvertBackground size={size} clear="1" btnColor={btnColor}>
        {/* Doesn't work without px for lineHeight */}
        <InvertText
          size={size}
          assignWeight={weight}
          textColor={textColor}
          clear="1"
          btnColor={btnColor}
        >
          {text}
          {children}
        </InvertText>
      </InvertBackground>
    </div>
  );
};

export default InvertColorButton;