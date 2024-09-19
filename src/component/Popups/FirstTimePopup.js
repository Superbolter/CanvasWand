import { Html } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Vector3 } from "three";
import { Typography } from "../../design_system/StyledComponents/components/Typography";
import "./FirstTimePopup.css";
import { setShowFirstTimePopup } from "../../Actions/PopupAction";

const FirstTimePopup = () => {
  const { showFirstTimePopup, firstTimePopupType, firstTimePopupName } =
    useSelector((state) => state.PopupState);
  const [fadeIn, setFadeIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(11); // 10 seconds countdown
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const popupData = {
    scalePopup: {
      position: new Vector3(25, 25, 0),
      title: "Set the scale",
      description:
        "Set the scale by choosing a wall, then drag the ruler along its length. Enter the wall's actual length to calibrate the scale.",
    },
    selectWallPopup: {
      position: new Vector3(0, 0, 0),
      className: "selectWallPopup",
      title: "Lets start drawing",
      description: "Select the 'Wall' option from the right panel to begin.",
    },
    drawWallPopup: {
      position: new Vector3(0, 225, 0),
      title: "Lets start drawing",
      description: "Click where the wall starts to set the first point.",
    },
    contexttualMenuPopup: {
      position: new Vector3(-1.5, 0.5, 0),
      title: "Draw windows, doors and railings",
      description:
        "You can convert this line to a window, door, or railing by selecting an option from the menu.",
    },
    scalableDoorPopup: {
      position: new Vector3(-1.5, 0.5, 0),
      title: "How sliding doors work",
      description: "Large doors will automatically convert to sliding doors.",
    },
  };

  useEffect(() => {
    if (showFirstTimePopup) {
      setFadeIn(true);
    }
  }, [showFirstTimePopup]);

  useEffect(() => {
    if (timeLeft === 0 && fadeIn) {
      setFadeIn(false);
      setTimeout(() => {
        dispatch(setShowFirstTimePopup(false));
      }, 1000);
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setProgress((prev) => prev + 10);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  if (!firstTimePopupName) return null;
  return firstTimePopupType === "canvas" ? (
    fadeIn ? (
      <Html position={popupData[firstTimePopupName].position}>
        <div className="first-time-popup">
          <div className="first-time-popup-container">
            <div className="first-time-popup-header">
              <Typography modifiers={["header6", "medium"]}>
                {popupData[firstTimePopupName].title}
              </Typography>
            </div>
            <div className="first-time-popup-body">
              <Typography modifiers={["subtitle2"]}>
                {popupData[firstTimePopupName].description}
              </Typography>
            </div>
            <div className="timer-container">
              <div
                className="timer-progress"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Html>
    ) : null
  ) : fadeIn ? (
    <Html position={popupData[firstTimePopupName].position}>
      <div className="first-time-popup-ui">
        <div className={`${popupData[firstTimePopupName].className}`}>
        <div className="first-time-popup-container">
          <div className="first-time-popup-header">
            <Typography modifiers={["header6", "medium"]}>
              {popupData[firstTimePopupName].title}
            </Typography>
          </div>
          <div className="first-time-popup-body">
            <Typography modifiers={["subtitle2"]}>
              {popupData[firstTimePopupName].description}
            </Typography>
          </div>
          <div className="timer-container">
            <div className="timer-progress" style={{ width: `${progress}%` }} />
          </div>
        </div>
        </div>
      </div>
    </Html>
  ) : null;
};

export default FirstTimePopup;
