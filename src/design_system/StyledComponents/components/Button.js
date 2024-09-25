import React from 'react';
import styled from "styled-components";
import { color, typeScale, primaryFont } from "../utils";
import { applyStyleModifiers } from "styled-components-modifiers";
import Lottie from "react-lottie";
import loadingWhiteData from '../../lottie/loader-black.json'
import loadingBlackData from '../../lottie/loader.json'
import PropTypes from 'prop-types';

const BUTTON_MODIFIERS = {
  block: () => `
    display: block;
    width: 100%;
  `,
  small: () => `
      height: 32px;
      padding: 0 12px ;
    `,
  medium: () => `
    height: 45px;
    padding: 8px 18px ;
  `,
  large: () => `
      height: 60px;
      padding: 16px 24px; 
      
    `,

  black: () => `
        background-color: ${color.neutral[600]};
        &:hover {
            background-color: ${color.neutral[500]};
        }

    `,
  grey: () => `
  background-color: ${color.neutral[400]};
  &:hover {
      background-color: ${color.neutral[300]};
  }

`,
  white: () => `
        background-color: ${color.neutral[100]};
        color: ${color.neutral[600]};
        &:hover {
          background-color: ${color.neutral[300]};
          color: ${color.neutral[600]};
      }
    `
  ,

  blue: () => `
  background-color: #4B73EC;
  &:hover {
    background-color:  #4B73EC;
}
  `,
  yellow: () => `
  background-color: #ff9900;
  &:hover {
    background-color:  #ff9900;
}
  `,
  green: () => `
  background-color: ${color.success[300]};
  &:hover {
    background-color: ${color.success[300]};
}
  `,

  circular: () => `
    border-radius:40px;
  `,
  flat: () => `
    border-radius:6px;
  `,
  dFlex: () => `
   display:flex;
  `,
  justifyCenter: () => `
    justify-content:center;
  `,
  alignCenter: () => `
  align-items:center;
  `,
  outlineBlack: () => `
        background-color: transparent;
        color: ${color.neutral[600]};
        border: 1px solid ${color.neutral[600]};
        &:hover {
            background-color: ${color.neutral[300]};
            color: ${color.neutral[600]};
        }
    `,
  outlineWhite: () => `
        background-color: transparent;
        color: ${color.neutral[100]};
        border: 1px solid ${color.neutral[100]};
        &:hover {
            background-color: transparent;
        }
    `,

  outlinePrimary: () => `
        background-color: transparent;
        color: ${color.primary[300]};
        border: 1px solid ${color.primary[300]};
        &:hover {
            background-color: ${color.primary[100]};
            color: ${color.primary[300]};
        }
    `,
  outlineGreen: () => `
        background-color: transparent;
        color: ${color.success[300]};
        border: 1px solid ${color.success[300]};
        &:hover {
            background-color: ${color.neutral[100]};
            color: ${color.success[300]};
        }
    `,

  textPrimary: () => `
    background-color: transparent;
    color: ${color.primary[300]};
    border: 1px solid transparent;
    &:hover {
        background-color: ${color.primary[100]};
        color: ${color.primary[300]};
    }
    `,
  textBlack: () => `
    background-color: transparent;
    color: ${color.neutral[600]};
    border: 1px solid transparent;
    &:hover {
        background-color: ${color.neutral[200]};
        color: ${color.neutral[600]};
    }
    `,

  textWhite: () => `
    background-color: transparent;
    color: ${color.neutral[100]};
    border: 1px solid transparent;
    &:hover {
      background-color: ${color.neutral[200]};
      color: ${color.neutral[600]};
    }
    `,

  urlHighlight: () => `
    background-color:rgba(75, 115, 236, 0.1);
    color: #4B73EC;
    &:hover {
      background-color: rgba(75, 115, 236, 0.1);
      color: #4B73EC;
    }
    `,

  uppercase: () => `
    text-transform: uppercase;
    `,

  buttonIcon: () => `
        border-radius: 100px;
        display: flex;
        width: 56px;
        height: 56px;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: ${color.neutral[100]};
        transition-property: opacity;
        transition-duration: 200ms;
        transition-timing-function: cubic-bezier(.645, .045, .355, 1);
      
      &:hover {
        box-shadow: 0 4px 10px 0 @swatch_2a29602e;
      }
    `

};



const ButtonCustom = styled.button`
  border: none;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  min-width: 100px;
  background-color: ${color.primary[300]};
  color: ${color.neutral[100]};
  
  cursor:${props => props.requesting ? "not-allowed" : "pointer"};
  font-family: ${primaryFont};
  transition: background-color 0.2s cubic-bezier(.6, 0.05, .01, 1), color 0.2s cubic-bezier(.6, 0.05, .01, 1),
    border 0.2s cubic-bezier(.6, 0.05, .01, 1), transform 0.2s cubic-bezier(.6, 0.05, .01, 1),
    border 0.2s cubic-bezier(.6, 0.05, .01, 1);
    padding: 0px 16px; 
  &:hover {
    background-color: ${color.primary[400]};
    color: ${color.neutral[100]};
    transform: translate(0px, -1px) scale(1.02);
  }

  &:focus {
    // outline: 1px solid ${color.green[300]};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${color.primary[400]};
    border-color: ${color.primary[400]};
    transform: translate(0px, 0.1px) scale(1);  }

  &:disabled {
    cursor: not-allowed;
    background: ${color.neutral[300]};
    color: ${color.neutral[400]};
    // background: rgba(0,0,0,.7);
    border: none;
  }

  ${applyStyleModifiers(BUTTON_MODIFIERS)}
  
`;
const defaultOptionsWhite = {
  loop: true,
  autoplay: true,
  animationData: loadingWhiteData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const defaultOptionsBlack = {
  loop: true,
  autoplay: true,
  animationData: loadingBlackData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const Loader = (props) => {



  return (
    props.blackLoader ?
      <Lottie style={{ cursor: "not-allowed" }} isClickToPauseDisabled={true} options={defaultOptionsBlack} height="100%" width={40} />
      : <Lottie style={{ cursor: "not-allowed" }} isClickToPauseDisabled={true} options={defaultOptionsWhite} height="100%" width={40} />
  );
}


export const Button = props => {
  return <ButtonCustom {...props} children={props.requesting ? <Loader blackLoader={props.blackLoader} /> : props.children} onClick={props.requesting ? null : props.onClick} />
}

Button.defaultProps = {
  requesting: false,
  disabled: false,
  blackLoader: false
}

Button.propTypes = {
  style: PropTypes.object
}






























// export const PrimaryButton = styled(Button)`

//   ${applyStyleModifiers(BUTTON_MODIFIERS)}
// `;










// export const SecondaryButton = styled(Button)`
//   border: 1px solid ${color.primary[300]};
//   color: ${color.primary[300]};
//   background: none;

//   &:disabled {
//     background: none;
//     border: 1px solid ${color.neutral[300]};
//     color: ${color.neutral[300]};
//     cursor: not-allowed;
//   }
//   ${applyStyleModifiers(BUTTON_MODIFIERS)}
// `;

// export const TertiaryButton = styled(Button)`
//   border: 1px solid transparent;
//   color: 1px solid ${color.neutral[300]};
//   background: none;

//   &:disabled {
//     color: ${color.neutral[300]};
//     cursor: not-allowed;
//   }
//   ${applyStyleModifiers(BUTTON_MODIFIERS)}
// `;
