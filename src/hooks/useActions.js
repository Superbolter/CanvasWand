import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPoints,
  setStoreBoxes,
  setStoreLines,
} from "../Actions/ApplicationStateAction";
import { setRedoStack, setUndoStack } from "../Actions/DrawingActions";

export const useActions = () => {
  const { actionHistory, redoStack } = useSelector((state) => state.Drawing);
  const { storeLines, points, storeBoxes } = useSelector(
    (state) => state.ApplicationState
  );
  const dispatch = useDispatch();

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

  return {
    undo,
    redo,
  };
};
