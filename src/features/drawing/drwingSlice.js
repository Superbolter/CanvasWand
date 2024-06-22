// drawingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  points: [],
  storeLines: [],
  perpendicularLine: true,
  factor: [1, 1, 1],
  measured: 'in',
  information: false,
  idSelection: [],
  widthChangeType:'between',
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
    setIdSelection: (state, action) => {
      state.idSelection = action.payload;
    },
    setPerpendicularLine: (state, action) => {
      state.perpendicularLine = action.payload;
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
  },
});

export const { setPoints, setStoreLines, setIdSelection,setPerpendicularLine ,setFactor,setMeasured,setInformation,setWidthChangeType} = drawingSlice.actions;

export default drawingSlice.reducer;





