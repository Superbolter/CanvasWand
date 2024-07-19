// drawingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  points: [],
  storeLines: [],
  roomSelect: false,
  roomSelectors: [],
  perpendicularLine: false,
  factor: [1, 1, 1],
  measured: "in",
  information: false,
  idSelection: [],
  widthChangeType: "between",
  type:"wall",
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
    updateLineTypeId: (state, action) => {
      const { id, typeId } = action.payload;
      const lineIndex = state.storeLines.findIndex(line => line.id === id);
      if (lineIndex !== -1) {
        state.storeLines[lineIndex].typeId = typeId;
      }
    },
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
  updateLineTypeId      
} = drawingSlice.actions;

export default drawingSlice.reducer;
