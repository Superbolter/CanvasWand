const initialState = {
    typeId: 0,
    contextualMenuStatus:false,
    lineId:null,
    showPropertiesPopup: false,
    locked: false,
    position: [0, 0, 0],
    positionType: "neutral",
    actionHistory: [],
    redoStack: [],
    roomActionHistory: [],
    roomRedoStack: [],
    seeDimensions: false,
    cameraContext: {},
    stop: false,
    newLine: false,
    showSnapLine: false,
    snappingPoint: [],
    dragMode: false,
    mergeLine: [],
    shiftPressed: false,
    temporaryPolygon: [],
    enablePolygonSelection: false,
    higlightPoint: null,
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
      case "UPDATE_ROOM_UNDO_DATA":
        return {
          ...state,
          roomActionHistory: action.payload
        }
      case "UPDATE_ROOM_REDO_DATA":
        return {
          ...state,
          roomRedoStack: action.payload
        }
      case "SET_SEE_DIMENSIONS":
        return {
          ...state,
          seeDimensions: action.payload
        }
      case "SET_CAMERA_CONTEXT":
        return {
          ...state,
          cameraContext: action.payload
        }
      case 'UPDATE_DRAWING_STATE':
        return Object.assign({}, state, {
          ...state,
          ...action
       })
      default:
        return state;
    }
  };
  
  export default DrawingReducer;
