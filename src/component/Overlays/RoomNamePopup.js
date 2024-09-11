import React, { useEffect, useState } from "react";
import { Typography } from "../../design_system/StyledComponents/components/Typography.js";
import { Button } from "../../design_system/StyledComponents/components/Button";
import TextField from "@mui/material/TextField";
import "./PropertiesPopup.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setContextualMenuStatus,
  setEnablePolygonSelection,
  setTypeId,
  updateTemoraryPolygon,
} from "../../Actions/DrawingActions.js";
import {
  setActiveRoomButton,
  setActiveRoomIndex,
  setExpandRoomNamePopup,
  setRoomDetails,
  setRoomEditingMode,
  setRoomName,
  setSelectedLinesState,
  showRoomNamePopup,
} from "../../Actions/ApplicationStateAction.js";
import plus from "../../assets/plus.svg";
import divide from "../../assets/divide.svg";
import deleteIcon from "../../assets/Delete.png";
import { FormControl, MenuItem, Select, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import { setRoomSelectors } from "../../features/drawing/drwingSlice.js";
import edit from "../../assets/edit.svg";
import { Check } from "@mui/icons-material";
import useModes from "../../hooks/useModes.js";
import { useDrawing } from "../../hooks/useDrawing.js";

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

const RoomNamePopup = () => {
  const [error, setError] = useState("");
  const [roomName, setName] = useState("");
  const {
    roomPopup,
    expandRoomPopup,
    selectionMode,
    roomEditingMode,
    selectedRoomName,
    selectedRoomType,
    activeRoomButton,
    activeRoomIndex,
  } = useSelector((state) => state.ApplicationState);
  const dispatch = useDispatch();
  const { roomSelectors } = useSelector((state) => state.drawing);
  const { toggleSelectionMode } = useModes();
  const { addRoom } = useDrawing();

  useEffect(() => {
    if (selectedRoomName) {
      setName(selectedRoomName);
      setError(false);
    }
  }, [selectedRoomName]);

  const handleReset = (val) => {
    dispatch(setRoomDetails(""));
    dispatch(setRoomName(""));
    dispatch(setRoomEditingMode(false));
    dispatch(setActiveRoomIndex(-1));
    dispatch(setSelectedLinesState([]));
    dispatch(setExpandRoomNamePopup(val));
    dispatch(updateTemoraryPolygon([]))
  };

  const addRoomClick = () => {
    if (activeRoomButton === "add") {
      dispatch(setActiveRoomButton(""));
      setName("");
      handleReset(false);
      dispatch(setEnablePolygonSelection(false))
      dispatch(updateTemoraryPolygon([]))
      return;
    }
    dispatch(setActiveRoomButton("add"));
    dispatch(setEnablePolygonSelection(true))
    dispatch(setTypeId(0));
    if (!selectionMode) {
      toggleSelectionMode();
    }
    setName("");
    handleReset(true);
  };

  const divideRoomClick = () => {
    if (activeRoomButton === "divide") {
      dispatch(setActiveRoomButton(""));
      dispatch(setTypeId(0));
      if (!selectionMode) {
        toggleSelectionMode();
      }
      return;
    }
    dispatch(setEnablePolygonSelection(false))
    dispatch(setActiveRoomButton("divide"));
    dispatch(setTypeId(5));
    if (selectionMode) {
      toggleSelectionMode();
    }
    handleReset(false);
  };

  const handleChange = (event) => {
    dispatch(setRoomDetails(event.target.value));
    const length = roomSelectors.filter((room) =>
      room.roomName.includes(event.target.value)
    ).length;
    let name = event.target.value;
    if (length > 0) {
      name = event.target.value + " " + (length + 1);
      setName(name);
    } else {
      setName(name);
    }
    if (roomEditingMode) {
      if (name.length === 0) {
        setError("Please enter room name");
      } else if (event.target.value.length === 0) {
        setError("Please select room type");
      } else {
        const newRooms = [...roomSelectors];
        newRooms[activeRoomIndex] = {
          ...newRooms[activeRoomIndex],
          roomName: name,
          roomType: event.target.value,
        };
        dispatch(setRoomSelectors(newRooms));
      }
    }
  };

  const handleSaveClick = () => {
    if (roomName.length > 0 && selectedRoomType?.length > 0) {
      addRoom(roomName, selectedRoomType);
      setName("");
      dispatch(setRoomDetails(""));
      dispatch(setRoomName(""));
    } else {
      if (roomName.length === 0) {
        setError("Please enter room name");
      } else if (selectedRoomType?.length === 0) {
        setError("Please select room type");
      }
    }
  };

  const handleDeleteClick = () => {
    const newRooms = [...roomSelectors];
    newRooms.splice(activeRoomIndex, 1);
    setName("");
    dispatch(setRoomSelectors(newRooms));
    dispatch(setActiveRoomButton(""));
    handleReset(false);
    dispatch(setEnablePolygonSelection(false))
  };

  useEffect(() => {
    if (
      selectedRoomName?.length > 0 &&
      selectedRoomType &&
      selectedRoomType?.length > 0
    ) {
      setError("");
    }
  }, [selectedRoomName, selectedRoomType]);

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
              activeRoomButton === "divide"
                ? { borderColor: "cornflowerblue" }
                : {}
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
              activeRoomButton === "add"
                ? { borderColor: "cornflowerblue" }
                : {}
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
              {roomEditingMode && (
                <div className="delete-container" onClick={handleDeleteClick}>
                  <img
                    src={deleteIcon}
                    alt="delete"
                    style={{ height: "20px", width: "20px" }}
                  />
                  <Typography modifiers={["medium", "black550", "helpText"]}>
                    Delete
                  </Typography>
                </div>
              )}
            </div>
            <FormControl fullWidth>
              <Select
                value={selectedRoomType}
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
                      padding: "4px",
                    },
                  },
                }}
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(selectedRoomType) => {
                  if (selectedRoomType === "" || selectedRoomType === null) {
                    return (
                      <Typography modifiers={["subtitle", "black600"]}>
                        Select room type
                      </Typography>
                    );
                  }
                  return selectedRoomType;
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
                  "Utility",
                  "Pooja",
                  "Foyer",
                  "Dress",
                  "Drawing",
                  "Wash",
                  "Walk in wardrobe",
                  "Entrance",
                  "Study Room",
                  "Powder Room",
                  "Store",
                  "Lift",
                  "Maid room",
                  "Rest Room",
                  "DG Room",
                  "Pet room",
                  "Common Area",
                  "Passage Area",
                  "Garden Area",
                  "Parking Area",
                ].map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    selectedRoomType={selectedRoomType === name}
                    style={{
                      padding: "10px 8px 10px 12px",
                      borderRadius: "8px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor:
                        selectedRoomType === name ? "#4B73EC" : "",
                    }}
                  >
                    <Typography
                      modifiers={["medium", "black600", "body"]}
                      style={{
                        color: selectedRoomType === name ? "white" : "",
                      }}
                    >
                      {name}
                    </Typography>
                    {selectedRoomType === name && (
                      <CheckIcon sx={{ color: "white" }} />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div
              className="room-popup-header"
              style={{ height: "fit-content", marginBottom: "0px" }}
            >
              <TextField
                style={{ width: "100%", height: "54px" }}
                id="outlined-required"
                variant="outlined"
                placeholder="Enter room name"
                required={true}
                value={roomName}
                onChange={(e) => {
                  setName(e.target.value);
                  if (roomEditingMode) {
                    if (e.target.value.length === 0) {
                      setError("Please enter room name");
                    } else if (selectedRoomType?.length === 0) {
                      setError("Please select room type");
                    } else {
                      const newRooms = [...roomSelectors];
                      newRooms[activeRoomIndex] = {
                        ...newRooms[activeRoomIndex],
                        roomName: e.target.value,
                        roomType: selectedRoomType,
                      };
                      dispatch(setRoomSelectors(newRooms));
                    }
                  }
                }}
                InputProps={{
                  style: {
                    fontSize: "16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: "400",
                    height: "54px",
                    borderRadius: "8px",
                  },
                }}
              />
            </div>
            {error.length > 0 && (
              <Typography modifiers={["medium", "warning300", "helpText"]}>
                {error}
              </Typography>
            )}
            <div className="btn-container">
              {roomEditingMode ? null : (
                <Button
                  className="save-btn"
                  modifiers={["blue", "block"]}
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomNamePopup;
