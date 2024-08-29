import React from 'react'
import {Typography} from "../design_system/StyledComponents/components/Typography.js"
import {Button} from "../design_system/StyledComponents/components/Button"
import Undo from "../assets/Undo.png"
import Redo from "../assets/Redo.png"
import  './ButtonComponent.css'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useDispatch, useSelector } from 'react-redux'
import { drawData, setRoomSelectorMode, showRoomNamePopup, updateDrawData } from '../Actions/ApplicationStateAction.js'
import { ArrowBack } from '@mui/icons-material'
import { setScale ,setLinePlacementMode} from '../features/drawing/drwingSlice.js'
import { Switch } from '@mui/material'
import { setSeeDimensions } from '../Actions/DrawingActions.js'

const MySwal = withReactContent(Swal);

const DrawtoolHeader = ({undo,redo, handleSaveClick,handleDoubleClick, handleReset,handleResetRooms} ) => {
  const dispatch=useDispatch()
  const {factor,floorplanId,roomSelectorMode,linePlacementMode}=useSelector((state)=>state.ApplicationState)
  const {userLength,scale} = useSelector((state) => state.drawing)
  const {seeDimensions} = useSelector((state) => state.Drawing)

  const handleBackToScale = () =>{
    dispatch(setScale(true))
    handleReset()
  }

  const handleMidpointClick = () => {
    dispatch(setLinePlacementMode("midpoint"));
  };

  const handleBelowClick = () => {
    dispatch(setLinePlacementMode("below"));
  };

  const handleBackToDrawing = () =>{
    MySwal.fire({
        title: "Are you sure?",
        html: `
          <p>All your room data will be lost and only the structures will be available to you</p>
        `,
        icon: "warning",
        confirmButtonText: "Yes",
        showCancelButton: true,
        customClass: {
          title: "swal2-title-custom",
          htmlContainer: "swal2-html-custom",
          confirmButton: "swal2-confirm-button-custom",
        },
        width: "400px",
        padding: "16px",
        borderRadius: "16px",
        backdrop: true,
    }).then((result)=>{
      if (result.isConfirmed) {
        dispatch(setRoomSelectorMode(false)); 
        dispatch(showRoomNamePopup(false))
        handleResetRooms();
      }
    })
  }
  const handleCancel = () =>{
    dispatch(setScale(false))
  }
  
  return (
    <>
    <div style={{position:"fixed", top:"20px", left:"20px", backgroundColor:"white",borderRadius:"12px", width:"79vw", padding:"12px", display:"flex", alignItems:"center", justifyContent:"space-between",boxShadow: "0px 4px 14px -3px #0C0C0D21", zIndex:"2", height:"30px"
        }}>
      <Typography modifiers={["medium", "black600"]} className='header-text'>
        {roomSelectorMode?
          <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
            <div style={{backgroundColor:"#F4F4F4", padding:"4px 8px", borderRadius:"8px"}} onClick={handleBackToDrawing}><ArrowBack style={{fontSize:"20px", cursor:"pointer", marginTop:"5px"}}/></div>
            <Typography>Define the rooms</Typography>
          </div>
        : scale? "Select the accurate scale for your floor plan"
        : 
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
            <div style={{backgroundColor:"#F4F4F4", padding:"4px 8px", borderRadius:"8px"}} onClick={handleBackToScale}><ArrowBack style={{fontSize:"20px", cursor:"pointer", marginTop:"5px"}}/></div>
            <Typography>Create your own 3D home</Typography>
          </div>
        }
      </Typography>
      {scale? null:
      <div style={{display:"flex",gap:"8px"}}>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn' onClick={undo}>
        <img style={{width:"24px", height:"24px"}} src={Undo} alt="" />
        <Typography>Undo</Typography>
        </Button>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn' onClick={redo}>
      <img style={{width:"24px", height:"24px"}}src={Redo} alt="" />
      <Typography>Redo</Typography>
      </Button>

      <Button onClick={handleMidpointClick} disabled={linePlacementMode === "midpoint"}>
        Midpoint
      </Button>
      <Button onClick={handleBelowClick} disabled={linePlacementMode === "below"}>
        Below
      </Button>
      <Button className='save-btn' modifiers={["blue"]} onClick={handleSaveClick}>Save & next</Button>
      </div>}
    </div>
    {scale? null:
      <div className='dimension-setter'>
        <Typography modifiers={["subtitle2"]}>Dimensions</Typography>
        {/* <Switch checked={seeDimensions} onChange={()=>dispatch(setSeeDimensions(!seeDimensions))}
          sx={{
            '& .MuiSwitch-thumb': {
              width: 24,
              height: 24,
            },
            '& .MuiSwitch-track': {
              borderRadius: 16,
              width: 42,
              height: 30,
              position: 'absolute',
              top: "50%",
              transform: 'translateY(-50%)',
              backgroundColor: '#ECECEC',
              opacity: 1,
              transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            },
          }}  
        /> */}
        <label class="switch">
          <input className='dimension-switch' type="checkbox" checked={seeDimensions} onChange={()=>dispatch(setSeeDimensions(!seeDimensions))}/>
          <span class="slider round"></span>
        </label>
      </div>
    }
    </>
  )
}

export default DrawtoolHeader
