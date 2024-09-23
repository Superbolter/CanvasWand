import React from 'react'
import "./EscapeHelper.css"
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Typography } from '../../design_system/StyledComponents/components/Typography';
import { useDispatch } from 'react-redux';
import { setEscapeMessageShow } from '../../Actions/ApplicationStateAction';

const EscapeHelper = () => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(setEscapeMessageShow(false));
    }
  return (
    <div className='escape-helper-container'>
      <div className='escape-helper-content'>
        <NotificationsIcon style={{marginRight: "16px"}}/>
        <Typography>Press&nbsp;</Typography>
        <div className='escape-helper-escape'><Typography>Esc</Typography></div>
        <Typography>&nbsp;to exit drawing</Typography>
        </div>
      <div className='escape-helper-right'>
        <Typography onClick={handleClick} modifiers={["blue"]}>Don't show again</Typography>
      </div>
    </div>
  )
}

export default EscapeHelper
