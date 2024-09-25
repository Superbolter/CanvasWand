import React from 'react'
import "./ReportButton.css"
import { Typography } from '../../design_system/StyledComponents/components/Typography'
import icon from "../../assets/bug_icon.svg"

const ReportButton = () => {
  const handleClick = () =>{
    window.Tally.openPopup(process.env.REACT_APP_REPORT_ISSUE_TALLY_FORM, {
      layout: "modal",
      width: "800",
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
