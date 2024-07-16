
import { configureStore } from '@reduxjs/toolkit';
import drawingReducer from '../features/drawing/drwingSlice.js';
import DrawingReducer from '../Reducer/DrawingReducer.js';
export const store = configureStore({
  reducer: {
    drawing: drawingReducer,
    Drawing:DrawingReducer
  },
});

export default store;
