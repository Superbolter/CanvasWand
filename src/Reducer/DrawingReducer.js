const initialState = {
    type_id: 0,
  };
  
  const DrawingReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_MODE":
        return {
          ...state,
          type_id: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default DrawingReducer;