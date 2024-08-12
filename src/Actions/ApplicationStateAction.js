import { useDispatch } from "react-redux";
import RomeDataManager , {fetchWrapper} from "../app/RomeDataManager";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant";
import * as THREE from 'three';
import { setLeftPosState, setRightPosState, setScale, setUserLength } from "../features/drawing/drwingSlice";

export const drawToolData = (floorplan_id) => {
    return (dispatch) => {
        const formData = new FormData();
        formData.append('floorplan_id', floorplan_id); // Assuming 'token' is the expected field name

        const requestOptions = {
            headers: {
                'Content-Type': 'multipart/form-data', // Set content type as multipart/form-data
            },
        };

        fetchWrapper.post(`/floorplans/floorplan_activities/draw`, formData, requestOptions)
            .then(response => {
                dispatch({
                    type: "GET_DRAW_DATA",
                    payload: response.data // assuming the response contains some data you might need
                });
                const drawData=JSON.parse(response.data.draw_data);
                let lines=[];
                let point=[]
                if(drawData&&drawData.lines&&drawData.lines.length>0){

                    lines = drawData&&drawData.lines&&drawData.lines.map(line => ({
                        id: line.id,
                        points: [
                            new THREE.Vector3(line.startPoint.x, line.startPoint.y, line.startPoint.z),
                            new THREE.Vector3(line.endPoint.x, line.endPoint.y, line.endPoint.z)
                        ],
                        length: line.length,
                        width: line.width,
                        height: line.height,
                        widthchangetype: line.widthchangetype,
                        widthchange: line.widthchange,
                        type: line.type,
                        typeId:line.typeId
                    }));
                }
                if(drawData&&drawData.points&&drawData.points.length>0){
                    point = drawData && drawData.points && drawData.points.map(point =>
                        new THREE.Vector3(point.x, point.y, point.z),
                    );
                }
                dispatch(setStoreLines(lines));
                dispatch(setPoints(point));
                dispatch(setStoreBoxes(drawData.storeBoxes));
                if(response.data.scale!==null){
                    const scaleData = JSON.parse(response.data.scale)
                    const userHeight = 10;
                    const userLength = scaleData.unitLength;
                    dispatch(setUserLength(userLength))
                    const left = new THREE.Vector3(scaleData.leftPos.x, scaleData.leftPos.y, scaleData.leftPos.z);
                    const right = new THREE.Vector3(scaleData.rightPos.x, scaleData.rightPos.y, scaleData.rightPos.z);
                    dispatch(setLeftPosState(left))
                    dispatch(setRightPosState(right))
                    const userWidth = 2;
                    const lfactor = userLength / scaleData.distance;
                    const wfactor = INITIAL_BREADTH / userWidth;
                    const hfactor = INITIAL_HEIGHT / userHeight;
                    dispatch(setFactor([lfactor, wfactor, hfactor]));
                    dispatch(setScale(false))
                }
            })
            .catch(error => {
                console.error("Error", error);
            });
    };
} 
export const updateDrawData = (data,floorplanId) => {
    return (dispatch) => {
        fetchWrapper.post(`/floorplans/update_draw_data`, data)
            .then(response => {
                dispatch({
                    type: "UPDATE_DRAW_DATA",
                    payload: response.data 
                });
                dispatch(drawToolData(floorplanId))                
            })
            .catch(error => {
                console.error("Error", error);
             
            });
    };
};
export const setStoreLines=(lines)=>{
    return (dispatch)=>{
        dispatch({
            type: "SET_STORE_LINES",
            payload: lines 
        });
    }
}

export const setStoreBoxes=(box)=>{
    return(dispatch)=>{
        dispatch({
            type: "SET_STORE_BOXES",
            payload: box, 
        });
    }
} 

export const setPoints=(points)=>{
    return (dispatch)=>{
        dispatch({
            type:"SET_POINTS",
            payload:points
        })
    }
}
export const setFactor=(factor)=>{
    return (dispatch)=>{
        dispatch({

            type:"SET_FACTOR",
            payload:factor
        })
    }
}
export const updateLineTypeId = (lineId, typeId, storeLines) => {
    return (dispatch)=>{

        // Create a copy of the storeLines array
        const updatedLines = [...storeLines];
      
        // Find the index of the line with the given lineId
        const lineIndex = updatedLines.findIndex(line => line.id === lineId);
        console.log(lineIndex)
        // If the line is found, update the typeId
        if (lineIndex !== -1) {
          updatedLines[lineIndex] = { 
            ...updatedLines[lineIndex], // Create a copy of the line object
            typeId // Update the typeId
          };
          dispatch({
            type: "SET_PROPERTY_POPUP",
            payload: true,
          })
          dispatch({

            type:"SET_HEIGHT",
            payload:storeLines[lineIndex].height,
        })
          dispatch({

            type:"SET_WIDTH",
            payload:storeLines[lineIndex].width,
        })
          // Dispatch an action to update the state in the Redux store
          dispatch(setStoreLines(updatedLines));
        }
    }
  
  };
  export const showRoomNamePopup=(value)=>{
    return(dispatch)=>{
        dispatch({

            type:"SHOW_ROOM_NAME_POPUP",
            payload:value,
        })
    }
  }

export const setRoomSelectorMode = (value) => {
    return (dispatch) => {
      dispatch({
        type: "SET_ROOM_SELECTOR_MODE",
        payload: value,
      });
    };
  };