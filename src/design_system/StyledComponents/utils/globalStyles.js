import React from 'react';
import { createGlobalStyle } from 'styled-components';
import styled from "styled-components";
import { color, typeScale, primaryFont } from "../utils";
import { applyStyleModifiers } from "styled-components-modifiers";

 
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-family: ${primaryFont};
  }
    .container {
    margin: 0 32px;
    
    }
  
    
    
    @media screen and (min-width: 1280px) {
        .container {
            max-width: 1120px;
            margin: 0 auto;
        }

        html {
            font-size: 16px;
        }
    }

    
    @media screen and (min-width: 1440px) {
        .container {max-width: 1360px;}

        html {
            font-size: 16px;
        }
    }


    @media screen and (min-width: 1920px) {
        .container {
            max-width: 1700px;
        }

        html {
            font-size: 16px;
        }
    }

    @media screen and (max-width: 991px) {
        .container {margin: 0 32px;}
        html {
            font-size: 14px;
        }
    }
    @media screen and (max-width: 767px) {
        .container {margin: 0 24px;}
        html {
            font-size: 12px;
        }
    }
    @media screen and (max-width: 479px) {
        margin: 0 16px;
        html {
            font-size: 12px;
        }
    }
`;
 
export default GlobalStyle