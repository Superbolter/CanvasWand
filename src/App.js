import React, { useState, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import AxesHelper from "./components/AxesHelper";
import CameraControls from "./components/CameraControls";
import TexturedPlane from "./components/TexturedPlane";
import Wall3D from "./components/Wall3D";
import DrawCanvas from "./components/DrawCanvas";
import { findNearestPoint, findNearestLine } from "./Utils/GeometryUtils"; // Import the utility functions
import { handleKeyDown, handleKeyUp } from "./Utils/KeyboardUtils";
import { convertLinesTo3D } from "./Utils/ConvertLinesTo3D";
import { SNAP_THRESHOLD, INITIAL_BREADTH} from "./Constant/SnapThreshold";

import * as THREE from "three";

extend({ OrbitControls });

const App = () => {
  const [lines, setLines] = useState([]);
  const [points, setPoints] = useState([]);
  const [escapePoints, setEscapePoints] = useState([]);
  const [walls3D, setWalls3D] = useState([]);
  const [is3D, setIs3D] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("./img.jpg");
  const [texture, setTexture] = useState(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [freedome, setFreedome] = useState(false);
  const [newLines, setNewLines] = useState(false);
  const [activeSnap, setActiveSnap] = useState(true);
  const [rectangleDrawing, setRectangleDrawing] = useState(false);
  const [helper, setHelper] = useState(false);
  const [rectPoints, setRectPoints] = useState([]);
  const [hoveredLineIndex, setHoveredLineIndex] = useState(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState([]);
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const loadTexture = async () => {
      const loadedTexture = await new THREE.TextureLoader().load(backgroundImage);
      setTexture(loadedTexture);
    };
    loadTexture();
  }, [backgroundImage]);

  useEffect(() => {
    const onKeyDown = (event) =>
      handleKeyDown(event, {
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
        setKeyPressed,
        selectedLineIndex,
        setSelectedLineIndex
      });
    const onKeyUp = (event) => handleKeyUp(event, { setNewLines });

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
  ]);

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
          breadth: INITIAL_BREADTH,
        };
      } else if (newLines) {
        setCurrentLine({
          startX: newPoint.x,
          startY: newPoint.y,
          endX: newPoint.x,
          endY: newPoint.y,
          breadth: INITIAL_BREADTH,
        });
      } else {
        if (!helper) {
          const nearestLineIndex = findNearestLine(lines, x, y, SNAP_THRESHOLD);
          if (nearestLineIndex !== null) {
            const nearestLine = lines[nearestLineIndex];
            const { startX, startY, endX, endY } = nearestLine;
            const slope = (endY - startY) / (endX - startX);
            const intercept = startY - slope * startX;
            const snappedY = slope * x + intercept;
            newPoint.y = snappedY;
          }

          if (Math.abs(lastPoint.x - newPoint.x) > Math.abs(lastPoint.y - newPoint.y)) {
            // Horizontal line
            newLine = {
              startX: lastPoint.x,
              startY: lastPoint.y,
              endX: newPoint.x,
              endY: lastPoint.y,
              breadth: INITIAL_BREADTH,
            };
            newPoint.y = lastPoint.y;
          } else {
            // Vertical line
            newLine = {
              startX: lastPoint.x,
              startY: lastPoint.y,
              endX: lastPoint.x,
              endY: newPoint.y,
              breadth: INITIAL_BREADTH,
            };
            newPoint.x = lastPoint.x;
          }
        }
      }

      if (!newLines) {
        setLines([...lines, newLine]);
      }
    } else {
      setCurrentLine({
        startX: newPoint.x,
        startY: newPoint.y,
        endX: newPoint.x,
        endY: newPoint.y,
        breadth: INITIAL_BREADTH,
      });
    }
  };

  const handleCanvasClick = (x, y) => {
    if (!isDrawing) return;

    let newPoint = activeSnap ? handleSnap(x, y) : { x, y };

    if (newLines) {
      setEscapePoints([...escapePoints, { x, y }]);
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
        const newLine2 = { startX: x, startY: startPoint.y, endX: x, endY: y, breadth: INITIAL_BREADTH };
        const newLine3 = { startX: x, startY: y, endX: startPoint.x, endY: y, breadth: INITIAL_BREADTH };
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

        setLines([...lines, newLine1, newLine2, newLine3, newLine4]);
        setPoints([...points, point2, point3, point4]);
        setRectPoints([...rectPoints, point2, point3, point4]); ///checkpoint

        //rectPoints.pop();
        setCurrentLine(null);
      } else if (rectPoints.length % 2 === 0) {
        console.log("Rectangle point :", { x, y });
        setRectPoints([...rectPoints, newPoint]);
        setPoints([...points, newPoint]);
      }
    } else {
      setPoints([...points, newPoint]);
    }
  };

  const handleToggleMode = () => {
    setIs3D((prevMode) => !prevMode);
  };

  const convertLinesTo3DHandler = () => {
    convertLinesTo3D(lines, setWalls3D, setIs3D);
  };

  const startDrawing = () => {
    setIsDrawing(true);
  };
  const handleRectangle = () => {
    setIsDrawing(true);
    setRectangleDrawing(true);
    setHelper(true); //helper true means you have freedom to draw lines
  };

  const stopDrawing = () => {
    setIsDrawing(false);
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
          lines={lines}
          setLines={setLines}
          backgroundImage={backgroundImage}
          points={points}
          currentLine={currentLine}
          activeSnap={activeSnap}
          rectangleDrawing={rectangleDrawing}
          rectPoints={rectPoints}
          hoveredLineIndex={hoveredLineIndex}
          setHoveredLineIndex={setHoveredLineIndex}
          selectedLineIndex={selectedLineIndex}
          setSelectedLineIndex={setSelectedLineIndex}
          keyPressed={keyPressed}
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
            position:"absolute",
            zIndex: 0,
          }}
        >
          <ambientLight intensity={1} />
          {texture && <TexturedPlane texture={texture} />}
          <AxesHelper />
          <CameraControls />
          {walls3D.map((wall, index) => (
            <Wall3D key={index} start={wall.start} end={wall.end} />
          ))}
        </Canvas>
      )}
    </div>
  );
};

export default App;

