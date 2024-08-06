import React from 'react'
import {Typography} from "../design_system/StyledComponents/components/Typography.js"
import {Button} from "../design_system/StyledComponents/components/Button"
import Undo from "../assets/Undo.png"
import Redo from "../assets/Redo.png"
import  './ButtonComponent.css'
import {handleDownload} from "./ConvertToJson.js"

import { useDispatch, useSelector } from 'react-redux'
import { drawData, updateDrawData } from '../Actions/ApplicationStateAction.js'

const DrawtoolHeader = ({deleteLastPoint,lines,points, roomSelectors,redo}) => {
  const dispatch=useDispatch()
  const {factor,floorplanId}=useSelector((state)=>state.ApplicationState)
  const handleSaveClick =()=>{
    // if(drawData){
    const data=handleDownload(lines,points, roomSelectors)

    const finalData={
      floorplan_id:floorplanId,
      draw_data:data,
      scale:factor,
    }
    // const jsonData = JSON.stringify(finalData);
    // console.log(jsonData)
    //   dispatch(setStoreLines(drawData.lines))
    // }
    const line = data&&data.lines&&data.lines.map(line => ({
      id: line.id,
      points: [
          { x: line.startPoint.x, y: line.startPoint.y, z: line.startPoint.z },
          { x: line.endPoint.x, y: line.endPoint.y, z: line.endPoint.z }
      ],
      length: line.length,
      width: line.width,
      height: line.height,
      widthchangetype: line.widthchangetype,
      widthchange: line.widthchange,
      type: line.type,
      typeId:line.typeId
  }));
  console.log(line)
    dispatch(updateDrawData(finalData,floorplanId))
  }
  return (
    <div style={{position:"fixed", top:"20px", left:"20px", backgroundColor:"white",borderRadius:"12px", width:"79vw", padding:"12px", display:"flex", alignItems:"center", justifyContent:"space-between",boxShadow: "0px 4px 14px -3px #0C0C0D21", zIndex:"2"
        }}>
  
      <Typography className='header-text'>Create your own 3D home</Typography>
      <div style={{display:"flex",gap:"8px"}}>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn' onClick={deleteLastPoint}>
        <img style={{width:"24px", height:"24px"}} src={Undo} alt="" />
        <Typography>Undo</Typography>
        </Button>
      <Button modifiers={["outlineBlack","sm"]} className='undo-redo-btn' onClick={redo}>
      <img style={{width:"24px", height:"24px"}}src={Redo} alt="" />
      <Typography>Redo</Typography>
      </Button>
      <Button className='save-btn' onClick={handleSaveClick}>Save & next</Button>
      </div>
    </div>
  )
}

export default DrawtoolHeader
