import React, { useEffect, useState } from 'react';
import { Typography } from "../../design_system/StyledComponents/components/Typography.js";
import WallIcon from "../../assets/wallBig.png";
import DoorIcon from "../../assets/doorBig.png";
import WindowIcon from "../../assets/windowBig.png";
import RailingIcon from "../../assets/railingBig.png";
import "./ButtonComponent.css";
import { useDispatch, useSelector } from 'react-redux';
import { setShowPopup, setTypeId } from '../../Actions/DrawingActions.js';
import { setSelectedButton } from '../../features/drawing/drwingSlice.js';
import useModes from '../../hooks/useModes.js';
import HowTo from './HowTo.js';
import divide from "../../assets/WallOpening.png"
import { setShowFirstTimePopup } from '../../Actions/PopupAction.js';

const ButtonComponent = () => {
  const {lineBreak,merge} = useSelector((state) => state.drawing);
  const {typeId, showPropertiesPopup} = useSelector((state) => state.Drawing);
  const { selectedButton} = useSelector((state)=> state.drawing)
  const {designStep, selectionMode} = useSelector((state) => state.ApplicationState);
  const dispatch = useDispatch()
  const {toggleSelectionMode} = useModes();
  const { showFirstTimePopup, firstTimePopupNumber, enableFirstTimePopup } =useSelector((state) => state.PopupState);

  const handleButtonClick = (buttonName) => {
    if(showFirstTimePopup && enableFirstTimePopup && firstTimePopupNumber === 3){
      dispatch(setShowFirstTimePopup({
        showFirstTimePopup: true,
        firstTimePopupType: "canvas",
        popupDismissable: false,
        firstTimePopupNumber: 4
      }))
    }
    if(selectionMode){
      toggleSelectionMode();
    }
    if(buttonName=== selectedButton){
      dispatch(setSelectedButton(null))
      dispatch(setTypeId(0))
      return
    }else{
      dispatch(setSelectedButton(buttonName))
    }
    // dispatch(setShowPopup(true));
    if (buttonName === 'Walls') {
      dispatch(setTypeId(1))
    }
    else if (buttonName === "Door"){
      dispatch(setTypeId(2))
    }else if(buttonName === "Window"){
      dispatch(setTypeId(3))
    }else if(buttonName === "Railing"){
      dispatch(setTypeId(4))
    }else if(buttonName === "Divide"){
      dispatch(setTypeId(5))
    }else{
      dispatch(setTypeId(0))
    }
    
  };

  return (
    <div>
      <div className={showPropertiesPopup || lineBreak || merge || designStep !== 2? "scrollable-container-hidden" : "scrollable-container"}>
        <div className="scrollable-content">
          <Typography className='btn-heading-text' modifiers={['medium']}>Structures</Typography>
          <div className="grid-container">
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              className={`drawtool-btn ${selectedButton === 'Walls' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Walls')}
            >
              <img src={WallIcon} alt="" style={{ width: "24px", height: "24px",}} />
              <Typography className='btn-text' style={{color:selectedButton==="Walls"&&"#4B73EC" }}>Walls</Typography>
            </div>
            <HowTo type="addWall" />
            </div>
            <div
              className={`drawtool-btn ${selectedButton === 'Divide' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Divide')}
            >
              <img src={divide} alt="" style={{ width: "24px", height: "24px",}} />
              <Typography className='btn-text' style={{color:selectedButton==="Divide"&&"#4B73EC" }}>Wall Opening</Typography>
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
              <img src={DoorIcon} alt="" style={{ width: "24px", height: "24px",}}/>
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
              <img src={WindowIcon} alt="" style={{ width: "24px", height: "24px",}} />
              <Typography className='btn-text'style={{color:selectedButton==="Window"&&"#4B73EC" }}>Window</Typography>
            </div>
            <div
              className={`drawtool-btn ${selectedButton === 'Railing' ? 'selected' : ''}`}
              onClick={() => handleButtonClick('Railing')}
            >
              <img src={RailingIcon} alt="" style={{ width: "24px", height: "24px",}} />
              <Typography className='btn-text'style={{color:selectedButton==="Railing"&&"#4B73EC" }}>Balcony</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonComponent;
