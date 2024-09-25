import React from 'react';
import styled from "styled-components";
import { color, typeScale, primaryFont } from "../utils/index"
import { applyStyleModifiers } from "styled-components-modifiers";

const TEXT_MODIFIERS = {
  sm: () => `
    height : 8px;
  `,
  md: () => `
    height : 16px;
  `,
  lg: () => `
    height : 24px;
  `
};

export const Spacing = styled.div`
  height : 8px;
  ${applyStyleModifiers(TEXT_MODIFIERS)}
`