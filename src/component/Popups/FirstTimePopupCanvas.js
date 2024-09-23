import { Html } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "../../design_system/StyledComponents/components/Typography";
import "./FirstTimePopup.css";
import { setShowFirstTimePopup } from "../../Actions/PopupAction";
import { popupData } from "./PopupData";
import { Button } from "../../design_system/StyledComponents/components/Button";
import { Close } from "@mui/icons-material";

const FirstTimePopupCanvas = () => {
  const { showFirstTimePopup, customisedPosition, firstTimePopupNumber, popupDismissable } =
    useSelector((state) => state.PopupState);
  const [fadeIn, setFadeIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(11); // 10 seconds countdown
  const [progress, setProgress] = useState(0);
  const [showClose, setSetShowClose] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showFirstTimePopup) {
      setFadeIn(true);
    }
  }, [showFirstTimePopup, firstTimePopupNumber]);

  useEffect(()=>{
    if(fadeIn){
      setTimeLeft(11);
      setProgress(0);
      setSetShowClose(false);
    }
  },[firstTimePopupNumber])

  useEffect(() => {
    if (timeLeft === 0 && fadeIn && popupDismissable) {
      setSetShowClose(true);
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setProgress((prev) => prev + 10);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleClose = () =>{
    dispatch(setShowFirstTimePopup({
      showFirstTimePopup: false,
      firstTimePopupType: "",
      customisedPosition: null,
      popupDismissable: false
    }))
  }

  const handleClick1 = () => {
    setFadeIn(false);
    switch(popupData[firstTimePopupNumber]?.buttonType){
      case "Move":
        let type = "canvas";
        if(firstTimePopupNumber === 1){
          type = "ui"
        }
        dispatch(setShowFirstTimePopup({
          showFirstTimePopup: true,
          firstTimePopupType: type,
          firstTimePopupNumber: firstTimePopupNumber + 1,
          popupDismissable: true
        }))
      break;
      case "Okay":
        handleClose();
      break;
      case "Navigate":
        dispatch(setShowFirstTimePopup({
          showFirstTimePopup: true,
          firstTimePopupType: "ui",
          firstTimePopupNumber: firstTimePopupNumber + 1,
          popupDismissable: true
        }))
      break;
      default:
      break;
    }
  }

  const handleClick2 = () => {
    setFadeIn(false);
    if(firstTimePopupNumber === 7){
      dispatch(setShowFirstTimePopup({
        showFirstTimePopup: true,
        firstTimePopupType: "canvas",
        firstTimePopupNumber: firstTimePopupNumber + 2,
        popupDismissable: true
      }))
    }else{
      handleClose();
    }
  }

  if (firstTimePopupNumber < 0) return null;

  return fadeIn ? (
    <Html position={popupData[firstTimePopupNumber].position === "customised"? customisedPosition :popupData[firstTimePopupNumber].position}>
      <div className="first-time-popup">
        <div className="first-time-popup-container">
        {showClose && (
          <div className="first-time-popup-close">
            <Close
              style={{ cursor: "pointer", color: "white" }}
              onClick={handleClose}
            />
          </div>
        )}
          <div className="first-time-popup-header">
            <Typography modifiers={["header6", "medium"]}>
              {popupData[firstTimePopupNumber].title}
            </Typography>
          </div>
          <div className="first-time-popup-body">
            <Typography modifiers={["subtitle2"]}>
              {popupData[firstTimePopupNumber]?.description ? popupData[firstTimePopupNumber].description : null}
            </Typography>
          </div>
          <div className="first-time-popup-footer">
            <div className="first-time-popup-footer-button">
            {popupData[firstTimePopupNumber]?.buttonText1 ? (
              <Button
                className="first-time-popup-button"
                modifiers={["white", "small"]}
                onClick={handleClick1}
              >
                <Typography modifiers={["subtitle2","medium"]}>{popupData[firstTimePopupNumber].buttonText1}</Typography>
              </Button>
            ) : null}
            {popupData[firstTimePopupNumber]?.buttonText2 ? (
              <Button
                className="first-time-popup-button"
                modifiers={["white", "small"]}
                onClick={handleClick2}
              >
                <Typography modifiers={["subtitle2","medium"]}>{popupData[firstTimePopupNumber].buttonText2}</Typography>
              </Button>
            ) : null}
            </div>
            <div className="first-time-popup-footer-order">
              {popupData[firstTimePopupNumber]?.order ? (
              <Typography modifiers={["subtitle2", "white"]}>{popupData[firstTimePopupNumber]?.order}</Typography>
            ) : null}
            </div>
          </div>
          {!showClose && popupDismissable && <div className="timer-container">
            <div className="timer-progress" style={{ width: `${progress}%` }} />
          </div>}
        </div>
      </div>
    </Html>
  ) : null;
};

export default FirstTimePopupCanvas;
