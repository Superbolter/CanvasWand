const initialState = {
    typeId: 1,
    contextualMenuStatus:false,
    lineId:null,
    showPropertiesPopup: false,
  };
  
  const DrawingReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_TYPE_ID":
        return {
          ...state,
          typeId: action.payload,
        };
      case "SET_CONTEXTUAL_MENU_STATUS":
        return {
          ...state,
          contextualMenuStatus: action.payload,
        };
      case "SET_LINE_ID":
        return {
          ...state,
          lineId: action.payload,
        };
      case "SET_PROPERTY_POPUP":
        return {
          ...state,
          showPropertiesPopup: action.payload
        }
      default:
        return state;
    }
  };
  
  export default DrawingReducer;