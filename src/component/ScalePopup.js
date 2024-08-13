import React, { useEffect, useState } from "react";
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import TextField from "@mui/material/TextField";
import "./WallPropertiesPopup.css";
import { useDispatch, useSelector } from "react-redux";
import { setUserLength, setUserWidth } from "../features/drawing/drwingSlice.js";
import { Button } from "../design_system/StyledComponents/components/Button.js";

const ScalePopup = (props) => {
  const dispatch = useDispatch();
  const { scale, userLength, userWidth } = useSelector((state) => state.drawing);
  const [error, setError] = useState(false);

  const handleContinueClick = () =>{
    if(userLength===0 || userWidth===0){
        setError(true);
        return;
    }
    props.handleDoubleClick();
  }

  useEffect(()=>{
    if(userLength>0 && error && userWidth>0){
        setError(false);
    }
  },[userLength])

  return (
    <div>
      <div className={scale? "popup-container": "popup-container-hidden"}>
        <div className="header-container">
          <Typography
            modifiers={["header6", "medium"]}
            style={{ fontSize: "16px", lineHeight: "18px", textAlign: "left" }}
          >
            Set scale for your floor plan
          </Typography>
        </div>
        <div className="input-container">
          <div className="height-input-container">
            <Typography className="height-text">Length</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder="inch"
              label="inch"
              variant="outlined"
              size="small"
              required={true}
              type="tel"
              value={userLength > 0 ? userLength : ""}
              onChange={(e)=> dispatch(setUserLength(e.target.value))}
            />
          </div>
          <div className="thickness-input-container">
            <Typography className="thickness-text">Thickness</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder="inch"
              label="inch"
              variant="outlined"
              size="small"
              required={true}
              type="tel"
              value={userWidth > 0 ? userWidth : ""}
              onChange={(e)=> dispatch(setUserWidth(e.target.value))}
            />
          </div>
          {error && <Typography modifiers={["warning300", "helpText"]}>Don't leave the feilds empty</Typography>}
          <div className="btn-container" style={{marginTop:"10px"}}>
            <Button onClick={handleContinueClick} className='save-btn' modifiers={["blue","block"]}>Save & continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScalePopup;
