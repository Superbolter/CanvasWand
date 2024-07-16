import React from 'react'
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import WallIcon from "../assets/WallIcon.svg"
import DoorIcon from "../assets/DoorIcon.svg"
import WindowIcon from "../assets/WindowIcon.svg"
import RailingIcon from "../assets/RailingIcon.svg"
import "./ContextualMenu.css"
const ContextualMenu = () => {
  return (
    <div className='contextual-menu-component'>
        <div className='contextual-menu-element'>
         <img src={WallIcon} alt="" />
         <Typography className='contextual-menu-text'>Wall</Typography>
        </div>
        <div className='contextual-menu-element'>
         <img src={DoorIcon} alt="" />
         <Typography className='contextual-menu-text'>Door</Typography>

        </div>
        <div className='contextual-menu-element'>
         <img src={WindowIcon} alt="" />
         <Typography className='contextual-menu-text'>Window</Typography>

        </div>
        <div className='contextual-menu-element'>
         <img src={RailingIcon} alt="" />
         <Typography className='contextual-menu-text'>Railing</Typography>

        </div>
        
      
    </div>
  )
}

export default ContextualMenu
