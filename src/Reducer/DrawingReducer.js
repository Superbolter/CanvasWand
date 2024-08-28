const initialState = {
    typeId: 1,
    contextualMenuStatus:false,
    lineId:null,
    showPropertiesPopup: false,
    locked: false,
    position: [0, 0, 0],
    positionType: "neutral",
    actionHistory: [],
    redoStack: [],
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
          position: action.position,
          positionType: action.positionType
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
      case "SET_LOCK":
        return {
         ...state,
          locked: action.payload
        }
      case "UPDATE_UNDO_DATA":
        return {
          ...state,
          actionHistory: action.payload
        }
      case "UPDATE_REDO_DATA":
        return {
          ...state,
          redoStack: action.payload
        }
      default:
        return state;
    }
  };
  
  export default DrawingReducer;
