
import { configureStore } from '@reduxjs/toolkit';
import drawingReducer from '../features/drawing/drwingSlice.js';
import DrawingReducer from '../Reducer/DrawingReducer.js';
import ApplicationStateReducer from '../Reducer/ApplicationStateReducer.js';
export const store = configureStore({
  reducer: {
    drawing: drawingReducer,
    Drawing:DrawingReducer,
    ApplicationState:ApplicationStateReducer,
  },
});

export default store;
