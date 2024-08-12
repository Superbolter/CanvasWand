import React from 'react'
import {Typography} from "../design_system/StyledComponents/components/Typography.js"
import {Button} from "../design_system/StyledComponents/components/Button"
import Undo from "../assets/Undo.png"
import Redo from "../assets/Redo.png"
import  './ButtonComponent.css'

import { useDispatch, useSelector } from 'react-redux'
import { drawData, setRoomSelectorMode, updateDrawData } from '../Actions/ApplicationStateAction.js'
import { ArrowBack } from '@mui/icons-material'
import { setScale } from '../features/drawing/drwingSlice.js'

const DrawtoolHeader = ({deleteLastPoint,redo, handleSaveClick,handleDoubleClick} ) => {
  const dispatch=useDispatch()
  const {factor,floorplanId,roomSelectorMode}=useSelector((state)=>state.ApplicationState)
  const {scale} = useSelector((state) => state.drawing)
  
  return (
    <div style={{position:"fixed", top:"20px", left:"20px", backgroundColor:"white",borderRadius:"12px", width:"79vw", padding:"12px", display:"flex", alignItems:"center", justifyContent:"space-between",boxShadow: "0px 4px 14px -3px #0C0C0D21", zIndex:"2"
        }}>
      <Typography modifiers={["medium", "black600"]} className='header-text'>
        {roomSelectorMode?
          <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
            <div style={{backgroundColor:"#F4F4F4", padding:"4px 8px", borderRadius:"8px"}} onClick={()=>{dispatch(setRoomSelectorMode(false))}}><ArrowBack style={{fontSize:"20px", cursor:"pointer", marginTop:"5px"}}/></div>
            <Typography>Define the rooms</Typography>
          </div>
        : scale? "Select the accurate scale for your floor plan"
        : 
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
            <div style={{backgroundColor:"#F4F4F4", padding:"4px 8px", borderRadius:"8px"}} onClick={()=>{dispatch(setScale(true))}}><ArrowBack style={{fontSize:"20px", cursor:"pointer", marginTop:"5px"}}/></div>
            <Typography>Create your own 3D home</Typography>
          </div>
        }
      </Typography>
      {scale? <div style={{display:"flex",gap:"8px"}}>
          <Button className='save-btn' modifiers={["blue"]} onClick={handleDoubleClick}>Save & next</Button>
        </div>:
      <div style={{display:"flex",gap:"8px"}}>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn' onClick={deleteLastPoint}>
        <img style={{width:"24px", height:"24px"}} src={Undo} alt="" />
        <Typography>Undo</Typography>
        </Button>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn' onClick={redo}>
      <img style={{width:"24px", height:"24px"}}src={Redo} alt="" />
      <Typography>Redo</Typography>
      </Button>
      <Button className='save-btn' modifiers={["blue"]} onClick={handleSaveClick}>Save & next</Button>
      </div>}
    </div>
  )
}

export default DrawtoolHeader
