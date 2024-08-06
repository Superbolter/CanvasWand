import React from 'react';
import styled from "styled-components";
import { color, typeScale, primaryFont } from "../utils";
import { applyStyleModifiers } from "styled-components-modifiers";
import logo from '../images/3D.svg';

const MODIFIER_CONFIG = {

  none: () => `
  box-shadow: none;
  background-color: ${color.primary[300]};
  `
}

const ButtonIcons = styled.div`
  display: flex;
  width: 56px;
  height: 56px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${color.neutral[100]};
  box-shadow: ${props => (props.visible ? "0 1px 2px 0 rgba(0, 0, 0, 0.15)" : "none")};
  transition: all 200ms cubic-bezier(.645, .045, .355, 1);
  cursor: pointer;
  

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: scale(0.98);
  }

  ${applyStyleModifiers(MODIFIER_CONFIG)}
`

export default ButtonIcons;