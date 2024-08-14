import React, { useEffect } from "react";
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import TextField from "@mui/material/TextField";
import split from "../assets/split.png";
import merge from "../assets/merge.png";
import Unlocked from "../assets/Unlocked.png";
import Delete from "../assets/Delete.png";
import "./WallPropertiesPopup.css";
import Close from "../assets/Close.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setContextualMenuStatus,
  setShowPopup,
  setLockForLines,
  setTypeId,
} from "../Actions/DrawingActions.js";

const DoorPropertiesPopup = ({ selectionMode, deleteSelectedLines }) => {
  const { typeId, showPropertiesPopup } = useSelector((state) => state.Drawing);
  const { height, width, roomSelectorMode } = useSelector((state) => state.ApplicationState);
  const { locked } = useSelector((state) => state.Drawing);
  const dispatch = useDispatch();
  const handleCloseClick = () => {
    dispatch(setTypeId(1));
    dispatch(setShowPopup(false));
    dispatch(setContextualMenuStatus(false));
  };
  const handleLockClick = () => {
    dispatch(setLockForLines(!locked));
  }
  return (
    <div>
      <div
        className={
          typeId === 2 && showPropertiesPopup && !roomSelectorMode
            ? "popup-container"
            : "popup-container-hidden"
        }
      >
        <div className="header-container">
          <Typography
            modifiers={["header6", "medium"]}
            style={{ fontSize: "16px", lineHeight: " 18px", textAlign: "left" }}
          >
            Door Properties
          </Typography>
          <img
            onClick={handleCloseClick}
            style={{ width: "28px", height: "28px" }}
            src={Close}
            alt=""
          />
        </div>
        <div className="input-container">
          <div className="height-input-container">
            <Typography className="height-text">Height</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder="inch"
              label="inch"
              variant="outlined"
              size="small"
              required={true}
              type="tel"
              value={height > 0 ? height.toFixed(2) : ""}
              disabled
            />
          </div>
          <div className="thickness-input-container">
            <Typography className="thickness-text">Width</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder="inch"
              label="inch"
              variant="outlined"
              size="small"
              required={true}
              type="tel"
              value={width > 0 ? width.toFixed(2) : ""}
              disabled
            />
          </div>

          {/* <div className="divider"></div> */}
          {selectionMode ? (
            <div
              className="btn-container"
              style={{ justifyContent: "flex-start" }}
            >
              <div className="btn" style={{ border: locked ? "2px solid cornflowerblue" : "" }} onClick={handleLockClick} >
                  <img src={Unlocked} alt="" />
                  <Typography className="contextual-btn-text">Lock</Typography>
                </div>
              <div className="btn" onClick={deleteSelectedLines}>
                <img src={Delete} alt="" />
                <Typography className="contextual-btn-text">Delete</Typography>
              </div>
            </div>
          ) :
          <div className="btn-container">
            <Typography modifiers={["helpText"]}>(Press esc to enter selection mode)</Typography>
          </div> 
          }
        </div>
      </div>
    </div>
  );
};

export default DoorPropertiesPopup;
