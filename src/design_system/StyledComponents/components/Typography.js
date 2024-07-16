import React from 'react';
import styled from "styled-components";
import { color, typeScale, primaryFont, lineHeight } from "../utils/index"
import { applyStyleModifiers } from "styled-components-modifiers";

const TEXT_MODIFIERS = {
  header1: () => `
  font-size: ${typeScale.header1};
  line-height:${lineHeight.header1};
`,

  header2: () => `
  font-size: ${typeScale.header2};
  line-height:${lineHeight.header2};
`,

  header3: () => `
  font-size: ${typeScale.header3};
  line-height:${lineHeight.header3};
  `,

  header4: () => `
  font-size: ${typeScale.header4};
  line-height:${lineHeight.header4};
  `,

  header5: () => `
  font-size: ${typeScale.header5};
  line-height:${lineHeight.header5};
  `,

  header6: () => `
  font-size: ${typeScale.header6};
  line-height:${lineHeight.header6};
  `,

  body : () => ` 
  font-size : ${typeScale.body};
  `,

  subtitle: () => `
    font-size : ${typeScale.subtitle};
    line-height:${lineHeight.subtitle};
  `,

  subtitle1: () => `
  font-size : ${typeScale.subtitle1};
  line-height:${lineHeight.subtitle1};
  `,

  subtitle2: () => `
    font-size : ${typeScale.subtitle2};
    line-height:${lineHeight.subtitle2};
  `,

  subtitle3: () => `
  font-size : ${typeScale.subtitle3};
  line-height:${lineHeight.subtitle3};
  `,

  button: () => `
    font-size : ${typeScale.button};
    line-height:${lineHeight.button};
  `,

  caption: () => `
    font-size : ${typeScale.caption};
    line-height:${lineHeight.caption};
  `,

  overline: () => `
    font-size : ${typeScale.overline};
    display: inline-block;
    text-transform: uppercase;
    line-height:${lineHeight.overline};
  `,

  helpText: () => `
  font-size : ${typeScale.helpText};
  line-height:${lineHeight.helpText};
  `,

  overline2: () => `
    font-size : ${typeScale.overline};
    line-height:${lineHeight.overline};
  `,

  bold: () => `
    font-weight : ${typeScale.bold};
  `,

  medium: () => `
    font-weight : ${typeScale.medium};
  `,
  inline: () => `
  display:inline;
  `,

  // SD:Added modifiers for white color
  white: () => `
        color: ${color.neutral[100]};
  `,

  primary: () => `
    color:${color.primary[300]};
  `,
  grey: () => `
    color:${color.neutral[400]};
  `,

  black450: () => `
  color:${color.neutral[450]};
  `,

  black550: () => `
  color:${color.neutral[550]};
  `,

  black600: () => `
  color:${color.neutral[600]};
  `,

  warning300: () => `
  color: red;
  `,

  green: () => `
  color:${color.green[300]};
  `,
  blue: () => `
  color:#4B73EC};
  `,
  uppercase: () => `
  text-transform: uppercase;
  `,
  capitalize:()=>`
  text-transform: capitalize;
  `,
  lowercase:()=>`
  text-transform: lowercase;
  `,
  underline: () => `
  text-decoration:underline;
  `,

  hoverUnderline: () => `
    cursor:pointer;
    border-bottom:solid transparent;
    transition:all 450ms ease-in-out;
    &:hover{
      border-bottom:solid;
    }
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
  center: () => `
  text-align:center;
  `,
  pointer: () =>`
  cursor:pointer;
  `

};

export const Typography = styled.span`
  font-family : ${primaryFont};
  display: block;
  ${applyStyleModifiers(TEXT_MODIFIERS)};
`

