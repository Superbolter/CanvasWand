import React, { useEffect, useState } from "react";
import { Typography } from "../design_system/StyledComponents/components/Typography.js";
import { Button } from "../design_system/StyledComponents/components/Button";
import TextField from "@mui/material/TextField";
import "./WallPropertiesPopup.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setContextualMenuStatus,
  setTypeId,
} from "../Actions/DrawingActions.js";
import {
  setExpandRoomNamePopup,
  showRoomNamePopup,
} from "../Actions/ApplicationStateAction.js";
import { useDrawing } from "../hooks/useDrawing.js";
import plus from "../assets/plus.svg";
import divide from "../assets/divide.svg";
import deleteIcon from "../assets/Delete.png";
import {
  FormControl,
  MenuItem,
  Select,
  InputBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 8,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: "'DM Sans', sans-serif",
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const RoomNamePopup = (props) => {
  const [roomName, setRoomName] = useState("");
  const [activeMode, setActiveMode] = useState("");
  const [selected, setSelected] = useState("");
  const { roomPopup, expandRoomPopup, selectionMode } = useSelector(
    (state) => state.ApplicationState
  );
  const dispatch = useDispatch();
  const { room, selectedLines } = useDrawing();

  const addRoomClick = () => {
    setActiveMode("add");
    dispatch(setExpandRoomNamePopup(true));
  };

  const divideRoomClick = () => {
    if (activeMode === "divide") {
      setActiveMode("");
      dispatch(setTypeId(1));
      if (!selectionMode) {
        props.toggleSelectionMode();
      }
      return;
    }
    setActiveMode("divide");
    dispatch(setExpandRoomNamePopup(false));
    dispatch(setTypeId(5));
    if (selectionMode) {
      props.toggleSelectionMode();
    }
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleSaveClick = () => {
    if(roomName.length>0 && selected.length>0){
      props.addRoom(roomName, selected);
      // setActiveMode("");
      setSelected("");
      setRoomName("");
    }
  };

  return (
    <div>
      <div
        className={roomPopup ? "popup-container" : "popup-container-hidden"}
        style={{ height: "fit-content" }}
      >
        <div className="room-popup-header">
          <div
            onClick={divideRoomClick}
            className="room-popup-header-text"
            style={
              activeMode === "divide" ? { borderColor: "cornflowerblue" } : {}
            }
          >
            <img src={divide} alt="divider" />
            <Typography modifiers={["black600", "subtitle2"]}>
              Divide room
            </Typography>
          </div>
          <div
            onClick={addRoomClick}
            className="room-popup-header-text"
            style={
              activeMode === "add" ? { borderColor: "cornflowerblue" } : {}
            }
          >
            <img src={plus} alt="plus" />
            <Typography modifiers={["black600", "subtitle2"]}>
              Add room
            </Typography>
          </div>
        </div>
        {expandRoomPopup && (
          <div className="input-container" style={{ height: "fit-content" }}>
            <div className="room-popup-header" style={{ marginBottom: "0px" }}>
              <Typography modifiers={["medium", "black600", "subtitle"]}>
                Room
              </Typography>
              <div className="delete-container">
                <img
                  src={deleteIcon}
                  alt="delete"
                  style={{ height: "20px", width: "20px" }}
                />
                <Typography modifiers={["medium", "black550", "helpText"]}>
                  Delete
                </Typography>
              </div>
            </div>
            <FormControl fullWidth>
              <Select
                value={selected}
                onChange={handleChange}
                displayEmpty
                input={<BootstrapInput />}
                MenuProps={{
                  PaperProps: {
                    style: {
                      borderRadius: "12px",
                    },
                  },
                  MenuListProps: {
                    sx: {
                      padding: '4px',
                    },
                  },
                }}
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography modifiers={["subtitle", "black600"]}>Select room type</Typography>; 
                  }
                  return selected;
                }}
              >
                {[
                  "Living Room",
                  "Bedroom",
                  "Kitchen",
                  "Dining Room",
                  "Balcony",
                  "Kids Room",
                  "Toilet",
                  "Study Room",
                ].map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    selected={selected === name}
                    style={{
                      padding: "10px 8px 10px 12px",
                      borderRadius: "8px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor:
                        selected === name ? "#4B73EC" : "",
                    }}
                  >
                    <Typography modifiers={["medium", "black600", "body"]} style={{ color: selected === name? "white": "" }}>
                      {name}
                    </Typography>
                    {selected === name && (
                      <CheckIcon sx={{ color: "white" }} />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              style={{ width: "100%", height: "34px" }}
              id="outlined-required"
              variant="outlined"
              placeholder="Enter room name"
              required={true}
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
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
            <div className="btn-container">
              <Button
                className="save-btn"
                modifiers={["blue", "block"]}
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomNamePopup;
