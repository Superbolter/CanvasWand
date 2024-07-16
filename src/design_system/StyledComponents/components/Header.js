import React from 'react';
import styled from "styled-components";
import { color, typeScale, primaryFont } from "../utils/index"
import { applyStyleModifiers } from "styled-components-modifiers";


const H1 = styled.h1`
  font-size: ${typeScale.header1};
`;

const H2 = styled.h2`
  font-size: ${typeScale.header2};
`;

const H3 = styled.h3`
  font-size: ${typeScale.header3};
`;
const H4 = styled.h4`
  font-size: ${typeScale.header4};
`;

const H5 = styled.h5`
  font-size: ${typeScale.header5};
`;

const H6 = styled.h6`
  font-size: ${typeScale.header6};
`;  


const Heading = {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6
  };
  
export default Heading;