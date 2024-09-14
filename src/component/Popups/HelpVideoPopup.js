import React, { useEffect, useMemo, useState } from "react";
import "./HelpVideoPopup.css";
import { useSelector } from "react-redux";
import { Typography } from "../../design_system/StyledComponents/components/Typography";
import useResources from "../../hooks/useResources";
import ReactPlayer from "react-player/lazy";

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
};

const HelpVideoPopup = () => {
  const { helpVideo, helpVideoType } = useSelector(
    (state) => state.ApplicationState
  );
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
        width="350px"
        height="200px"
        className="help-popup-video"
        url={getRomeCdnUrl() + videoData[helpVideoType].videoUrl}
      />
    );
  }, [helpVideoType]); // Add all necessary dependencies here

  if (!helpVideo || !helpVideoType) return null;

  return (
    <div>
      <div
        className={
          slideIn ? "help-popup-container" : "help-popup-container-hidden"
        }
      >
        {videoPlayer}
        <Typography modifiers={["black600", "body", "medium"]}>
          {videoData[helpVideoType].title}
        </Typography>
        <Typography modifiers={["subtitle2"]} style={{ color: "#6E757A" }}>
          {videoData[helpVideoType].subtitle}
        </Typography>
      </div>
    </div>
  );
};

export default HelpVideoPopup;