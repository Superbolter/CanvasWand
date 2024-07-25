import React from 'react'
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import WallIcon from "../assets/WallIcon.svg"
import DoorIcon from "../assets/DoorIcon.svg"
import WindowIcon from "../assets/WindowIcon.svg"
import RailingIcon from "../assets/RailingIcon.svg"
import "./ContextualMenu.css"
import { useDispatch, useSelector } from "react-redux";
import { setTypeId } from '../Actions/DrawingActions.js';
import {updateLineTypeId} from "../Actions/ApplicationStateAction.js"
const ContextualMenu = () => {
    const dispatch=useDispatch();
    let newLineId=null;
    const storeLines=useSelector((state)=>state.ApplicationState.storeLines)
    if(storeLines.length>0){

       newLineId=storeLines[storeLines.length-1].id
    }
    const handleWallClick=()=>{
      console.log( newLineId)
      dispatch(updateLineTypeId( newLineId, 1,storeLines ));
      dispatch(setTypeId(1)); 
    }
    const handleDoorClick=()=>{
      console.log( newLineId)
      dispatch(updateLineTypeId(newLineId, 2,storeLines));
      dispatch(setTypeId(2)); 
    }
    const handleWindowClick=()=>{
      console.log( newLineId)
      dispatch(updateLineTypeId(newLineId, 3,storeLines));
      dispatch(setTypeId(3)); 
    }
    const handleRailingClick=()=>{
      console.log( newLineId)
      dispatch(updateLineTypeId(newLineId, 4,storeLines));
      dispatch(setTypeId(4)); 
    }
    
  return (
    <div className='contextual-menu-component'>
        <div className='contextual-menu-element' onClick={handleWallClick}>
         <img src={WallIcon} alt="" />
         <Typography className='contextual-menu-text'>Wall</Typography>
        </div>
        <div className='contextual-menu-element' onClick={handleDoorClick}>
         <img src={DoorIcon} alt="" />
         <Typography className='contextual-menu-text'>Door</Typography>

        </div>
        <div className='contextual-menu-element' onClick={handleWindowClick}>
         <img src={WindowIcon} alt="" />
         <Typography className='contextual-menu-text'>Window</Typography>

        </div>
        <div className='contextual-menu-element' onClick={handleRailingClick}>
         <img src={RailingIcon} alt="" />
         <Typography className='contextual-menu-text'>Railing</Typography>

        </div>
        
      
    </div>
  )
}

export default ContextualMenu
