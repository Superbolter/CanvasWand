import React, { useEffect, useRef, useState } from "react";
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import WallIcon from "../assets/WallIcon.svg";
import DoorIcon from "../assets/DoorIcon.svg";
import WindowIcon from "../assets/WindowIcon.svg";
import RailingIcon from "../assets/RailingIcon.svg";
import "./ContextualMenu.css";
import { Html } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import { setLockForLines, setTypeId } from "../Actions/DrawingActions.js";
import { setSelectedLinesState, updateLineTypeId } from "../Actions/ApplicationStateAction.js";
import split from "../assets/split.png";
import mergeIcon from "../assets/merge.png";
import Unlocked from "../assets/Unlocked.png";
import Delete from "../assets/Delete.png";
import { useDrawing } from "../hooks/useDrawing.js";

const ContextualMenu = (props) => {
  const dispatch = useDispatch();
  const { contextualMenuStatus, position, positionType, locked, typeId } = useSelector(
    (state) => state.Drawing
  );
  const { lineBreak, merge, measured } = useSelector((state) => state.drawing);
  
  const handleWallClick = (e) => {
    e.stopPropagation();
    dispatch(updateLineTypeId(1));
    dispatch(setTypeId(1));
    dispatch(setSelectedLinesState([]));
  };
  const handleDoorClick = (e) => {
    e.stopPropagation();
    dispatch(updateLineTypeId(2));
    dispatch(setTypeId(2));
    dispatch(setSelectedLinesState([]));
  };
  const handleWindowClick = (e) => {
    e.stopPropagation();
    dispatch(updateLineTypeId(3));
    dispatch(setTypeId(3));
    dispatch(setSelectedLinesState([]));
  };
  const handleRailingClick = (e) => {
    e.stopPropagation();
    dispatch(updateLineTypeId(4));
    dispatch(setTypeId(4));
    dispatch(setSelectedLinesState([]));
  };

  const handleMergeClick = () => {
    // setSelectedLines([]);
    props.handleMerge();
    props.setLineBreak(false);
    if (!props.selectionMode) {
      props.toggleSelectionMode();
    }
    props.setMerge(!merge);
  };

  const handleSplitClick = () => {
    props.setMerge(false);
    if (!lineBreak && props.selectionMode) {
      props.toggleSelectionMode();
    } else if (lineBreak && !props.selectionMode) {
      props.toggleSelectionMode();
    }
    props.setLineBreak(!lineBreak);
  };

  const handlDeleteClick = () => {
    if (!props.selectionMode) {
      props.toggleSelectionMode();
    } else {
      props.deleteSelectedLines();
    }
  };

  const handleLockClick = () => {
    dispatch(setLockForLines(!locked));
  };

  return (
    contextualMenuStatus && (
      <Html position={position} className="contextual-menu-component">
        <div className={positionType}/>
        <div className="contextual-menu-element-container">
        <div className="contextual-menu-element" onClick={handleWallClick}>
          <img src={WallIcon} alt="" />
          <Typography className="contextual-menu-text">Wall</Typography>
        </div>
        <div className="contextual-menu-element" onClick={handleDoorClick}>
          <img src={DoorIcon} alt="" />
          <Typography className="contextual-menu-text">Door</Typography>
        </div>
        <div className="contextual-menu-element" onClick={handleWindowClick}>
          <img src={WindowIcon} alt="" />
          <Typography className="contextual-menu-text">Window</Typography>
        </div>
        <div className="contextual-menu-element" onClick={handleRailingClick}>
          <img src={RailingIcon} alt="" />
          <Typography className="contextual-menu-text">Railing</Typography>
        </div>
        </div>
          {positionType !== "neutral" && (
            <div className="btn-container" style={{justifyContent: typeId === 1 ?"space-around" :"flex-start", width:"100%", marginLeft: typeId === 1 ? "0" : "10px"}}>
            {typeId===1 ?
            <div
              onClick={handleSplitClick}
              className="btn"
              style={{ border: lineBreak ? "2px solid cornflowerblue" : "" }}
            >
              <img src={split} alt="" />
              <Typography className="contextual-btn-text">Split</Typography>
            </div>:null}
            {typeId === 1?
            <div
              onClick={handleMergeClick}
              className="btn"
              style={{ border: merge ? "2px solid cornflowerblue" : "" }}
            >
              <img src={mergeIcon} alt="" />
              <Typography className="contextual-btn-text">Merge</Typography>
            </div>: null}
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
          )}
      </Html>
    )
  );
};

export default ContextualMenu;
