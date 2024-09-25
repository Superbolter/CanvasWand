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

  const handleUndo = () => {
    if (designStep === 1) {
      return;
    }
    undo();
    window.GAEvent("DrawTool", "ButtonClicked", "Undo");
  };

  const handleRedo = () => {
    if (designStep === 1) {
      return;
    }
    redo();
    window.GAEvent("DrawTool", "ButtonClicked", "Redo");
  };
  return designStep === 1 ? null : (
    <div className="undo-redo-btn-container">
      <Button
        modifiers={["white", "sm"]}
        className="undo-redo-btn"
        onClick={handleUndo}
      >
        <img style={{ width: "24px", height: "24px" }} src={Undo} alt="" />
        <Typography>Undo</Typography>
      </Button>
      <Button
        modifiers={["white", "sm"]}
        className="undo-redo-btn"
        onClick={handleRedo}
      >
        <img style={{ width: "24px", height: "24px" }} src={Redo} alt="" />
        <Typography>Redo</Typography>
      </Button>
    </div>
  );
};

export default UndoRedoButton;
