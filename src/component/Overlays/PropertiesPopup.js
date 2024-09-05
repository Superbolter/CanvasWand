import React from "react";
import { Typography } from "../../design_system/StyledComponents/components/Typography.js";
import split from "../../assets/split.png";
import mergeIcon from "../../assets/merge.png";
import Unlocked from "../../assets/Unlocked.png";
import Delete from "../../assets/Delete.png";
import "./PropertiesPopup.css";
import Close from "../../assets/Close.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setContextualMenuStatus,
  setLockForLines,
  setShowPopup,
  setTypeId,
} from "../../Actions/DrawingActions.js";
import Properties from "./Properties.js";
import { setLineBreakState, setMergeState } from "../../features/drawing/drwingSlice.js";
import useModes from "../../hooks/useModes.js";
import { useDrawing } from "../../hooks/useDrawing.js";

const PropertiesPopup = ({}) => {
  const dispatch = useDispatch()
  const { lineBreak, merge } = useSelector((state) => state.drawing);
  const { roomSelectorMode, selectionMode } = useSelector((state) => state.ApplicationState);
  const { locked,typeId, showPropertiesPopup  } = useSelector((state) => state.Drawing);
  const { toggleSelectionSplitMode } = useModes();
  const {deleteSelectedLines, handleMergeClick} = useDrawing();

  const handleCloseClick = () => {
    dispatch(setTypeId(1));
    dispatch(setShowPopup(false));
    dispatch(setContextualMenuStatus(false));
    dispatch(setLineBreakState(false));
    dispatch(setMergeState(false));
  };

  const handleMerge = () => {
    handleMergeClick();
    dispatch(setLineBreakState(false));
    if (!selectionMode) {
      toggleSelectionSplitMode();
    }
    dispatch(setMergeState(!merge));
  };

  const handleSplitClick = () => {
    dispatch(setMergeState(false));
    if (!lineBreak && selectionMode) {
      toggleSelectionSplitMode();
    } else if (lineBreak && !selectionMode) {
      toggleSelectionSplitMode();
    }
    dispatch(setLineBreakState(!lineBreak));
  };

  const handlDeleteClick = () => {
    if (!selectionMode) {
      toggleSelectionSplitMode();
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
          (showPropertiesPopup && !roomSelectorMode) ||
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
            {typeId === 1
              ? "Wall Properties"
              : typeId === 2
              ? "Door Properties"
              : typeId === 3
              ? "Window Properties"
              : typeId === 4
              ? "Railing Properties"
              : "Properties"}
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
          {selectionMode || lineBreak || merge ? (
            <div className="btn-container">
              {typeId === 1 && (
                <div
                  onClick={handleSplitClick}
                  className="btn"
                  style={{
                    border: lineBreak ? "2px solid cornflowerblue" : "",
                  }}
                >
                  <img src={split} alt="" />
                  <Typography className="contextual-btn-text">Split</Typography>
                </div>
              )}
              {typeId === 1 && (
                <div
                  onClick={handleMerge}
                  className="btn"
                  style={{ border: merge ? "2px solid cornflowerblue" : "" }}
                >
                  <img src={mergeIcon} alt="" />
                  <Typography className="contextual-btn-text">Merge</Typography>
                </div>
              )}

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

export default PropertiesPopup;
