import React, { useState, useEffect } from "react";
import { extend } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import convert from 'convert-units';
import UIControls from "./components/UiComponent";
import CanvasDrawing from "./components/CanvasDrawing";
import * as THREE from "three";


import {
  setLines,
  setPoints,
  setEscapePoints,
  setFreedome,
  setNewLines,
  setActiveSnap,
  setRectangleDrawing,
  setRectPoints,
  setHoveredLineIndex,
  setKeyPressed,
  setSelectedLineIndex,
} from "./features/drawing/drwingSlice";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DrawCanvas from "./components/DrawCanvas";
import {
  findNearestPoint,
  findNearestLine,
  distanceBetweenPoints,
  uniqueId,
} from "./Utils/GeometryUtils";
import { handleKeyDown, handleKeyUp } from "./Utils/KeyboardUtils";
import {
  SNAP_THRESHOLD,
  INITIAL_BREADTH,
  INITIAL_HEIGHT,
} from "./Constant/SnapThreshold";

extend({ OrbitControls });

const App = () => {
  const [currentLine, setCurrentLine] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("./img.jpg");
  const [texture, setTexture] = useState(null);



  const dispatch = useDispatch();
  const {
    lines,
    points,
    escapePoints,
    is3D,
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
    measured,
  } = useSelector((state) => state.drawing);

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

  useEffect(() => {
    const loadTexture = async () => {
      const loadedTexture = await new THREE.TextureLoader().load(
        backgroundImage
      );
      setTexture(loadedTexture);
    };
    loadTexture();
  }, [backgroundImage]);

  const handleSnap = (x, y) => {
    const nearestPoint = findNearestPoint(points, x, y, SNAP_THRESHOLD);
    return nearestPoint ? { x: nearestPoint.x, y: nearestPoint.y ,id:nearestPoint.id} : { x, y ,id:uniqueId()};
  };

  const handleLineDrawing = (x, y, newPoint) => {
    if (points.length > 0 && !helper) {
      const lastPoint = points[points.length - 1];
      const lastPointId = lastPoint.id;
      let newLine;

      if (freedome) {
        newLine = {
          startX: lastPoint.x,
          startY: lastPoint.y,
          endX: newPoint.x,
          endY: newPoint.y,
          startId: lastPointId,
          endId: newPoint.id,
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
            startId: lastPointId,
            endId: newPoint.id,
            breadth: INITIAL_BREADTH * factor[1],
            len:convert(distanceBetweenPoints(
              lastPoint.x,
              lastPoint.y,
              newPoint.x,
              lastPoint.y
            ) * factor[0]).from(measured).to('mm'),
            height: INITIAL_HEIGHT * factor[2],
          };
          newPoint.y = lastPoint.y;
        } else {
          newLine = {
            startX: lastPoint.x,
            startY: lastPoint.y,
            endX: lastPoint.x,
            endY: newPoint.y,
            startId: lastPointId,
            endId: newPoint.id,
            breadth: INITIAL_BREADTH * factor[1],
            len:
            convert(distanceBetweenPoints(
              lastPoint.x,
              lastPoint.y,
              newPoint.x,
              lastPoint.y
            ) * factor[0]).from(measured).to('mm'),
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

    let newPoint = activeSnap ? handleSnap(x, y) : { x, y,id:uniqueId() };

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
      <UIControls/>
      <CanvasDrawing texture={texture}/>
    </div>
  );
};

export default App;
