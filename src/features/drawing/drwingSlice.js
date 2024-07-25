// drawingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
 
  roomSelect: false,
  roomSelectors: [],
  perpendicularLine: true,
  height:0,
  width:0,
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
      console.log(state.ApplicationState.storeLines);
      const lineIndex = state.ApplicationState.storeLines.findIndex(line => line.id === id);
      if (lineIndex !== -1) {
        state.storeLines[lineIndex].typeId = typeId;
        state.height=state.ApplicationState.storeLines[lineIndex].height;
        state.width=state.ApplicationState.storeLines[lineIndex].width;
        console.log(state.ApplicationState.storeLines)
      }
    },
  },
});

export const {

  setIdSelection,
  setPerpendicularLine,
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
