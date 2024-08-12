import React, { useEffect, useState } from 'react';
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import wallIcon from "../assets/wallIcon.png";
import SelectedWall from "../assets/SelectedWall.png";
import "./ButtonComponent.css";
import { useDispatch, useSelector } from 'react-redux';
import { setShowPopup, setTypeId } from '../Actions/DrawingActions.js';
import { setSelectedButton } from '../features/drawing/drwingSlice.js';

const ButtonComponent = ({ setNewLine, selectionMode,toggleSelectionMode }) => {
  const {lineBreak,merge} = useSelector((state) => state.drawing);
  const {typeId, showPropertiesPopup} = useSelector((state) => state.Drawing);
  const { selectedButton} = useSelector((state)=> state.drawing)
  const roomPopup = useSelector((state) => state.ApplicationState.roomPopup);
  const dispatch = useDispatch()
  // useEffect(() => {
    
  // console.log(typeId);
  // console.log(roomPopup);
    
  // }, [typeId, roomPopup])
  
  const handleButtonClick = (buttonName) => {
    if(selectionMode){
      toggleSelectionMode();
    }
    setNewLine();
    dispatch(setSelectedButton(buttonName))
    // dispatch(setShowPopup(true));
    if (buttonName === 'Walls') {
      dispatch(setTypeId(1))
    }
    else if (buttonName === "Door"){
      dispatch(setTypeId(2))
    }else if(buttonName === "Window"){
      dispatch(setTypeId(3))
    }else{
      dispatch(setTypeId(4))
    }
  };

  return (
    <div>
      <div className={showPropertiesPopup || lineBreak || merge? "scrollable-container-hidden" : "scrollable-container"}>
        <div className="scrollable-content">
          <Typography className='btn-heading-text' modifiers={['medium']}>Structures</Typography>
          <div className="grid-container">
            <div
              className={`drawtool-btn ${selectedButton === 'Walls' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Walls')}
            >
              <img src={selectedButton==="Walls"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px",}} />
              <Typography className='btn-text' style={{color:selectedButton==="Walls"&&"#4B73EC" }}>Walls</Typography>
            </div>
            {/* <div
              className={`drawtool-btn ${selectedButton === 'Room' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Room')}
            >
              <img src={selectedButton==="Room"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text' style={{color:selectedButton==="Room"&&"#4B73EC" }}>Room</Typography>
            </div>
            <div
              className={`drawtool-btn ${selectedButton === 'Column' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Column')}
            >
              <img src={selectedButton==="Column"?SelectedWall:wallIcon}alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text' style={{color:selectedButton==="Column"&&"#4B73EC" }}>Column</Typography>
            </div>
            <div
              className={`drawtool-btn ${selectedButton === 'Beam' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Beam')}
            >
              <img src={selectedButton==="Beam"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text' style={{color:selectedButton==="Beam"&&"#4B73EC" }}>Beam</Typography>
            </div> */}
          </div>
        </div>
        <div className="scrollable-content">
          <Typography className='btn-heading-text'>Doors, windows & railings</Typography>
          <div className="grid-container">
            <div
              className={`drawtool-btn ${selectedButton === 'Door' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Door')}
            >
              <img src={selectedButton==="Door"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text' style={{color:selectedButton==="Door"&&"#4B73EC" }}>Door</Typography>
            </div>
            {/* <div
              className={`drawtool-btn ${selectedButton === 'Door opening' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Door')}
            >
              <img src={selectedButton==="Door opening"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text' style={{color:selectedButton==="Door opening"&&"#4B73EC" }}>Door opening</Typography>
            </div>
            <div
              className={`drawtool-btn ${selectedButton === 'Sliding Door' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Door')}
            >
              <img src={selectedButton==="Sliding Door"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text'style={{color:selectedButton==="Sliding Door"&&"#4B73EC" }}>Sliding Door</Typography>
            </div> */}
            <div
              className={`drawtool-btn ${selectedButton === 'Window' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Window')}
            >
              <img src={selectedButton==="Window"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text'style={{color:selectedButton==="Window"&&"#4B73EC" }}>Window</Typography>
            </div>
            <div
              className={`drawtool-btn ${selectedButton === 'Balcony railing' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Balcony railing')}
            >
              <img src={selectedButton==="Balcony railing"?SelectedWall:wallIcon} alt="" style={{ width: "20px", height: "15px" }} />
              <Typography className='btn-text'style={{color:selectedButton==="Balcony railing"&&"#4B73EC" }}>Balcony railing</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonComponent;
