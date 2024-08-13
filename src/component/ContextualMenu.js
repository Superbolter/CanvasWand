import React from "react";
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import WallIcon from "../assets/WallIcon.svg";
import DoorIcon from "../assets/DoorIcon.svg";
import WindowIcon from "../assets/WindowIcon.svg";
import RailingIcon from "../assets/RailingIcon.svg";
import "./ContextualMenu.css";
import { useDispatch, useSelector } from "react-redux";
import { setTypeId } from "../Actions/DrawingActions.js";
import { setSelectedLinesState, updateLineTypeId } from "../Actions/ApplicationStateAction.js";
const ContextualMenu = () => {
  const dispatch = useDispatch();
  
  const handleWallClick = () => {
    dispatch(updateLineTypeId(1));
    dispatch(setTypeId(1));
    dispatch(setSelectedLinesState([]));
  };
  const handleDoorClick = () => {
    dispatch(updateLineTypeId(2));
    dispatch(setTypeId(2));
    dispatch(setSelectedLinesState([]));
  };
  const handleWindowClick = () => {
    dispatch(updateLineTypeId(3));
    dispatch(setTypeId(3));
    dispatch(setSelectedLinesState([]));
  };
  const handleRailingClick = () => {
    dispatch(updateLineTypeId(4));
    dispatch(setTypeId(4));
    dispatch(setSelectedLinesState([]));
  };

  return (
    <div className="contextual-menu-component">
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
  );
};

export default ContextualMenu;
