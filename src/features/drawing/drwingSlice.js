import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lines: [{ id: 1, points: [[-100, -100, 0], [-100, -100, 0]] }],
  widthChangeType:'between',
  formVisibles: false,
  points: [],
  between :false,
  breakPoint : [],
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
    setWidthChangeType: (state, action) => {
      state.widthChangeType = action.payload;
    },
    setFormVisible: (state, action) => {
      state.formVisibles = action.payload;
    },
    setLines: (state, action) => {
      state.lines = action.payload;
    },
    updateLastLine(state, action) {
        if (state.lines.length > 0) {
          state.lines[state.lines.length - 1].points = action.payload;
        }
      },
      addPoint(state, action) {
        state.points.push(action.payload);
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
  updateLastLine,
  setWidthChangeType,
  setLines,
  setBetween,
  setBreak,
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
