import React from 'react';
import styled from "styled-components";
import { color, typeScale, primaryFont } from "../utils";
import { applyStyleModifiers } from "styled-components-modifiers";
import logo from '../images/3D.svg';
import ButtonIcons from './ButtonIcons';




const Icon = styled.img`
    position: absolute;
    width: 24px;
    display: block;

`

const ButtonIcon = props => (

    <ButtonIcons>
        <Icon src={props.logo} alt="logo" />
    </ButtonIcons>

)

export default ButtonIcon;