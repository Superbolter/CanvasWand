import React, { useState } from "react";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Typography } from "../../design_system/StyledComponents/components/Typography";
import { useDispatch, useSelector } from "react-redux";
import { setImageOpacity } from "../../Actions/ApplicationStateAction";

const BottomComponent = ({ zoom, setZoom }) => {
  const {imageOpacity, img} = useSelector((state) => state.ApplicationState);
  const dispatch = useDispatch();
  const [value, setValue] = useState(imageOpacity * 100); // Default value of 30%

  const [isHovered, setIsHovered] = useState(false);  // For showing tooltip

  const handleSliderChange = (e) => {
    setValue(e.target.value);
    dispatch(setImageOpacity(e.target.value / 100));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div className="bottom-container">
      <div className="zoom-container">
        <button onClick={() => setZoom(Math.max(zoom - 0.5, 1))}>
          <ZoomOutIcon />
        </button>
        <input
          className="zoom-slider"
          type="range"
          min="1"
          max="4.5"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, #007AFF 0%, #007AFF ${
              ((zoom - 1) / 3.5) * 100
            }%, #0000000D ${((zoom - 1) / 3.5) * 100}%, #0000000D 100%)`,
          }}
        />
        <button onClick={() => setZoom(Math.min(zoom + 0.5, 4.5))}>
          <ZoomInIcon />
        </button>
      </div>
      {img && (
        <div className="slider-container">
          <div className="slider-wrapper">
            <input
              type="range"
              id="opacity-slider"
              min="0"
              max="100"
              value={value}
              className="opacity-slider"
              onChange={handleSliderChange}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            {isHovered && (
              <div className="tooltip" style={{ left: `${value}%` }}>
                <Typography modifiers={["helpText"]}>{value}%</Typography>
              </div>
            )}
          </div>
          <Typography>Image opacity</Typography>
        </div>
      )}
    </div>
  );
};

export default BottomComponent;
