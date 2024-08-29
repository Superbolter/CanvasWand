import React, { useEffect, useState } from "react";
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import split from "../assets/split.png";
import mergeIcon from "../assets/merge.png";
import Unlocked from "../assets/Unlocked.png";
import Delete from "../assets/Delete.png";
import "./WallPropertiesPopup.css";
import Close from "../assets/Close.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setContextualMenuStatus,
  setLockForLines,
  setShowPopup,
  setTypeId,
} from "../Actions/DrawingActions.js";
import { useDrawing } from "../hooks/useDrawing.js";
import Properties from "./Properties.js";

const WallPropertiesPopup = ({
  selectionMode,
  deleteSelectedLines,
  toggleSelectionMode,
  setSelectedLines,
  handleMerge,
}) => {
  const { typeId, showPropertiesPopup } = useSelector((state) => state.Drawing);
  const dispatch = useDispatch();
  const handleCloseClick = () => {
    dispatch(setTypeId(1));
    dispatch(setShowPopup(false));
    dispatch(setContextualMenuStatus(false));
    setLineBreak(false);
    setMerge(false);
  };
  const { lineBreak, merge, measured } = useSelector((state) => state.drawing);
  const { setLineBreak, setMerge, stop, setStop } = useDrawing();
  const { length, width, roomSelectorMode } = useSelector(
    (state) => state.ApplicationState
  );
  const { locked } = useSelector((state) => state.Drawing);

  const handleMergeClick = () => {
    // setSelectedLines([]);
    handleMerge();
    setLineBreak(false);
    if (!selectionMode) {
      toggleSelectionMode();
    }
    setMerge(!merge);
  };

  const handleSplitClick = () => {
    setMerge(false);
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

  const handleLockClick = () => {
    dispatch(setLockForLines(!locked));
  };

  return (
    <div>
      <div
        className={
          (typeId === 1 && showPropertiesPopup && !roomSelectorMode) ||
          (lineBreak && !roomSelectorMode) ||
          (merge && !roomSelectorMode)
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
          <Properties />
          {/* <div className="divider"></div> */}
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
                <div
                  className="btn"
                  style={{ border: locked ? "2px solid cornflowerblue" : "" }}
                  onClick={handleLockClick}
                >
                  <img src={Unlocked} alt="" />
                  <Typography className="contextual-btn-text">Lock</Typography>
                </div>
              )}
              {lineBreak || merge ? null : (
                <div className="btn" onClick={handlDeleteClick}>
                  <img src={Delete} alt="" />
                  <Typography className="contextual-btn-text">
                    Delete
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <div className="btn-container">
              <Typography modifiers={["helpText"]}>
                (Press esc to enter selection mode)
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallPropertiesPopup;
