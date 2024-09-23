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
    firstTimePopupNumber: null,
    customisedPosition: null,
    popupDismissable: false
  };
};