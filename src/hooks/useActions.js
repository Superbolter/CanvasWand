import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveRoomButton,
  setActiveRoomIndex,
  setDesignStep,
  setExpandRoomNamePopup,
  setFactor,
  setPoints,
  setRoomDetails,
  setRoomEditingMode,
  setRoomName,
  setSelectedLinesState,
  setStoreBoxes,
  setStoreLines,
  showRoomNamePopup,
  updateDrawData,
} from "../Actions/ApplicationStateAction";
import {
  setContextualMenuStatus,
  setRedoStack,
  setShowPopup,
  setTypeId,
  setUndoStack,
} from "../Actions/DrawingActions";
import useModes from "./useModes";
import {
  setLineBreakState,
  setMergeState,
  setRoomSelectors,
  setUserHeight,
  setUserLength,
  setUserWidth,
} from "../features/drawing/drwingSlice";
import { handleDownload } from "../component/Helpers/ConvertToJson.js";
import { fetchWrapper } from "../app/RomeDataManager.js";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant.js";
import { toast } from "react-hot-toast";
import convert from "convert-units";

export const useActions = () => {
  const { actionHistory, redoStack } = useSelector((state) => state.Drawing);
  const {
    storeLines,
    points,
    storeBoxes,
    selectionMode,
    designStep,
    floorplanId,
  } = useSelector((state) => state.ApplicationState);
  const {
    lineBreak,
    merge,
    userLength,
    userWidth,
    userHeight,
    roomSelectors,
    leftPos,
    rightPos,
    measured,
  } = useSelector((state) => state.drawing);
  const dispatch = useDispatch();
  const { toggleSelectionMode } = useModes();

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

      case "deleteRoom":
        dispatch(setRoomSelectors([...lastAction.oldRooms]));
        dispatch(setSelectedLinesState([]));
        dispatch(setExpandRoomNamePopup(false));
        dispatch(setRoomDetails(""));
        dispatch(setRoomName(""));
        dispatch(setRoomEditingMode(false));
        dispatch(setActiveRoomButton(""));
        dispatch(setActiveRoomIndex(-1));
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

      case "deleteRoom":
        dispatch(setRoomSelectors([...lastRedoAction.newRooms]));
        dispatch(setSelectedLinesState([]));
        dispatch(setExpandRoomNamePopup(false));
        dispatch(setRoomDetails(""));
        dispatch(setRoomName(""));
        dispatch(setRoomEditingMode(false));
        dispatch(setActiveRoomButton(""));
        dispatch(setActiveRoomIndex(-1));
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
    handleApiCall(userLength, userWidth,userHeight, rooms);
    dispatch(setExpandRoomNamePopup(false));
    dispatch(setRoomDetails(""));
    dispatch(setRoomName(""));
    dispatch(setRoomEditingMode(false));
    dispatch(setActiveRoomButton(""));
    dispatch(setActiveRoomIndex(-1));
    dispatch(setSelectedLinesState([]));
  };

  const handleApiCall = (length = userLength, width = userWidth,height = userHeight, rooms = roomSelectors) => {
    const lines = storeLines;
    const distance = Math.sqrt(
      (rightPos.x - leftPos.x) ** 2 + (rightPos.y - leftPos.y) ** 2
    );
    let newLength = length;
    let newWidth = width;
    let unit = measured;
    if(measured === "ft"){
      newLength = convert(newLength).from("ft").to("in");
      newWidth = convert(newWidth).from("ft").to("in");
      unit = "in";
    }
    const scaleData = {
      leftPos,
      rightPos,
      distance: distance,
      unitLength: newLength,
      userWidth: newWidth,
      userHeight: height,
      unitType: unit,
    };
    const data = handleDownload(lines, points, rooms, storeBoxes);
    const finalData = {
      floorplan_uuid: floorplanId,
      draw_data: data,
      scale: scaleData,
    };
    dispatch(updateDrawData(finalData, floorplanId));
  };

  const handleSaveClick = () => {
    if (designStep !== 3) {
      handleApiCall();
      // if (!selectionMode) {
      //   toggleSelectionMode();
      // }
      dispatch(setTypeId(0));
      dispatch(setDesignStep(3));
      dispatch(showRoomNamePopup(true));
      dispatch(setShowPopup(false));
      dispatch(setContextualMenuStatus(false));
      // dispatch(setPerpendicularLine(false));
    } else {
      dispatch(setDesignStep(4))
      toast("Saving, Please Wait ...", {
        icon: "✔️",
        style: {
          fontFamily: "'DM Sans', sans-serif",
          color: "#000",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
        },
      });
      handleApiCall();
      setTimeout(() => {
        fetchWrapper
          .post(`/floorplans/process_draw_data/${floorplanId}`)
          .then((res) => {
            // window.open(
            //   `https://sbst-beta.getsuperbolt.com/3d-home/floorplans/${floorplanId}`,
            //   "_blank"
            // );
            window.location = `https://sbst-beta.getsuperbolt.com/3d-home/floorplans/${floorplanId}`
          });
      }, 1000);
    }
  };

  const handleDoubleClick = async (length, width) => {
    let height = userHeight;
    switch (measured) {
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
    if(measured === "ft"){
      dispatch(setUserLength(length));
      dispatch(setUserWidth(width));
    }
    dispatch(setUserHeight(height));
    const lfactor = length / leftPos.distanceTo(rightPos);
    const wfactor = INITIAL_BREADTH / width;
    const hfactor = INITIAL_HEIGHT / height;
    dispatch(setFactor([lfactor, wfactor, hfactor]));
    dispatch(setDesignStep(2));
    handleApiCall(length, width,height);
  };

  return {
    undo,
    redo,
    handleReset,
    handleResetRooms,
    handleDoubleClick,
    handleSaveClick,
  };
};
