import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { setIsDrawing, setRectangleDrawing, setHelper, toggle3DMode,setWalls3D } from '../features/drawing/drwingSlice'; // Import your action creators
import DownloadJSONButton from "../Utils/ConvertToJson";
import { LengthConverter } from "./LengthConverter";
import { convertLinesTo3D } from "../Utils/ConvertLinesTo3D";

const UIControls = () => {
  const dispatch = useDispatch(); 
  const {
    is3D,
    lines,
    points
  } = useSelector((state) => state.drawing); 
  const handleToggleMode = () => {
    dispatch(toggle3DMode());
  };

  const convertLinesTo3DHandler = () => {
    convertLinesTo3D(dispatch, lines, setWalls3D, toggle3DMode);
  };

  const startDrawing = () => {
    dispatch(setIsDrawing(true));
  };

  const handleRectangle = () => {
    dispatch(setIsDrawing(true));
    dispatch(setRectangleDrawing(true));
    dispatch(setHelper(true)); 
  };

  const stopDrawing = () => {
    dispatch(setIsDrawing(false));
  };

  return (
    <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2 }}>
      {!is3D ? (
        <>
          <button onClick={startDrawing}>Start Drawing</button>
          <button onClick={stopDrawing}>Stop Drawing</button>
          <button onClick={handleRectangle}>Rectangle</button>
          <DownloadJSONButton lines={lines} points={points} />
          <button onClick={convertLinesTo3DHandler}>Convert to 3D</button>
          <LengthConverter />
        </>
      ) : (
        <button onClick={handleToggleMode}>
          {is3D ? "2D Mode" : "3D Mode"}
        </button>
      )}
    </div>
  );
};

export default UIControls;
