import { showRoomNamePopup } from "../Actions/ApplicationStateAction";

const initialState = {
    floorplanId:null,
    drawnBy:null,
    height:0,
    width:0,
    img:null,
    workStatus:0,
    drawData:null,
    storeLines:[],
    points:[],
    factor:[1,1,1],
    roomPopup:false,
    storeBoxes: [],
    roomSelectorMode: false,
  };
  
  const ApplicationStateReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_DRAW_DATA":
        return {
          ...state,
          floorplanId:action.payload.id,
          img:action.payload.image_uri,
          drawnBy:action.payload.drawed_by,
          workStatus:action.payload.work_status,
          drawData:action.payload.draw_data,
        };
      case "SET_STORE_LINES":
        return {
          ...state,
          storeLines:action.payload

        };
      case "SET_STORE_BOXES":
        return {
          ...state,
          storeBoxes: action.payload,
        }
      case "SET_POINTS":
        return {
          ...state,
          points:action.payload
        };
      case "SET_FACTOR":
        return {
          ...state,
          factor:action.payload
        };
      case "SET_HEIGHT":
        return {
          ...state,
          height:action.payload
        };
      case "SET_WIDTH":
        return {
          ...state,
          width:action.payload
        };
      case "SHOW_ROOM_NAME_POPUP":
        return {
          ...state,
          roomPopup:action.payload,
        };
      
      case "SET_ROOM_SELECTOR_MODE":
        return {
          ...state,
          roomSelectorMode:action.payload,
        };


    //   case "UPDATE_DRAW_DATA":
    //     return {
    //       ...state,
    //       floorplanId:action.payload.id,
    //       img:action.payload.image_uri,
    //       scale:action.payload.scale,
    //       drawnBy:action.payload.drawed_by,
    //       workStatus:action.payload.work_status,
    //       drawdata:action.payload.draw_data,

          
    //     };
     
      default:
        return state;
    }
  };
  
  export default ApplicationStateReducer;