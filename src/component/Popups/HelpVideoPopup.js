import React, { useEffect, useMemo, useState } from "react";
import "./HelpVideoPopup.css";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "../../design_system/StyledComponents/components/Typography";
import useResources from "../../hooks/useResources";
import ReactPlayer from "react-player/lazy";
import { setHelpVideo } from "../../Actions/ApplicationStateAction";
import { Button } from "../../design_system/StyledComponents/components/Button";
import { Close } from "@mui/icons-material";

const videoData = {
  addRoom: {
    title: "How to add a room",
    subtitle: "to understand how adding a room works, watch this video",
    videoUrl: "/videos/drawTool/addRoom.mov",
  },
  divideRoom: {
    title: "How to divide a room",
    subtitle: "to understand how dividing a room works, watch this video",
    videoUrl: "/videos/drawTool/divideRoom.mov",
  },
  setScale: {
    title: "How to set scale",
    subtitle: "to understand how setting scale works, watch this video",
    videoUrl: "/videos/drawTool/setScale.mov",
  },
  addWall: {
    title: "How to add a wall",
    subtitle: "to understand how adding a wall works, watch this video",
    videoUrl: "/videos/drawTool/addWall.mov",
  },
  defineRoom: {
    title: "How to define a room",
    subtitle: "to understand how to define a room, watch this video",
    videoUrl: "/videos/drawTool/defineRoom.mov",
  }
};

const HelpVideoPopup = () => {
  const { helpVideo, helpVideoType } = useSelector(
    (state) => state.ApplicationState
  );
  const dispatch = useDispatch();
  const { getRomeCdnUrl } = useResources();

  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    setSlideIn(!!helpVideo);
  }, [helpVideo]);

  const videoPlayer = useMemo(() => {
    if (!helpVideo || !helpVideoType) return null;

    return (
      <ReactPlayer
        playsinline
        playing={true}
        controls
        loop
        muted
        pip
        className="help-popup-video"
        url={getRomeCdnUrl() + videoData[helpVideoType].videoUrl}
      />
    );
  }, [helpVideoType]); // Add all necessary dependencies here

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(() => {
      dispatch(setHelpVideo(false));
    }, 600)
    window.GAEvent("DrawTool", "ButtonClicked", "CloseHelpVideo", helpVideoType);
  };

  if (!helpVideo || !helpVideoType) return null;

  return (
    <div className="help-popup-wrapper" onClick={handleClose}>
      <div
        className={
          slideIn ? "help-popup-container" : "help-popup-container-hidden"
        }
      >
        <div className="help-popup-close-icon" onClick={handleClose}>
          <Close/>
        </div>
        {videoPlayer}
        <Typography modifiers={["black600", "body", "bold"]}>
          {videoData[helpVideoType].title}
        </Typography>
        <Typography modifiers={["subtitle2", "medium"]} style={{ color: "#6E757A" }}>
          {videoData[helpVideoType].subtitle}
        </Typography>
        <div className="help-popup-button-wrapper">
          <Button onClick={handleClose} modifiers={["black"]}>Okay</Button>
        </div>
      </div>
    </div>
  );
};

export default HelpVideoPopup;