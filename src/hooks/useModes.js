import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedLinesState,
  setSelectionMode,
} from "../Actions/ApplicationStateAction";
import {
  setContextualMenuStatus,
  setDragMode,
  setNewLine,
  setShowSnapLine,
  setStop,
} from "../Actions/DrawingActions";
import { setPerpendicularLine, setSelectedButton } from "../features/drawing/drwingSlice";

const useModes = () => {
  const { selectionMode } = useSelector((state) => state.ApplicationState);
  const { dragMode, stop, newLine } = useSelector((state) => state.Drawing);
  const {perpendicularLine} = useSelector((state) => state.drawing)
  const dispatch = useDispatch();

  const toggleSelectionMode = () => {
    if (selectionMode) {
      dispatch(setSelectedLinesState([]));
      dispatch(setNewLine(true));
      dispatch(setContextualMenuStatus(false));
      dispatch(setShowSnapLine(false));
      dispatch(setStop(true));
      dispatch(setDragMode(false));
    } else {
      dispatch(setNewLine(true));
      dispatch(setShowSnapLine(false));
      dispatch(setContextualMenuStatus(false));
      dispatch(setStop(true));
      dispatch(setDragMode(true));
      dispatch(setSelectedButton([]));
    }
    dispatch(setSelectionMode(!selectionMode));
  };

  const toggleDragMode = () => {
    dispatch(setDragMode(!dragMode));
  };

  const toggleSelectionSplitMode = () => {
    if (selectionMode) {
      dispatch(setSelectedLinesState([]));
      dispatch(setNewLine(false));
      dispatch(setContextualMenuStatus(false));
      dispatch(setShowSnapLine(false));
      dispatch(setStop(true));
    } else {
      dispatch(setNewLine(true));
      dispatch(setShowSnapLine(false));
      dispatch(setContextualMenuStatus(false));
      dispatch(setStop(true));
      dispatch(setSelectedButton([]));
    }
    dispatch(setSelectionMode(!selectionMode));
  };

  const escape = () => {
    dispatch(setNewLine(!newLine));
    dispatch(setShowSnapLine(false));
    dispatch(setContextualMenuStatus(false));
    dispatch(setStop(!stop));
  };

  const perpendicularHandler = () => {
    dispatch(setPerpendicularLine(!perpendicularLine));
    dispatch(setNewLine(true));
    dispatch(setShowSnapLine(false));
    dispatch(setStop(true));
  };

  return {
    toggleSelectionMode,
    toggleDragMode,
    toggleSelectionSplitMode,
    escape,
    perpendicularHandler
  };
};

export default useModes;
