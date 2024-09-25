import React from 'react'
import styled from "styled-components";
import PropTypes from 'prop-types';
import { applyStyleModifiers } from "styled-components-modifiers";

const SLIDER_MODIFIERS = {
    //     anchorTop: ({ open }) => `
    //     bottom:auto;
    //     transform:${open ? "translateX(0)" : "translateX(38vw)"};

    //   `,
    //     anchorBottom: ({ open }) => `
    //     top:auto;
    //     transform:${open ? "translateX(0)" : "translateX(38vw)"};

    //   `,
    anchorLeft: ({ open }) => `
    right:auto;
    transform:${open ? "translateX(0)" : "translateX(-38vw)"};

  `,
    anchorRight: ({ open }) => `
    left:auto;
    transform:${open ? "translateX(0)" : "translateX(38vw)"};

  `,

    fullWidthLeft: ({ open }) => `
    width:100vw;
    right:auto;
    transform:${open ? "translateX(0)" : "translateX(-102vw)"};
    
    `


}


const Wrapper = styled.div`
width:  ${props => props.width || '37vw'};
height:100vh;
overflow-x:hidden;
overflow-y:auto;
background:white;
z-index: ${props => props.zIndex || '1301'};
position:fixed;
top:0;
left:0;
right:0;
bottom:0;
transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
box-shadow: 0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%);
left:auto;
transform:${props => props.open ? "translateX(0)" : "translateX(38vw)"};
${applyStyleModifiers(SLIDER_MODIFIERS)};



`


export default function CustomSlider(props) {


    return (

        <Wrapper {...props}>
            {
                props.children
            }
        </Wrapper>
    )
}


CustomSlider.defaultProps = {
    open: false,
}

CustomSlider.propTypes = {
    open: PropTypes.bool,
}
