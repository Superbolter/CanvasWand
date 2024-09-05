import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveRoomButton,
  setActiveRoomIndex,
  setExpandRoomNamePopup,
  setFactor,
  setPoints,
  setRoomDetails,
  setRoomEditingMode,
  setRoomName,
  setRoomSelectorMode,
  setSelectedLinesState,
  setStoreBoxes,
  setStoreLines,
  showRoomNamePopup,
  updateDrawData,
} from "../Actions/ApplicationStateAction";
import { setContextualMenuStatus, setRedoStack, setShowPopup, setUndoStack } from "../Actions/DrawingActions";
import useModes from "./useModes";
import { setLineBreakState, setMergeState, setRoomSelectors, setScale, setUserHeight, setUserLength } from "../features/drawing/drwingSlice";
import { handleDownload } from "../component/Helpers/ConvertToJson.js";
import { fetchWrapper } from "../app/RomeDataManager.js";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant.js";
import { toast } from 'react-hot-toast';

export const useActions = () => {
  const { actionHistory, redoStack } = useSelector((state) => state.Drawing);
  const { storeLines, points, storeBoxes, selectionMode, roomSelectorMode, floorplanId } = useSelector(
    (state) => state.ApplicationState
  );
  const {lineBreak, merge, userLength, userWidth, userHeight, roomSelectors, leftPos, rightPos, measured} = useSelector((state) => state.drawing)
  const dispatch = useDispatch();
  const {toggleSelectionMode} = useModes();

  const undo = () => {
    const newStack = [...actionHistory];
    const lastAction = newStack.pop();
    if (!lastAction) return; // No action to undo

    const redoStackCopy = [...redoStack, lastAction];
    dispatch(setRedoStack(redoStackCopy));

    switch (lastAction.type) {
      case "delete":
        // Undo deletion by adding back the deleted lines
        dispatch(setStoreLines([...storeLines, ...lastAction.deletedLines]));
        dispatch(setPoints([...points, ...lastAction.deletedPoints]));
        dispatch(setStoreBoxes([...storeBoxes, ...lastAction.deletedBoxes]));
        break;

      case "merge":
        // Undo merge by removing the merged line and adding back the original lines
        const filteredLines = storeLines.filter(
          (line) => line.id !== lastAction.mergedLine.id
        );
        dispatch(
          setStoreLines([...filteredLines, ...lastAction.originalLines])
        );
        break;

      case "split":
        // Undo split by removing the split lines and adding back the original line
        const linesAfterSplitUndo = storeLines.filter(
          (line) =>
            !lastAction.splitLines.some((splitLine) => splitLine.id === line.id)
        );
        dispatch(
          setStoreLines([...linesAfterSplitUndo, lastAction.originalLine])
        );

        // Optionally remove the break point if necessary
        const pointsAfterSplitUndo = points.filter(
          (p) => !p.equals(lastAction.newPoint)
        );
        dispatch(setPoints(pointsAfterSplitUndo));
        break;

      case "addPoint":
        // Undo addPoint by restoring the previous state
        dispatch(setStoreLines([...lastAction.previousLines]));
        dispatch(setPoints([...lastAction.previousPoints]));
        dispatch(setStoreBoxes([...lastAction.previousBoxes]));
        break;

      case "replace":
        dispatch(setStoreLines([...lastAction.previousLines]));
        break;

      default:
        break;
    }
    dispatch(setUndoStack(newStack));
  };

  const redo = () => {
    const newStack = [...redoStack];
    const lastRedoAction = newStack.pop();
    if (!lastRedoAction) return; // No action to redo

    // Push the redone action back to the undo stack
    const updatedHistory = [...actionHistory, lastRedoAction];
    dispatch(setUndoStack(updatedHistory));

    switch (lastRedoAction.type) {
      case "delete":
        // Redo deletion by removing the deleted lines again
        const updatedLines = storeLines.filter(
          (line) => !lastRedoAction.deletedLines.some((dl) => dl.id === line.id)
        );
        dispatch(setStoreLines(updatedLines));
        const updatedPoints = points.filter(
          (p) => !lastRedoAction.deletedPoints.some((dp) => dp.equals(p))
        );
        dispatch(setPoints(updatedPoints));
        dispatch(
          setStoreBoxes(
            storeBoxes.filter(
              (box) =>
                !lastRedoAction.deletedBoxes.some((db) => db.id === box.id)
            )
          )
        );
        break;

      case "merge":
        // Redo merge by removing the original lines and adding the merged line
        const mergedLines = storeLines.filter(
          (line) =>
            !lastRedoAction.originalLines.some((ol) => ol.id === line.id)
        );
        dispatch(setStoreLines([...mergedLines, lastRedoAction.mergedLine]));
        break;

      case "split":
        // Redo split by removing the original line and adding the split lines
        const splitLines = storeLines.filter(
          (line) => line.id !== lastRedoAction.originalLine.id
        );
        dispatch(setStoreLines([...splitLines, ...lastRedoAction.splitLines]));

        // Optionally add the break point if necessary
        dispatch(setPoints([...points, lastRedoAction.newPoint]));
        break;

      case "addPoint":
        // Redo addPoint by restoring the state after the point was added
        dispatch(setStoreLines([...lastRedoAction.newLines]));
        dispatch(setPoints([...lastRedoAction.newPoints]));
        dispatch(setStoreBoxes([...lastRedoAction.newBoxes]));
        break;

      case "replace":
        dispatch(setStoreLines([...lastRedoAction.currentLines]));
        break;

      default:
        break;
    }
    dispatch(setRedoStack(newStack));
  };

  const handleReset = () => {
    if (selectionMode) {
      toggleSelectionMode();
    }
    if (lineBreak) {
      dispatch(setLineBreakState(false));
    }
    if (merge) {
      dispatch(setMergeState(false));
    }
  };

  const handleResetRooms = () => {
    const rooms = [];
    dispatch(setRoomSelectors(rooms));
    handleApiCall(userHeight,rooms);
    dispatch(setExpandRoomNamePopup(false));
    dispatch(setRoomDetails(""))
    dispatch(setRoomName(""))
    dispatch(setRoomEditingMode(false))
    dispatch(setActiveRoomButton(""))
    dispatch(setActiveRoomIndex(-1))
    dispatch(setSelectedLinesState([]))
  };

  const handleApiCall = (height = userHeight, rooms = roomSelectors) => {
    const lines = storeLines;
    const distance = Math.sqrt(
      (rightPos.x - leftPos.x) ** 2 + (rightPos.y - leftPos.y) ** 2
    );
    const scaleData = {
      leftPos,
      rightPos,
      distance: distance,
      unitLength: userLength,
      userWidth: userWidth,
      userHeight: height,
      unitType: measured,
    };
    const data = handleDownload(lines, points, rooms, storeBoxes);
    const finalData = {
      floorplan_id: floorplanId,
      draw_data: data,
      scale: scaleData,
    };
    dispatch(updateDrawData(finalData, floorplanId));
  };

  const handleSaveClick = () => {
    if (!roomSelectorMode) {
      handleApiCall();
      if (!selectionMode) {
        toggleSelectionMode();
      }
      dispatch(setRoomSelectorMode(true));
      dispatch(showRoomNamePopup(true));
      dispatch(setShowPopup(false))
      dispatch(setContextualMenuStatus(false))  
      // dispatch(setPerpendicularLine(false));
    } else {
      toast("Saving, Please Wait ...", {
        icon: '✔️',
        style: {
          fontFamily: "'DM Sans', sans-serif",
          color: '#000',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)'
        },
      })
      handleApiCall();
      setTimeout(() => {
        fetchWrapper.post(`/floorplans/process_draw_data/${floorplanId}`).then((res)=>{
          window.open(`https://sbst-beta.getsuperbolt.com/3d-home/floorplans/${floorplanId}`, '_blank');
        })
      }, 1000);
    }
  };

  const handleDoubleClick = async () => {
    let height = userHeight;
    switch (measured){
      case "in":
        height = "120";
        break;
      case "cm":
        height = "304.8";
        break;
      case "ft":
        height = "10";
        break;
      case "m":
        height = "3.05";
        break;
      case "mm":
        height = "3048";
        break;
      default:
        break;
    }
    dispatch(setUserHeight(height))
    dispatch(setUserLength(userLength));
    const lfactor = userLength / leftPos.distanceTo(rightPos);
    const wfactor = INITIAL_BREADTH / userWidth;
    const hfactor = INITIAL_HEIGHT / height;
    dispatch(setFactor([lfactor, wfactor, hfactor]));
    dispatch(setScale(false));
    handleApiCall(height)
  };


  return {
    undo,
    redo,
    handleReset,
    handleResetRooms,
    handleDoubleClick,
    handleSaveClick
  };
};
