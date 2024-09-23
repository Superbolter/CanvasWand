import React from "react";
import { Button } from "../../design_system/StyledComponents/components/Button";
import { useSelector } from "react-redux";
import { useActions } from "../../hooks/useActions";
import Undo from "../../assets/Undo.png";
import Redo from "../../assets/Redo.png";
import "./UndoRedoButton.css"
import { Typography } from "../../design_system/StyledComponents/components/Typography";

const UndoRedoButton = () => {
  const { designStep } = useSelector((state) => state.ApplicationState);
  const { undo, redo } = useActions();
  return designStep === 1 ? null : (
    <div className="undo-redo-btn-container">
      <Button
        modifiers={["white", "sm"]}
        className="undo-redo-btn"
        onClick={undo}
      >
        <img style={{ width: "24px", height: "24px" }} src={Undo} alt="" />
        <Typography>Undo</Typography>
      </Button>
      <Button
        modifiers={["white", "sm"]}
        className="undo-redo-btn"
        onClick={redo}
      >
        <img style={{ width: "24px", height: "24px" }} src={Redo} alt="" />
        <Typography>Redo</Typography>
      </Button>
    </div>
  );
};

export default UndoRedoButton;
