import React, { useState, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import {
  setLines,
  setPoints,
  setEscapePoints,
  setWalls3D,
  toggle3DMode,
  setIsDrawing,
  setFreedome,
  setNewLines,
  setActiveSnap,
  setRectangleDrawing,
  setHelper,
  setRectPoints,
  setHoveredLineIndex,
  setKeyPressed,
  setSelectedLineIndex,
} from "./features/drawing/drwingSlice";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import AxesHelper from "./components/AxesHelper";
import CameraControls from "./components/CameraControls";
import TexturedPlane from "./components/TexturedPlane";
import Wall3D from "./components/Wall3D";
import DrawCanvas from "./components/DrawCanvas";
import {
  findNearestPoint,
  findNearestLine,
  distanceBetweenPoints,
} from "./Utils/GeometryUtils";
import { handleKeyDown, handleKeyUp } from "./Utils/KeyboardUtils";
import { convertLinesTo3D } from "./Utils/ConvertLinesTo3D";
import {
  SNAP_THRESHOLD,
  INITIAL_BREADTH,
  INITIAL_HEIGHT,
} from "./Constant/SnapThreshold";
import DownloadJSONButton from "./Utils/ConvertToJson";

import * as THREE from "three";

extend({ OrbitControls });

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState("./img.jpg");
  const [texture, setTexture] = useState(null);
  const [currentLine, setCurrentLine] = useState(null);

  const dispatch = useDispatch();
  const {
    lines,
    points,
    escapePoints,
    is3D,
    walls3D,
    isDrawing,
    freedome,
    newLines,
    activeSnap,
    rectangleDrawing,
    helper,
    rectPoints,
    hoveredLineIndex,
    selectedLineIndex,
    keyPressed,
    factor,
  } = useSelector((state) => state.drawing);

  useEffect(() => {
    const loadTexture = async () => {
      const loadedTexture = await new THREE.TextureLoader().load(
        backgroundImage
      );
      setTexture(loadedTexture);
    };
    loadTexture();
  }, [backgroundImage]);

  useEffect(() => {
    const onKeyDown = (event) =>
      handleKeyDown(event, {
        dispatch,
        points,
        lines,
        setPoints,
        setLines,
        setCurrentLine,
        setFreedome,
        setNewLines,
        setActiveSnap,
        setRectangleDrawing,
        freedome,
        activeSnap,
        hoveredLineIndex,
        keyPressed,
        setKeyPressed,
        setHoveredLineIndex,
        selectedLineIndex,
        setSelectedLineIndex,
        factor,
      });
    const onKeyUp = (event) => handleKeyUp(event, { dispatch, setNewLines });

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [
    points,
    lines,
    escapePoints,
    setPoints,
    setLines,
    setCurrentLine,
    setFreedome,
    setNewLines,
    setActiveSnap,
    setRectangleDrawing,
    freedome,
    activeSnap,
    hoveredLineIndex,
    setHoveredLineIndex,
    keyPressed,
    factor,
  ]);

  //useKeyboardEvent();

  const handleSnap = (x, y) => {
    const nearestPoint = findNearestPoint(points, x, y, SNAP_THRESHOLD);
    return nearestPoint ? { x: nearestPoint.x, y: nearestPoint.y } : { x, y };
  };

  const handleLineDrawing = (x, y, newPoint) => {
    if (points.length > 0 && !helper) {
      const lastPoint = points[points.length - 1];
      let newLine;

      if (freedome) {
        newLine = {
          startX: lastPoint.x,
          startY: lastPoint.y,
          endX: newPoint.x,
          endY: newPoint.y,
          breadth: INITIAL_BREADTH * factor[1],
          len:
            distanceBetweenPoints(
              lastPoint.x,
              lastPoint.y,
              newPoint.x,
              newPoint.y
            ) * factor[0],
          height: INITIAL_HEIGHT * factor[2],
        };
      } else if (newLines) {
        setCurrentLine(null);
      } else {
        const nearestLineIndex = findNearestLine(lines, x, y, SNAP_THRESHOLD);
        if (nearestLineIndex !== null) {
          const nearestLine = lines[nearestLineIndex];
          const { startX, startY, endX, endY } = nearestLine;
          const slope = (endY - startY) / (endX - startX);
          const intercept = startY - slope * startX;
          const snappedY = slope * x + intercept;

          newPoint.y = isNaN(snappedY) ? y : snappedY;
        }

        if (
          Math.abs(lastPoint.x - newPoint.x) >
          Math.abs(lastPoint.y - newPoint.y)
        ) {
          newLine = {
            startX: lastPoint.x,
            startY: lastPoint.y,
            endX: newPoint.x,
            endY: lastPoint.y,
            breadth: INITIAL_BREADTH * factor[1],
            len:
              distanceBetweenPoints(
                lastPoint.x,
                lastPoint.y,
                newPoint.x,
                lastPoint.y
              ) * factor[0],
            height: INITIAL_HEIGHT * factor[2],
          };
          newPoint.y = lastPoint.y;
        } else {
          newLine = {
            startX: lastPoint.x,
            startY: lastPoint.y,
            endX: lastPoint.x,
            endY: newPoint.y,
            breadth: INITIAL_BREADTH * factor[1],
            len:
              distanceBetweenPoints(
                lastPoint.x,
                lastPoint.y,
                lastPoint.x,
                newPoint.y
              ) * factor[0],
            height: INITIAL_HEIGHT * factor[2],
          };
          newPoint.x = lastPoint.x;
        }
      }

      if (!newLines && newLine) {
        dispatch(setLines([...lines, newLine]));
      }
    } else {
      setCurrentLine(null);
    }
  };

  const handleCanvasClick = (x, y) => {
    if (!isDrawing) return;

    let newPoint = activeSnap ? handleSnap(x, y) : { x, y };

    if (newLines) {
      dispatch(setEscapePoints([...escapePoints, { x, y }]));
    }

    handleLineDrawing(x, y, newPoint);

    if (rectangleDrawing) {
      // Check if rectangle drawing mode is active
      if (rectPoints.length % 2 === 1) {
        // Check if it's the second point
        const startPoint = rectPoints[rectPoints.length - 1];
        const newLine1 = {
          startX: startPoint.x,
          startY: startPoint.y,
          endX: x,
          endY: startPoint.y,
          breadth: INITIAL_BREADTH,
        };
        const newLine2 = {
          startX: x,
          startY: startPoint.y,
          endX: x,
          endY: y,
          breadth: INITIAL_BREADTH,
        };
        const newLine3 = {
          startX: x,
          startY: y,
          endX: startPoint.x,
          endY: y,
          breadth: INITIAL_BREADTH,
        };
        const newLine4 = {
          startX: startPoint.x,
          startY: y,
          endX: startPoint.x,
          endY: startPoint.y,
          breadth: INITIAL_BREADTH,
        };

        const point3 = { x, y };
        const point2 = { x: startPoint.x, y: y };
        const point4 = { x: x, y: startPoint.y };

        dispatch(setLines([...lines, newLine1, newLine2, newLine3, newLine4]));
        dispatch(setPoints([...points, point2, point3, point4]));
        dispatch(setRectPoints([...rectPoints, point2, point3, point4])); ///checkpoint

        //rectPoints.pop();
        setCurrentLine(null);
      } else if (rectPoints.length % 2 === 0) {
        dispatch(setRectPoints([...rectPoints, newPoint]));
        dispatch(setPoints([...points, newPoint]));
      }
    } else {
      dispatch(setPoints([...points, newPoint]));
    }
  };

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
    dispatch(setHelper(true)); //helper true means you have freedom to draw lines
  };

  const stopDrawing = () => {
    dispatch(setIsDrawing(false));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative",
      }}
    >
      {!is3D && (
        <DrawCanvas
          handleCanvasClick={handleCanvasClick}
          backgroundImage={backgroundImage}
          currentLine={currentLine}
          hoveredLineIndex={hoveredLineIndex}
          setHoveredLineIndex={setHoveredLineIndex}
        />
      )}
      <div
        style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2 }}
      >
        {!is3D ? (
          <>
            <button onClick={startDrawing}>Start Drawing</button>
            <button onClick={stopDrawing}>Stop Drawing</button>
            <button onClick={handleRectangle}>Rectangle</button>
            <DownloadJSONButton lines={lines} points={points} />
            <button onClick={convertLinesTo3DHandler}>Convert to 3D</button>
          </>
        ) : (
          <button onClick={handleToggleMode}>
            {is3D ? "2D Mode" : "3D Mode"}
          </button>
        )}
      </div>
      {is3D && (
        <Canvas
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            zIndex: 0,
          }}
        >
          <ambientLight intensity={1} />
          {texture && <TexturedPlane texture={texture} />}
          <AxesHelper />
          <CameraControls />
          {walls3D.map((wall, index) => (
            <Wall3D
              key={index}
              start={wall.start}
              end={wall.end}
              height={wall.height}
              width={wall.width}
            />
          ))}
        </Canvas>
      )}
    </div>
  );
};

export default App;
