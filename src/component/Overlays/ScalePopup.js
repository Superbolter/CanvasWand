import React, { useEffect, useState } from "react";
import { Typography } from "../../design_system/StyledComponents/components/Typography.js";
import TextField from "@mui/material/TextField";
import "./PropertiesPopup.css";
import { useDispatch, useSelector } from "react-redux";
import { setUserLength, setUserWidth } from "../../features/drawing/drwingSlice.js";
import { Button } from "../../design_system/StyledComponents/components/Button.js";
import LengthConverter from "./LengthConverter.js";
import { useActions } from "../../hooks/useActions.js";

const ScalePopup = () => {
  const dispatch = useDispatch();
  const { userLength, userWidth, measured } = useSelector((state) => state.drawing);
  const { designStep } = useSelector((state) => state.ApplicationState)
  const [error, setError] = useState(false);
  const {handleDoubleClick} = useActions();

  const handleContinueClick = () =>{
    if(userLength===0 || userWidth===0 || userLength===undefined || userWidth===undefined || userLength==="" || userWidth===""){
        setError(true);
        return;
    }
    handleDoubleClick();
  }

  useEffect(()=>{
    if(userLength>0 && error && userWidth>0){
        setError(false);
    }
  },[userLength])

  return (
    <div>
      <div className={designStep === 1 ? "scale-popup-container": "scale-popup-container-hidden"}>
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
              placeholder={measured}
              label={measured}
              variant="outlined"
              size="small"
              required={true}
              value={userLength !== ""  ? userLength : ""}
              onChange={(e)=> dispatch(setUserLength(e.target.value))}
              InputProps={{
                style: {
                  fontSize: "16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "400",
                  height: "44px",
                  borderRadius: "8px",
                },
              }}
            />
          </div>
          <div className="thickness-input-container">
            <Typography className="thickness-text">Thickness</Typography>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              placeholder={measured}
              label={measured}
              variant="outlined"
              size="small"
              required={true}
              value={userWidth !=="" ? userWidth : ""}
              onChange={(e)=> dispatch(setUserWidth(e.target.value))}
              InputProps={{
                style: {
                  fontSize: "16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: "400",
                  height: "44px",
                  borderRadius: "8px",
                },
              }}
            />
          </div>
          <LengthConverter/>
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
