import React from 'react';
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import wallIcon from "../assets/wallIcon.png";
import "./ButtonComponent.css";

const ButtonComponent = () => {
  return (
    <div>
      <div className="scrollable-container">
        <div className="scrollable-content">
          <Typography className='btn-heading-text' modifiers={['medium']}>Structures</Typography>
          <div className="grid-container">
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Walls</Typography>
            </div>
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Room</Typography>
            </div>
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Column</Typography>
            </div>
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Beam</Typography>
            </div>
          </div>
        </div>
        <div className="scrollable-content">
          <Typography className='btn-heading-text'>Doors, windows & railings</Typography>
          <div className="grid-container">
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Door</Typography>
            </div>
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Door opening</Typography>
            </div>
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Sliding Door</Typography>
            </div>
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Window</Typography>
            </div>
            <div className='drawtool-btn'>
              <img src={wallIcon} alt="" style={{width: "20px", height: "15px"}}/>
              <Typography className='btn-text'>Balcony railing</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonComponent;
