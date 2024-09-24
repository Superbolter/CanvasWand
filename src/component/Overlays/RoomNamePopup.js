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
  setHelpVideo,
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
import HowTo from "./HowTo.js";
import toast from "react-hot-toast";
import { resetShowFirstTimePopup } from "../../Actions/PopupAction.js";

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

const roomTypes = [{ order: 1, key: 'bedroom', value: 'Bedroom' }, { order: 8, key: 'balcony', value: 'Balcony' },
  { order: 4, key: 'dining', value: 'Dining' }, { order: 3, key: 'kitchen', value: 'Kitchen' }, { order: 9, key: 'utility', value: 'Utility' },
  { order: 2, key: 'livingroom', value: 'Living room' }, { order: 5, key: 'pooja', value: 'Pooja' },
  { order: 10, key: 'toilet', value: 'Toilet' }, { order: 2, key: 'living-dining', value: 'Living dining' },
  { order: 6, key: 'foyer', value: 'Foyer' }, { order: 8, key: 'dress', value: 'Dress' }, { order: 7, key: 'drawing', value: 'Drawing' },
  { order: 10, key: 'wash', value: 'Wash' }, { order: 10, key: 'hall', value: 'Hall' }, { order: 7, key: 'sitout', value: 'Sitout' },
  { order: 7, key: 'walkinwardrobe', value: 'Walk in wardrobe' },
  { order: 10, key: 'entrance', value: 'Entrance' }, { order: 10, key: 'stairs', value: 'Stairs' }, { order: 9, key: 'studyroom', value: 'Study Room' },
  { order: 9, key: 'powderroom', value: 'Powder Room' }, { order: 8, key: 'store', value: 'Store' }, { order: 10, key: 'lift', value: 'Lift' },
  { order: 8, key: 'maidroom', value: 'Maid room' }, { order: 7, key: 'restroom', value: 'Rest Room' }, { order: 10, key: 'dgroom', value: 'DG Room' },
  { order: 10, key: 'petroom', value: 'Pet room' }, { order: 8, key: 'commonarea', value: 'Common Area' },
  { order: 10, key: 'passagearea', value: 'Passage Area' }, { order: 10, key: 'gardenarea', value: 'Garden Area' }, { order: 10, key: 'parkingarea', value: 'Parking Area' }
  ]

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
  const { addRoom,deleteSelectedRoom } = useDrawing();
  const {showFirstTimePopup} = useSelector((state) => state.PopupState);

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
    if(activeRoomIndex === -1){
      toast.error("Please select a room to divide",
        {
          style: {
            color: "#000",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
            borderRadius: "8px",
            fontFamily: "'DM Sans', sans-serif",
          },
        }
      )
      return;
    } 
    if (activeRoomButton === "divide") {
      dispatch(setActiveRoomButton(""));
      dispatch(setTypeId(0));
      if (!selectionMode) {
        toggleSelectionMode();
      }
      dispatch(updateTemoraryPolygon([]))
      return;
    }
    dispatch(setEnablePolygonSelection(true))
    dispatch(setActiveRoomButton("divide"));
    dispatch(setRoomDetails(""));
    dispatch(setRoomName(""));
    dispatch(setRoomEditingMode(false));
    dispatch(setSelectedLinesState([]));
    dispatch(setExpandRoomNamePopup(false));
    dispatch(updateTemoraryPolygon([]))
  };

  const handleChange = (event) => {
    const selectedItem = roomTypes.find(
      (item) => item.key === event.target.value
    );
    dispatch(setRoomDetails(event.target.value));
    const length = roomSelectors.filter((room) =>
      room.roomName.includes(event.target.value)
    ).length;
    let name = selectedItem.value;
    if (length > 0) {
      name = name + " " + (length + 1);
      setName(name);
    } else {
      setName(name);
    }
    if(showFirstTimePopup){
      dispatch(resetShowFirstTimePopup())
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
      dispatch(setActiveRoomButton(""));
      dispatch(setEnablePolygonSelection(false))
      handleReset(false);
    } else {
      if (roomName.length === 0) {
        setError("Please enter room name");
      } else if (selectedRoomType?.length === 0) {
        setError("Please select room type");
      }
    }
  };

  const handleDeleteClick = () => {
    deleteSelectedRoom();
    setName("");
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
          <div className="room-popup-header-left">
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
            <HowTo type="divideRoom"/>
          </div>
          <div className="room-popup-header-left">
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
            <HowTo type="addRoom"/>
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
                  const selectedItem = roomTypes.find(
                    (item) => item.key === selectedRoomType
                  );
                  return selectedItem ? selectedItem.value : "Select room type";
                }}
              >
                {roomTypes.map((item) => (
                  <MenuItem
                    key={item.key}
                    value={item.key}
                    name={item.value}
                    selectedRoomType={selectedRoomType === item.key}
                    style={{
                      padding: "10px 8px 10px 12px",
                      borderRadius: "8px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor:
                        selectedRoomType === item.key ? "#4B73EC" : "",
                    }}
                  >
                    <Typography
                      modifiers={["medium", "black600", "body"]}
                      style={{
                        color: selectedRoomType === item.key ? "white" : "",
                      }}
                    >
                      {item.value}
                    </Typography>
                    {selectedRoomType === item.key && (
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
