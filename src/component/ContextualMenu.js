import React from 'react'
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import WallIcon from "../assets/WallIcon.svg"
import DoorIcon from "../assets/DoorIcon.svg"
import WindowIcon from "../assets/WindowIcon.svg"
import RailingIcon from "../assets/RailingIcon.svg"
import "./ContextualMenu.css"
import { useDispatch, useSelector } from "react-redux";
import { setType } from '../Actions/DrawingActions.js';
const ContextualMenu = () => {
    const dispatch=useDispatch();
    const handleMode=(mode)=>{
        dispatch(setType(mode));
    }
  return (
    <div className='contextual-menu-component'>
        <div className='contextual-menu-element' onClick={handleMode(1)}>
         <img src={WallIcon} alt="" />
         <Typography className='contextual-menu-text'>Wall</Typography>
        </div>
        <div className='contextual-menu-element' onClick={handleMode(2)}>
         <img src={DoorIcon} alt="" />
         <Typography className='contextual-menu-text'>Door</Typography>

        </div>
        <div className='contextual-menu-element' onClick={handleMode(3)}>
         <img src={WindowIcon} alt="" />
         <Typography className='contextual-menu-text'>Window</Typography>

        </div>
        <div className='contextual-menu-element' onClick={handleMode(4)}>
         <img src={RailingIcon} alt="" />
         <Typography className='contextual-menu-text'>Railing</Typography>

        </div>
        
      
    </div>
  )
}

export default ContextualMenu
