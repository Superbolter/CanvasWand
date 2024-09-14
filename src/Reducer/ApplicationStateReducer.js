const initialState = {
    floorplanId:null,
    drawnBy:null,
    length:0,
    width:0,
    img:null,
    workStatus:0,
    drawData:null,
    storeLines:[],
    points:[],
    factor:[1,1,1],
    roomPopup:false,
    expandRoomPopup: false,
    storeBoxes: [],
    selectionMode: false,
    selectedLines: [],
    roomEditingMode: false,
    selectedRoomName: "",
    selectedRoomType: "",
    activeRoomButton: "",
    activeRoomIndex: -1,
    designStep: 1,
    imageOpacity: 0.8,
    showSetScalePopup: false,
    firstLinePoints: [],
    helpVideo: false,
    helpVideoType: "",
  };
  
  const ApplicationStateReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_DRAW_DATA":
        return {
          ...state,
          // floorplanId:action.payload.id,
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
      case "SET_LENGTH":
        return {
          ...state,
          length:action.payload
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
      case "SET_EXPAND_ROOM_NAME_POPUP":
        return {
          ...state,
          expandRoomPopup:action.payload,
        };
      case "SET_SELECTION_MODE":
        return{
          ...state,
          selectionMode: action.payload
        };

      case 'UPDATE_APPLICATION_STATE':
        return Object.assign({}, state, {
          ...state,
          ...action
       })
     
      default:
        return state;
    }
  };
  
  export default ApplicationStateReducer;