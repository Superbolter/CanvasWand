import React from 'react'
import { Typography } from '../../design_system/StyledComponents/components/Typography'
import play from "../../assets/play.svg"
import { setHelpVideo } from '../../Actions/ApplicationStateAction'
import { useDispatch, useSelector } from 'react-redux'

const HowTo = ({type}) => {
  const dispatch = useDispatch();
  const { helpVideoType} = useSelector(state => state.ApplicationState)

  const handleClick = () => {
    dispatch(setHelpVideo(true, type))
    window.GAEvent("DrawTool", "ButtonClicked", "HowTo", type)
  }

  return (
    <div onClick={handleClick} style={{cursor:"pointer", display:"flex", justifyContent: type === "setScale"?"flex-start":"center", alignItems:"center", gap:"4px"}}>
      <Typography modifiers={["helpText", "blue"]}>How to </Typography>
      <img src={play} alt="play" />
    </div>
  )
}

export default HowTo
