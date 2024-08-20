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
        const height = convert(lastSelectedLine[0].height).from('mm').to('in')
        const width = convert(lastSelectedLine[0].width).from('mm').to('in')
        dispatch({
          type: "SET_HEIGHT",
          payload: height,
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
  }
}
export const setLineId=(lineId)=>({
  type:"SET_LINE_ID",
  payload:lineId,
})


