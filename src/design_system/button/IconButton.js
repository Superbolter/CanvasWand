import { ButtonIconBackground, ButtonText } from "./PrimitiveButtonStyles";
import React from "react";
import styled from "styled-components"
import "./Button.css"
const IconButton = (props) => {
  // clear - transparent button bg color setting
  // btnColor - Overall button color
  // text - Content to put on button

  let { text, btnColor, clear, size, textColor, weight, children, src } = props;

  return (
    <div className="size1">

      <ButtonIconBackground size={size} clear={clear} btnColor={btnColor}>
        {/* Doesn't work without px for lineHeight */}
        <div className="button-icon-text">
          <img className="icon-size" src={src} alt="no icon" />
          <ButtonText
            size={size}
            assignWeight={weight}
            textColor={textColor}
            clear={clear}
            btnColor={btnColor}
          >
            {text}
            {children}
          </ButtonText>
        </div>
      </ButtonIconBackground>
    </div>
  );
};

export default IconButton;
