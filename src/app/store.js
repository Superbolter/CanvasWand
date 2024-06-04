
import { configureStore } from '@reduxjs/toolkit';
import drawingReducer from '../features/drawing/drwingSlice.js';

export const store = configureStore({
  reducer: {
    drawing: drawingReducer,
  },
});

export default store;
