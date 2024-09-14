import convert from "convert-units";
import { setStoreLines } from "./ApplicationStateAction";

export const setTypeId = (type_id) => ({
    type: "SET_TYPE_ID",
    payload: type_id,
    
  });

export const setShowPopup = (val) => {
  return (dispatch, getState) => {
    dispatch({
      type: "SET_PROPERTY_POPUP",
      payload: val,
    });
    if(val){
      const state = getState();
      const storeLines = [...state.ApplicationState.storeLines];
      const selectedLines = [...state.ApplicationState.selectedLines];
      const lastSelectedLineId = selectedLines[selectedLines.length - 1];
      const lastSelectedLine = storeLines.filter(line => lastSelectedLineId === line.id)
      if (lastSelectedLine.length > 0) {
        const measured = state.drawing.measured
        const length = convert(lastSelectedLine[0].length).from('mm').to(measured)
        const width = convert(lastSelectedLine[0].width).from('mm').to(measured)
        dispatch({
          type: "SET_LENGTH",
          payload: length,
        });
        dispatch({
          type: "SET_WIDTH",
          payload: width,
        });
        dispatch({
          type: "SET_LOCK",
          payload: lastSelectedLine[0].locked,
        })
      }
    }
  };
};

export const setLockForLines = (val) =>{
  return(dispatch, getState) =>{
    const state = getState();
    const storeLines = [...state.ApplicationState.storeLines];
    const selectedLines = [...state.ApplicationState.selectedLines];
    const updatedLines = storeLines.map(line => {
      const matchingSelectedLine = selectedLines.find(selectedLine => selectedLine === line.id);
      if (matchingSelectedLine) {
        return {
         ...line,
          locked: val,
        };
      }
      return line; // Keep the line unchanged if no match is found
    });
    dispatch(setStoreLines(updatedLines))
    dispatch({
      type: "SET_LOCK",
      payload: val,
    })
  }
}
  
export const setContextualMenuStatus=(value, position=[0,0,0], positionType="neutral")=>{
  return(dispatch) => {
    dispatch({
      type: "SET_CONTEXTUAL_MENU_STATUS",
      payload: value,
      position,
      positionType
    });
    if(!value){
      dispatch(setShowPopup(false))
    }
  }
}
export const setLineId=(lineId)=>({
  type:"SET_LINE_ID",
  payload:lineId,
})

export const setUndoStack = (undoStack) => ({
  type: "UPDATE_UNDO_DATA",
  payload: undoStack,
});

export const setRedoStack = (undoStack) => ({
  type: "UPDATE_REDO_DATA",
  payload: undoStack,
});

export const setSeeDimensions = (val) => ({
  type: "SET_SEE_DIMENSIONS",
  payload: val,
});

export const setCameraContext = (val) => ({
  type: "SET_CAMERA_CONTEXT",
  payload: val,
});

export const setStop = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  stop: val
})

export const setNewLine = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  newLine: val
})

export const setShowSnapLine = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  showSnapLine: val
})

export const setSnappingPoint = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  snappingPoint: val
})

export const setDragMode = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  dragMode: val
})

export const setMergeLine = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  mergeLine: val
})

export const setShiftPressed = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  shiftPressed: val
})

export const updateTemoraryPolygon = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  temporaryPolygon: val
})

export const setEnablePolygonSelection = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  enablePolygonSelection: val
})

export const setHiglightPoint = (val) => ({
  type: "UPDATE_DRAWING_STATE",
  higlightPoint: val
})