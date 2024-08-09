export const setTypeId = (type_id) => ({
    type: "SET_TYPE_ID",
    payload: type_id,
    
  });

export const setShowPopup = (val) => ({
  type: "SET_PROPERTY_POPUP",
  payload: val
})
export const setContextualMenuStatus=(value)=>({
     type: "SET_CONTEXTUAL_MENU_STATUS",
     payload:value,
})
export const setLineId=(lineId)=>({
  type:"SET_LINE_ID",
  payload:lineId,
})


