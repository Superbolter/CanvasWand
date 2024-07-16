import React from "react";
import "./Button.css";
import ButtonBg from "./ButtonBg.js";
import { useColor } from "./BtnColor.js";
import Color from "../colors/colors.js";
import { Shadow } from "../shadows/shadow.js";
import { ButtonBackground, ButtonText } from "./PrimitiveButtonStyles";
const Button = (props) => {
  // clear - transparent button bg color setting
  // btnColor - Overall button color
  // text - Content to put on button

  let { text, btnColor, clear, size, textColor, weight, children } = props;

  return (
    <div className="size1">

      <ButtonBackground size={size} clear={clear} btnColor={btnColor}>
        {/* Doesn't work without px for lineHeight */}
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
      </ButtonBackground>
    </div>
  );
};

export default Button;
