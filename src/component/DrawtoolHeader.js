import React from 'react'
import {Typography} from "../design_system/StyledComponents/components/Typography.js"
import {Button} from "../design_system/StyledComponents/components/Button"
import Undo from "../assets/Undo.png"
import Redo from "../assets/Redo.png"
import  './ButtonComponent.css'
const DrawtoolHeader = ({deleteLastPoint}) => {
  return (
    <div style={{position:"fixed", top:"20px", left:"20px", backgroundColor:"white",borderRadius:"12px", width:"79vw", padding:"12px", display:"flex", alignItems:"center", justifyContent:"space-between",boxShadow: "0px 4px 14px -3px #0C0C0D21", zIndex:"2"
        }}>
  
      <Typography className='header-text'>Create your own 3D home</Typography>
      <div style={{display:"flex",gap:"8px"}}>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn' onClick={deleteLastPoint}>
        <img style={{width:"24px", height:"24px"}} src={Undo} alt="" />
        <Typography>Undo</Typography>
        </Button>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn'>
      <img style={{width:"24px", height:"24px"}}src={Redo} alt="" />
      <Typography>Redo</Typography>
      </Button>
      <Button className='save-btn'>Save & next</Button>
      </div>
    </div>
  )
}

export default DrawtoolHeader
