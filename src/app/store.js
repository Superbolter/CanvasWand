
import { configureStore } from '@reduxjs/toolkit';
import drawingReducer from '../features/drawing/drwingSlice.js';
import DrawingReducer from '../Reducer/DrawingReducer.js';
import ApplicationStateReducer from '../Reducer/ApplicationStateReducer.js';
import PopupReducer from '../Reducer/PopupReducer.js';
export const store = configureStore({
  reducer: {
    drawing: drawingReducer,
    Drawing:DrawingReducer,
    ApplicationState:ApplicationStateReducer,
    PopupState: PopupReducer
  },
});

export default store;
