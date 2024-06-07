import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lines: [],
  formVisibles: false,
  points: [],
  escapePoints: [],
  is3D: false,
  walls3D: [],
  isDrawing: true,
  freedome: false,
  newLines: false,
  activeSnap: true,
  rectangleDrawing: false,
  helper: false,
  rectPoints: [],
  hoveredLineIndex: null,
  selectedLineIndex: [],
  idSelection:[],
  keyPressed: false,
  factor: [1, 1, 1],
  firstLine: true,
  measured: 'in',
};

const drawingSlice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    addLine: (state, action) => {
      state.lines.push(action.payload);
    },
    addPoint: (state, action) => {
      state.points.push(action.payload);
    },
    setFormVisible: (state, action) => {
      state.formVisibles = action.payload;
    },
    setLines: (state, action) => {
      state.lines = action.payload;
    },
    setPoints: (state, action) => {
      state.points = action.payload;
    },
    setEscapePoints: (state, action) => {
      state.escapePoints = action.payload;
    },
    setWalls3D: (state, action) => {
      state.walls3D = action.payload;
    },
    toggle3DMode: (state) => {
      state.is3D = !state.is3D;
    },
    setIsDrawing: (state, action) => {
      state.isDrawing = action.payload;
    },
    setFreedome: (state, action) => {
      state.freedome = action.payload;
    },
    setNewLines: (state, action) => {
      state.newLines = action.payload;
    },
    setActiveSnap: (state, action) => {
      state.activeSnap = action.payload;
    },
    setRectangleDrawing: (state, action) => {
      state.rectangleDrawing = action.payload;
    },
    setHelper: (state, action) => {
      state.helper = action.payload;
    },
    setRectPoints: (state, action) => {
      state.rectPoints = action.payload;
    },
    setHoveredLineIndex: (state, action) => {
      state.hoveredLineIndex = action.payload;
    },
    setSelectedLineIndex: (state, action) => {
      state.selectedLineIndex = action.payload;
    },
    setIdSelection: (state, action) => {
      state.idSelection = action.payload;
    },
    setKeyPressed: (state, action) => {
      state.keyPressed = action.payload;
    },
    setFactor: (state, action) => {
      state.factor = action.payload;
    },
    setFirstLine: (state, action) => {
      state.firstLine = action.payload;
    },
    setMeasured: (state, action) => {
      state.measured = action.payload;
    },
  },
});

export const {
  addLine,
  addPoint,
  setLines,
  setFormVisible,
  setPoints,
  setEscapePoints,
  setWalls3D,
  toggle3DMode,
  setIsDrawing,
  setFreedome,
  setNewLines,
  setActiveSnap,
  setRectangleDrawing,
  setHelper,
  setRectPoints,
  setHoveredLineIndex,
  setSelectedLineIndex,
  setIdSelection,
  setKeyPressed,
  setFactor,
  setFirstLine,
  setMeasured
} = drawingSlice.actions;

export default drawingSlice.reducer;
