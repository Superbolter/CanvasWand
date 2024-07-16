import React from 'react'
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import { InputAdornment, InputBase, Paper } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import split from "../assets/split.png"
import merge from "../assets/merge.png"
import Unlocked from "../assets/Unlocked.png"
import Delete from "../assets/Delete.png"
import "./WallPropertiesPopup.css";
import Close from "../assets/Close.png"
const WallPropertiesPopup = () => {
  return (
    <div>
     <div className='popup-container'>

      <div className='header-container'>
       <Typography  modifiers={["header6", "medium"]} style={{fontSize: "16px",lineHeight:" 18px",textAlign: "left"}}>Wall Properties</Typography>
       <img style={{width:"28px", height:"28px"}} src={Close} alt="" />
      </div>
      <div className='input-container'>
       <div className='height-input-container'>
         <Typography className='height-text'>Height</Typography>
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
       <Typography className='thickness-text'>Thickness</Typography>
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
       <div className='btn-container'>
          <div className='btn'>
              <img src={split} alt="" />
              <Typography className='contextual-btn-text'>Split</Typography>
          </div>
          <div className='btn'>
              <img src={merge} alt="" />
              <Typography className='contextual-btn-text'>Merge</Typography>

          </div>
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

export default WallPropertiesPopup
