import React, { useEffect } from "react";
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import TextField from "@mui/material/TextField";
import split from "../assets/split.png";
import mergeIcon from "../assets/merge.png";
import Unlocked from "../assets/Unlocked.png";
import Delete from "../assets/Delete.png";
import "./WallPropertiesPopup.css";
import Close from "../assets/Close.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setContextualMenuStatus,
  setShowPopup,
  setTypeId,
} from "../Actions/DrawingActions.js";
import { useDrawing } from "../hooks/useDrawing.js";

const WallPropertiesPopup = ({
  selectionMode,
  deleteSelectedLines,
  toggleSelectionMode,
  setSelectedLines,
}) => {
  const { typeId, showPropertiesPopup } = useSelector((state) => state.Drawing);
  const dispatch = useDispatch();
  const handleCloseClick = () => {
    dispatch(setTypeId(1));
    dispatch(setShowPopup(false));
    dispatch(setContextualMenuStatus(false));
  };
  const { lineBreak, merge } = useSelector((state) => state.drawing);
  const { setLineBreak, setMerge, stop, setStop } = useDrawing();
  const { height, width } = useSelector((state) => state.ApplicationState);

  const handleMergeClick = () => {
    setSelectedLines([]);
    setMerge(!merge);
  };

  const handleSplitClick = () => {
    if (!lineBreak && selectionMode) {
      toggleSelectionMode();
    } else if (lineBreak && !selectionMode) {
      toggleSelectionMode();
    }
    setLineBreak(!lineBreak);
  };

  const handlDeleteClick = () => {
    if (!selectionMode) {
      toggleSelectionMode();
    } else {
      deleteSelectedLines();
    }
  };

  return (
    <div>
      <div
        className={
          (typeId === 1 && showPropertiesPopup) || lineBreak || merge
            ? "popup-container"
            : "popup-container-hidden"
        }
      >
        <div className="header-container">
          <Typography
            modifiers={["header6", "medium"]}
            style={{ fontSize: "16px", lineHeight: "18px", textAlign: "left" }}
          >
            Wall Properties
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
              value={height > 0 ? height : ""}
              disabled
            />
          </div>
          <div className="thickness-input-container">
            <Typography className="thickness-text">Thickness</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder="inch"
              label="inch"
              variant="outlined"
              size="small"
              required={true}
              type="tel"
              value={width > 0 ? width : ""}
              disabled
            />
          </div>
          <div className="divider"></div>
          {selectionMode || lineBreak || merge ? (
            <div className="btn-container">
              <div
                onClick={handleSplitClick}
                className="btn"
                style={{ border: lineBreak ? "2px solid cornflowerblue" : "" }}
              >
                <img src={split} alt="" />
                <Typography className="contextual-btn-text">Split</Typography>
              </div>
              <div
                onClick={handleMergeClick}
                className="btn"
                style={{ border: merge ? "2px solid cornflowerblue" : "" }}
              >
                <img src={mergeIcon} alt="" />
                <Typography className="contextual-btn-text">Merge</Typography>
              </div>
              {lineBreak || merge ? null : (
                <div className="btn">
                  <img src={Unlocked} alt="" />
                  <Typography className="contextual-btn-text">Lock</Typography>
                </div>
              )}
              {lineBreak || merge ? null : (
                <div className="btn" onClick={handlDeleteClick} >
                  <img src={Delete} alt=""/>
                  <Typography className="contextual-btn-text">
                    Delete
                  </Typography>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WallPropertiesPopup;
