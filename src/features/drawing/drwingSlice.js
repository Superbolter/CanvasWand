// drawingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { Vector3 } from "three";

const initialState = {
  points: [],
  storeLines: [],
  roomSelect: false,
  roomSelectors: [],
  perpendicularLine: true,
  factor: [1, 1, 1],
  measured: "in",
  information: false,
  scale:true,
  idSelection: [],
  widthChangeType: "between",
  type:"wall",
  selectedButton: null,
  leftPos: new Vector3(-50, 0, 0),
  rightPos: new Vector3(50, 0, 0),
  userLength: 0,
  userWidth: 0,
  userHeight: 0,
  lineBreak: false,
  merge: false
};

export const drawingSlice = createSlice({
  name: "drawing",
  initialState,
  reducers: {
    setPoints: (state, action) => {
      state.points = action.payload;
    },
    setStoreLines: (state, action) => {
      state.storeLines = action.payload;
    },
    setScale: (state, action) => {
      state.scale = action.payload;
    },

    setRoomSelectors: (state, action) => {
      state.roomSelectors = action.payload;
    },
    setIdSelection: (state, action) => {
      state.idSelection = action.payload;
    },
    setPerpendicularLine: (state, action) => {
      state.perpendicularLine = action.payload;
    },
    setRoomSelect: (state, action) => {
      state.roomSelect = action.payload;
    },
    setFactor: (state, action) => {
      state.factor = action.payload;
    },
    setMeasured: (state, action) => {
      state.measured = action.payload;
    },
    setInformation: (state, action) => {
      state.information = action.payload;
    },
    setWidthChangeType: (state, action) => {
      state.widthChangeType = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setSelectedButton: (state,action) => {
      state.selectedButton = action.payload
    },
    setLeftPosState: (state,action) => {
      state.leftPos = action.payload
    },
    setRightPosState: (state,action) => {
      state.rightPos = action.payload
    },
    setUserLength: (state,action) => {
      state.userLength = action.payload
    },
    setUserWidth: (state,action) => {
      state.userWidth = action.payload
    },
    setUserHeight: (state,action) => {
      state.userHeight = action.payload
    },
    setLineBreakState: (state,action) => {
      state.lineBreak = action.payload
    },
    setMergeState: (state,action) => {
      state.merge = action.payload
    }
  },
});

export const {
  setPoints,
  setStoreLines,
  setIdSelection,
  setPerpendicularLine,
  setFactor,
  setMeasured,
  setInformation,
  setWidthChangeType,
  roomSelect,
  roomSelectors,
  setRoomSelect,
  setRoomSelectors,
  type,
  setType,
  scale,
  setScale,
  setSelectedButton,
  setLeftPosState,
  setRightPosState,
  setUserLength,
  setUserWidth,
  setUserHeight,
  setLineBreakState,
  setMergeState
} = drawingSlice.actions;

export default drawingSlice.reducer;
