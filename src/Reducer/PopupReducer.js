const initialState = {};

const PopupReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_POPUP_REDUCER":
      return Object.assign({}, state, {
        ...state,
        ...action,
      });
    default:
      return state;
  }
};

export default PopupReducer;
