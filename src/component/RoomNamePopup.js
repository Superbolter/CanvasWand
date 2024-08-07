import React, { useEffect, useState } from 'react';
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import { Button } from "../design_system/StyledComponents/components/Button";
import TextField from '@mui/material/TextField';
import Close from "../assets/Close.png";
import "./WallPropertiesPopup.css";
import { useDispatch, useSelector } from 'react-redux';
import { setContextualMenuStatus, setTypeId } from '../Actions/DrawingActions.js';
import { showRoomNamePopup } from '../Actions/ApplicationStateAction.js';
import {useDrawing} from '../hooks/useDrawing.js'
const RoomNamePopup = () => {
  const [roomName, setRoomName] = useState('');
  const roomPopup = useSelector((state) => state.ApplicationState.roomPopup);
  const dispatch = useDispatch();
  const {room,selectedLines}=useDrawing();
  const handleCloseClick = () => {
    dispatch(showRoomNamePopup(false));
    dispatch(setContextualMenuStatus(false));
  };

  const handleSaveAndNextClick = () => {
    room(roomName,selectedLines);
    setRoomName('');
    dispatch(showRoomNamePopup(false));
    dispatch(setContextualMenuStatus(false));
  };



  return (
    <div>
      <div className={roomPopup ? 'popup-container' : "popup-container-hidden"}>
        <div className='header-container'>
          <Typography modifiers={["header6", "medium"]} style={{ fontSize: "16px", lineHeight: "18px", textAlign: "left" }}>Room Name</Typography>
          <img onClick={handleCloseClick} style={{ width: "28px", height: "28px" }} src={Close} alt="Close" />
        </div>
        <div className='input-container' style={{ height: "fit-content" }}>
          <div className='height-input-container'>
            <Typography className='height-text'>Enter Room name</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              variant="outlined"
              size="small"
              required={true}
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <div className='btn-container'>
            <Button className='save-btn' onClick={handleSaveAndNextClick}>Save & next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomNamePopup;
