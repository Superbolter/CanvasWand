const initialState = {
    floorplanId:null,
    drawnBy:null,
  
    img:null,
    workStatus:0,
    drawData:null,
    storeLines:[],
    points:[],
    factor:[1,1,1]
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