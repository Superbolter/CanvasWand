import React from 'react'
import './HelpVideoPopup.css'
import { useSelector } from 'react-redux'
import { Typography } from '../../design_system/StyledComponents/components/Typography'
import useResources from '../../hooks/useResources'

const videoData = {
    "addRoom": {
        title: "How to add a room",
        subtitle: "to understand how adding a room works, watch this video",
        videoUrl: "/Images/DrawTool/AddRoom.mov"
    },
    "divideRoom": {
        title: "How to divide a room",
        subtitle: "to understand how dividing a room works, watch this video",
        videoUrl: "/Images/DrawTool/DivideRoom.mov"
    },
    "setScale": {
        title: "How to set scale",
        subtitle: "to understand how setting scale works, watch this video",
        videoUrl: "/Images/DrawTool/SetScale.mov"
    },
    "addWall": {
        title: "How to add a wall",
        subtitle: "to understand how adding a wall works, watch this video",
        videoUrl: "/Images/DrawTool/AddWall.mov"
    }
}

const HelpVideoPopup = () => {
    const {helpVideo, helpVideoType} = useSelector(state => state.ApplicationState)
    const {getRomeCdnUrl} = useResources();

  return (
    <div>
      <div className={helpVideo ? "help-popup-container" : "help-popup-container-hidden"}>
        <img src={getRomeCdnUrl() + videoData[helpVideoType].videoUrl} alt="help video" />
        <Typography modifiers={["black600", "body", "medium"]}>{videoData[helpVideoType].title}</Typography>
        <Typography modifiers={["subtitle2"]} style={{color:"#6E757A"}}>{videoData[helpVideoType].subtitle}</Typography>
      </div>
    </div>
  )
}

export default HelpVideoPopup
