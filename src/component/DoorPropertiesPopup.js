import React from 'react'
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import TextField from '@mui/material/TextField';
import split from "../assets/split.png"
import merge from "../assets/merge.png"
import Unlocked from "../assets/Unlocked.png"
import Delete from "../assets/Delete.png"
import "./WallPropertiesPopup.css";
import Close from "../assets/Close.png"
import { useDispatch, useSelector } from 'react-redux';
import { setContextualMenuStatus, setTypeId } from '../Actions/DrawingActions.js';

const DoorPropertiesPopup = () => {
  const typeId=useSelector((state)=>state.Drawing.typeId);
  const dispatch=useDispatch();
  const handleCloseClick=()=>{
    dispatch(setTypeId(0));
    dispatch(setContextualMenuStatus(false))
  }
  return (
    <div>
  <div className={typeId===2?'popup-container':"popup-container-hidden"} >

<div className='header-container'>
 <Typography  modifiers={["header6", "medium"]} style={{fontSize: "16px",lineHeight:" 18px",textAlign: "left"}}>Door Properties</Typography>
 <img onClick={handleCloseClick} style={{width:"28px", height:"28px"}} src={Close} alt="" />
</div>
<div className='input-container'>
 <div className='height-input-container'>
   <Typography className='height-text'>Width</Typography>
   <TextField
      style={{width:"100%", height:"34px"}}
      id="outlined-required"
      placeholder="inch"
      label="inch"
      variant="outlined"
      size="small"
      required={true}
      type="tel"
  />

 </div>
 <div className='thickness-input-container'>
 <Typography className='thickness-text'>Height</Typography>
 <TextField
      style={{width:"100%", height:"34px"}}
      id="outlined-required"
      placeholder="inch"
      label="inch"
      variant="outlined"
      size="small"
      required={true}
      type="tel"
  />
 </div>

 <div className='divider'>

 </div>
 <div className='btn-container' style={{justifyContent:"flex-start"}}>
    
    <div className='btn'>
        <img src={Unlocked} alt="" />
        <Typography className='contextual-btn-text'>Lock</Typography>
        
    </div>
    <div className='btn'>
        <img src={Delete} alt="" />
        <Typography className='contextual-btn-text'>Delete</Typography>

    </div>
 </div>
</div>
</div>
      
    </div>
  )
}

export default DoorPropertiesPopup
