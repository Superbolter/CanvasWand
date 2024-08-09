import React, { useEffect } from 'react'
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import TextField from '@mui/material/TextField';
import split from "../assets/split.png"
import merge from "../assets/merge.png"
import Unlocked from "../assets/Unlocked.png"
import Delete from "../assets/Delete.png"
import "./WallPropertiesPopup.css";
import Close from "../assets/Close.png"
import { useDispatch, useSelector } from 'react-redux';
import { setContextualMenuStatus, setShowPopup, setTypeId } from '../Actions/DrawingActions.js';

const WallPropertiesPopup = ({selectionMode,deleteSelectedLines, splitLines,mergeLines}) => {
  const {typeId, showPropertiesPopup} = useSelector((state) => state.Drawing);
  const dispatch = useDispatch();
  const handleCloseClick = () => {
    dispatch(setTypeId(1));
    dispatch(setShowPopup(false))
    dispatch(setContextualMenuStatus(false));
  };
  const { height, width } = useSelector((state) => state.ApplicationState);

  useEffect(() => {
    console.log(height);
    console.log(width);
  }, [height, width]);

  return (
    <div>
      <div className={typeId === 1 && showPropertiesPopup? 'popup-container' : "popup-container-hidden"}>
        <div className='header-container'>
          <Typography modifiers={["header6", "medium"]} style={{ fontSize: "16px", lineHeight: "18px", textAlign: "left" }}>Wall Properties</Typography>
          <img onClick={handleCloseClick} style={{ width: "28px", height: "28px" }} src={Close} alt="" />
        </div>
        <div className='input-container'>
          <div className='height-input-container'>
            <Typography className='height-text'>Height</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder="inch"
              label="inch"
              variant="outlined"
              size="small"
              required={true}
              type="tel"
              value={height > 0 ? height : ''}
            />
          </div>
          <div className='thickness-input-container'>
            <Typography className='thickness-text'>Thickness</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder="inch"
              label="inch"
              variant="outlined"
              size="small"
              required={true}
              type="tel"
              value={width > 0 ? width : ''}
            />
          </div>
          <div className='divider'>
          </div>
          {selectionMode?
          <div className='btn-container'>
            <div className='btn'>
              <img src={split} alt="" onClick={splitLines}/>
              <Typography className='contextual-btn-text'>Split</Typography>
            </div>
            <div className='btn'>
              <img src={merge} alt="" onClick={mergeLines} />
              <Typography className='contextual-btn-text'>Merge</Typography>
            </div>
            <div className='btn'>
              <img src={Unlocked} alt="" />
              <Typography className='contextual-btn-text'>Lock</Typography>
            </div>
            <div className='btn'>
              <img src={Delete} alt="" onClick={deleteSelectedLines} />
              <Typography className='contextual-btn-text'>Delete</Typography>
            </div>
          </div>:null}
        </div>
      </div>
    </div>
  );
}

export default WallPropertiesPopup;
