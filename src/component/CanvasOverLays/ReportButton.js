import React from 'react'
import "./ReportButton.css"
import { Typography } from '../../design_system/StyledComponents/components/Typography'
import icon from "../../assets/bug_icon.svg"
import { useSelector } from 'react-redux'

const ReportButton = () => {
  const {floorplanId} = useSelector((state) => state.ApplicationState)
  const handleClick = () =>{
    window.Tally.openPopup(process.env.REACT_APP_REPORT_ISSUE_TALLY_FORM, {
      layout: "modal",
      width: "800",
      hiddenFields: {
        username: window.curentUserSession.name,
        email: window.curentUserSession.email,
        user_id: window.curentUserSession.user_id,
        floorplan_id: floorplanId
      },
    })
    window.GAEvent("DrawTool", "ButtonClicked", "ReportIssue")
  }
  return (
    <div className='report-button-container' onClick={handleClick}>
      <img src={icon} alt="bug icon" />
      <Typography modifiers={["medium", "subtitle2"]}>Report Issue</Typography>
    </div>
  )
}

export default ReportButton
