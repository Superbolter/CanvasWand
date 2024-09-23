import convert from "convert-units";
import { fetchWrapper } from "../app/RomeDataManager";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant";
import * as THREE from "three";
import {
  setLeftPosState,
  setMeasured,
  setRightPosState,
  setRoomSelectors,
  setUserHeight,
  setUserLength,
  setUserWidth,
} from "../features/drawing/drwingSlice";
import { setContextualMenuStatus, setUndoStack } from "./DrawingActions";
import { setShowFirstTimePopup } from "./PopupAction";

export const drawToolData = (floorplan_id) => {
  return (dispatch, getState) => {
    const state = getState();
    const designStep = state.ApplicationState.designStep;
    let enableFirstTimePopup = state.PopupState.enableFirstTimePopup
    const formData = new FormData();
    formData.append("floorplan_uuid", floorplan_id); // Assuming 'token' is the expected field name

    const requestOptions = {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type as multipart/form-data
      },
    };

    fetchWrapper
      .post(`/floorplans/floorplan_activities/draw`, formData, requestOptions)
      .then((response) => {
        dispatch({
          type: "GET_DRAW_DATA",
          payload: response.data, // assuming the response contains some data you might need
        });
        dispatch({
          type:"UPDATE_APPLICATION_STATE",
          floorplanId: floorplan_id,
        })
        const drawData = JSON.parse(response.data.draw_data);
        let lines = [];
        let point = [];
        if (drawData && drawData.lines && drawData.lines.length > 0) {
          lines =
            drawData &&
            drawData.lines &&
            drawData.lines.map((line) => ({
              id: line.id,
              points: [
                new THREE.Vector3(
                  line.startPoint.x,
                  line.startPoint.y,
                  line.startPoint.z
                ),
                new THREE.Vector3(
                  line.endPoint.x,
                  line.endPoint.y,
                  line.endPoint.z
                ),
              ],
              length: line.length,
              width: line.width,
              height: line.height,
              widthchangetype: line.widthchangetype,
              widthchange: line.widthchange,
              type: line.type,
              typeId: line.typeId,
              locked: line.locked
            }));
        }
        if (drawData && drawData.points && drawData.points.length > 0) {
          point =
            drawData &&
            drawData.points &&
            drawData.points.map(
              (point) => new THREE.Vector3(point.x, point.y, point.z)
            );
        }
        if(lines && lines.length > 0){
          dispatch(setStoreLines(lines));
        }
        if(point && point.length > 0){
          dispatch(setPoints(point));
        }
        if(drawData?.rooms && drawData?.rooms?.length > 0){
          dispatch(setRoomSelectors(drawData.rooms));
        }
        if (drawData?.storeBoxes && drawData?.storeBoxes?.length > 0) {
          dispatch(setStoreBoxes(drawData.storeBoxes));
        }
        if (response.data.scale !== null) {
          const scaleData = JSON.parse(response.data.scale);
          const measured = scaleData?.userUnit || "mm";
          dispatch(setMeasured(measured))
          let userHeight = scaleData?.userHeight;
          let userLength = scaleData?.unitLength;
          let userWidth = scaleData?.userWidth;
          if(measured === "ft"){
            userLength = convert(userLength).from("in").to("ft");
            userWidth = convert(userWidth).from("in").to("ft");
          }
          dispatch(setUserLength(userLength));
          dispatch(setUserWidth(userWidth));
          dispatch(setUserHeight(userHeight));
          const left = {
            x: scaleData.leftPos.x,
            y: scaleData.leftPos.y,
            z: scaleData.leftPos.z
          };
          const right = {
            x: scaleData.rightPos.x,
            y: scaleData.rightPos.y,
            z: scaleData.rightPos.z
          };
          dispatch(setLeftPosState(left));
          dispatch(setRightPosState(right));
          const lfactor = userLength / scaleData.distance;
          const wfactor = INITIAL_BREADTH;
          const hfactor = INITIAL_HEIGHT / userHeight;
          dispatch(setFactor([lfactor, wfactor, hfactor]));
          if((designStep === 1 || designStep === 2) && enableFirstTimePopup){
            dispatch(setDesignStep(2));
            dispatch(setShowFirstTimePopup({
              showFirstTimePopup: true,
              firstTimePopupType: "ui",
              firstTimePopupNumber: 3,
              popupDismissable: false
            }))
          }else if(designStep === 3 && enableFirstTimePopup){
            dispatch(setShowFirstTimePopup({
              showFirstTimePopup: true,
              firstTimePopupType: "canvas",
              firstTimePopupNumber: 6,
              popupDismissable: false
            }))
          }
        }else{
          if(designStep === 1 && enableFirstTimePopup){
            dispatch(setShowFirstTimePopup({
              showFirstTimePopup: true,
              firstTimePopupType: "canvas",
              firstTimePopupNumber: 1,
              popupDismissable: true
            }))
          }
        }
        if(!response.data.image_uri && response.data.scale === null){
          dispatch(setDesignStep(2));
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
};
export const updateDrawData = (data, floorplanId) => {
  return (dispatch) => {
    fetchWrapper
      .post(`/floorplans/update_draw_data`, data)
      .then((response) => {
        dispatch({
          type: "UPDATE_DRAW_DATA",
          payload: response.data,
        });
        dispatch(drawToolData(floorplanId));
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
};
export const setStoreLines = (lines) => {
  return (dispatch) => {
    dispatch({
      type: "SET_STORE_LINES",
      payload: lines,
    });
  };
};

export const setStoreBoxes = (box) => {
  return (dispatch) => {
    dispatch({
      type: "SET_STORE_BOXES",
      payload: box,
    });
  };
};

export const setPoints = (points) => {
  return (dispatch) => {
    dispatch({
      type: "SET_POINTS",
      payload: points,
    });
  };
};
export const setFactor = (factor) => {
  return (dispatch) => {
    dispatch({
      type: "SET_FACTOR",
      payload: factor,
    });
  };
};
export const updateLineTypeId = (typeId) => {
  return (dispatch, getState) => {
    const state = getState();
    const selectedLines = [...state.ApplicationState.selectedLines];
    const selectionMode = state.ApplicationState.selectionMode;
    const storeLines = [...state.ApplicationState.storeLines];
    if (selectionMode && selectedLines) {
        const updateLines = storeLines.map(line => {
            const matchingSelectedLine = selectedLines.find(selectedLine => selectedLine === line.id);
            if (matchingSelectedLine) {
              return {
                ...line,
                typeId,  
              };
            }
            return line; // Keep the line unchanged if no match is found
        }); 
        const history = [...state.Drawing.actionHistory]
        history.push({
          type: 'replace',
          previousLines: [...storeLines],
          currentLines: updateLines,
        })
        dispatch(setUndoStack(history))
        dispatch(setStoreLines(updateLines)) 
        dispatch(setContextualMenuStatus(false))        
    } else {
      const measured = state.drawing.measured
      const lineIndex = storeLines.length - 1;
      if (lineIndex !== -1) {
        storeLines[lineIndex] = {
          ...storeLines[lineIndex], // Create a copy of the line object
          typeId, // Update the typeId
        };
        dispatch({
          type: "SET_PROPERTY_POPUP",
          payload: true,
        });
        const length = convert(storeLines[lineIndex].length).from('mm').to(measured)
        const width = convert(storeLines[lineIndex].width).from('mm').to(measured)
        dispatch({
          type: "SET_LENGTH",
          payload: length,
        });
        dispatch({
          type: "SET_WIDTH",
          payload: width,
        });
        // Dispatch an action to update the state in the Redux store
        dispatch(setStoreLines(storeLines));
      }
    }
  };
};

export const showRoomNamePopup = (value) => {
  return (dispatch) => {
    dispatch({
      type: "SHOW_ROOM_NAME_POPUP",
      payload: value,
    });
  };
};

export const setExpandRoomNamePopup = (value) => {
  return (dispatch) => {
    dispatch({
      type: "SET_EXPAND_ROOM_NAME_POPUP",
      payload: value,
    });
  };
};

export const setRoomEditingMode = (value) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      roomEditingMode: value,
    });
  };
};

export const setRoomName = (value) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      selectedRoomName: value,
    });
  };
};

export const setRoomDetails = (value) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      selectedRoomType: value,
    });
  };
};

export const setActiveRoomButton = (value) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      activeRoomButton: value,
    });
  };
};

export const setActiveRoomIndex = (value) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      activeRoomIndex: value,
    });
  };
};

export const setSelectionMode = (val) => {
  return (dispatch) => {
    dispatch({
      type: "SET_SELECTION_MODE",
      payload: val,
    });
  };
};

export const setSelectedLinesState = (val) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      selectedLines: val,
    });
  };
};

export const setDesignStep = (val) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      designStep: val
    })
  }
}

export const setImageOpacity = (val) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      imageOpacity: val
    })
  }
}

export const setShowSetScalePopup = (val) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      showSetScalePopup: val
    })
  }
}

export const setFirstLinePoints = (val) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      firstLinePoints: val
    })
  }
}

export const setHelpVideo = (val, type = "") =>{
  return (dispatch) => {
    dispatch({
      type: "UPDATE_APPLICATION_STATE",
      helpVideo: val,
      helpVideoType: type
    })
  }
}