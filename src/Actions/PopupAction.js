export const setShowFirstTimePopup = (data) => {
  return {
    type: "UPDATE_POPUP_REDUCER",
    ...data,
  };
};

export const resetShowFirstTimePopup = () => {
  return {
    type: "UPDATE_POPUP_REDUCER",
    showFirstTimePopup: false,
    firstTimePopupType: "",
    customisedPosition: null,
    popupDismissable: false,
  };
};