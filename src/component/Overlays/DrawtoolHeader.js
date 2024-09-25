import React from "react";
import { Typography } from "../../design_system/StyledComponents/components/Typography.js";
import { Button } from "../../design_system/StyledComponents/components/Button";
import Undo from "../../assets/Undo.png";
import Redo from "../../assets/Redo.png";
import "./ButtonComponent.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch, useSelector } from "react-redux";
import {
  drawData,
  setDesignStep,
  showRoomNamePopup,
  updateDrawData,
} from "../../Actions/ApplicationStateAction.js";
import { ArrowBack, Check, WindowRounded } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { setSeeDimensions } from "../../Actions/DrawingActions.js";
import { useActions } from "../../hooks/useActions.js";
import { resetShowFirstTimePopup } from "../../Actions/PopupAction.js";

const MySwal = withReactContent(Swal);

const DrawtoolHeader = ({ }) => {
  const dispatch = useDispatch();
  const { designStep, img } = useSelector((state) => state.ApplicationState);
  const { seeDimensions } = useSelector((state) => state.Drawing);
  const { handleReset, handleResetRooms, handleSaveClick} = useActions();

  const handleBackToScale = () => {
    dispatch(resetShowFirstTimePopup());
    dispatch(setDesignStep(1));
    handleReset();
    window.GAEvent("DrawTool", "ButtonClicked", "BacktoScale");
  };

  const handleBackToDrawing = () => {
    MySwal.fire({
      title: "Are you sure you want to go back?",
      html: `
          <p>You will lose the changes you have made here.</p>
        `,
      confirmButtonText: "Go back",
      showCancelButton: true,
      showCloseButton: true, // Add close button (X) in top-right corner
      customClass: {
        title: "swal2-title-custom",
        htmlContainer: "swal2-html-custom",
        actions: "swal2-actions-custom",
        confirmButton: "swal2-confirm-button-custom",
        cancelButton: "swal2-cancel-button-custom",
      },
      width: "350px",
      padding: "24px", // Reduced padding for a compact look
      borderRadius: "12px", // Adjusted to match second image style
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(setDesignStep(2));
        dispatch(showRoomNamePopup(false));
        handleResetRooms();
        dispatch(resetShowFirstTimePopup());
      }
    });
    window.GAEvent("DrawTool", "ButtonClicked", "BackToDrawing");
  };

  const handleClick = () =>{
    handleSaveClick();
    window.GAEvent("DrawTool", "ButtonClicked", "Save",designStep);
  }

  const handleSeeDimensions = () => {
    dispatch(setSeeDimensions(!seeDimensions));
    window.GAEvent("DrawTool", "ButtonClicked", "SeeDimensions", !seeDimensions );
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          width: "calc(100vw - 330px)",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 4px 14px -3px #0C0C0D21",
          zIndex: "2",
          height: "30px",
        }}
      >
        <div className="header-step-indicator">
          {designStep> 1? 
            <div
                style={{
                  backgroundColor: "#F4F4F4",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  marginRight:"8px"
                }}
                onClick={designStep === 2? handleBackToScale: handleBackToDrawing}
              >
                <ArrowBack
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                    marginTop: "5px",
                  }}
                />
              </div>
            : null
          }
          {!img? null: 
          <div className="header-step-indicator-step">
            <div className={`header-step-indicator-step-box ${designStep< 1? "grayBorder" : ""}`}>
              {
                designStep > 1 ?
                <Check style={{fontSize:"16px"}}/>
                :
                <Typography modifiers={["medium", "subtitle2", "black600"]}>1</Typography>
              }
            </div>
            <Typography modifiers={["medium", "subtitle", "black600"]}>Set scale</Typography>
          </div>}
          {!img ?null:
          <div className={`header-step-indicator-line ${designStep > 1 ? "blackLine" : "grayLine"}`}></div>}
          <div className="header-step-indicator-step">
            <div className={`header-step-indicator-step-box ${designStep< 2? "grayBorder" : ""}`}>
              {
                designStep > 2 ?
                <Check style={{fontSize:"16px"}}/>
                :
                <Typography modifiers={designStep > 1? ["medium", "subtitle2", "black600"]: ["grey","medium", "subtitle"]}>{!img? 1: 2}</Typography>
              }
            </div>
            <Typography modifiers={designStep > 1? ["medium", "subtitle", "black600"]: ["grey","medium", "subtitle"]}>Draw plan</Typography>
          </div>
          <div className={`header-step-indicator-line ${designStep > 2 ? "blackLine" : "grayLine"}`}></div>
          <div className="header-step-indicator-step">
            <div className={`header-step-indicator-step-box ${designStep< 3? "grayBorder" : ""}`}>
              {
                designStep > 3 ?
                <Check style={{fontSize:"16px"}}/>
                :
                <Typography modifiers={designStep > 2? ["medium", "subtitle2", "black600"]: ["grey","medium", "subtitle"]}>{!img? 2: 3}</Typography>
              }
            </div>
            <Typography modifiers={designStep > 2? ["medium", "subtitle", "black600"]: ["grey","medium", "subtitle"]}>Define Rooms</Typography>
          </div>
          {/* <div className={`header-step-indicator-line ${designStep > 3 ? "blackLine" : "grayLine"}`}></div>
          <div className="header-step-indicator-step">
            <div className={`header-step-indicator-step-box ${designStep< 4? "grayBorder" : ""}`}>
              {
                designStep > 3 ?
                <Check style={{fontSize:"16px"}}/>
                :
                <Typography modifiers={designStep > 3? ["medium", "subtitle2", "black600"]: ["grey","medium", "subtitle"]}>{!img? 3: 4}</Typography>
              }
            </div>
            <Typography modifiers={designStep > 3? ["medium", "subtitle", "black600"]: ["grey","medium", "subtitle"]}>Open 3D</Typography>
          </div> */}
        </div>
        {designStep === 1 ? null : (
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              className="save-btn"
              modifiers={["blue"]}
              onClick={handleClick}
            >
              {designStep < 3? "Save & next": "Finish & generate 3D" }
            </Button>
          </div>
        )}
      </div>
      {designStep === 1 ? null : (
        <div className="dimension-setter">
          <Typography modifiers={["subtitle2"]}>Dimensions</Typography>
          <label class="switch">
            <input
              className="dimension-switch"
              type="checkbox"
              checked={seeDimensions}
              onChange={handleSeeDimensions}
            />
            <span class="slider round"></span>
          </label>
        </div>
      )}
    </>
  );
};

export default DrawtoolHeader;
