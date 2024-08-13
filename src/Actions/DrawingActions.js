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
        dispatch({
          type: "SET_HEIGHT",
          payload: lastSelectedLine[0].height,
        });
        dispatch({
          type: "SET_WIDTH",
          payload: lastSelectedLine[0].width,
        });
      }
    }
  };
};
  
export const setContextualMenuStatus=(value)=>({
     type: "SET_CONTEXTUAL_MENU_STATUS",
     payload:value,
})
export const setLineId=(lineId)=>({
  type:"SET_LINE_ID",
  payload:lineId,
})


