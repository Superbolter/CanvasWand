export const setShowFirstTimePopup = (showFirstTimePopup, firstTimePopupType = "", firstTimePopupName =  null) => {
  return {
    type: "UPDATE_POPUP_REDUCER",
    showFirstTimePopup,
    firstTimePopupType,
    firstTimePopupName,
  };
};

export const setEnableFirstTimePopup = (enableFirstTimePopup) => {
  return {
    type: "UPDATE_POPUP_REDUCER",
    enableFirstTimePopup,
  };
};