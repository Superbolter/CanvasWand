import React, { useEffect, useState } from "react";
import "./App.css";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import {
  setPoints,
  setStoreLines,
  setPerpendicularLine,
} from "./features/drawing/drwingSlice.js";
import { uniqueId, calculateAlignedPoint } from "./utils/uniqueId";
import { Vector3 } from "three";
import BoxGeometry from "./component/BoxGeometry.js"; // Import the BoxGeometry component
import WallGeometry from "./component/WallGeometry.js"; 

export const App = () => {
  const dispatch = useDispatch();
  const { points, storeLines, perpendicularLine } = useSelector(
    (state) => state.drawing
  );

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedLines, setSelectedLines] = useState([]);

  const addPoint = (newPoint, startPoint) => {
    const newLine = {
      id: uniqueId(),
      points: [startPoint, newPoint],
      length: startPoint.distanceTo(newPoint),
    };
    dispatch(setStoreLines([...storeLines, newLine]));
  };

  const deleteLastPoint = () => {
    const updatedLines = storeLines.slice(0, -1);
    const updatedPoints = points.slice(0, -1);
    dispatch(setStoreLines(updatedLines));
    dispatch(setPoints(updatedPoints));
  };

  const deleteSelectedLines = () => {
    const updatedLines = storeLines.filter(
      (line) => !selectedLines.includes(line.id)
    );
    const pointsToKeep = [];

    updatedLines.forEach((line) => {
      pointsToKeep.push(line.points[0], line.points[1]);
    });

    const updatedPoints = points.filter((point) =>
      pointsToKeep.some((p) => p.equals(point))
    );

    dispatch(setStoreLines(updatedLines));
    dispatch(setPoints(updatedPoints));
    setSelectedLines([]);
  };

  const perpendicularHandler = () => {
    dispatch(setPerpendicularLine(!perpendicularLine));
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedLines([]);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "x" || event.key === "X") {
        deleteLastPoint();
      }
      if (selectionMode && (event.key === "a" || event.key === "A")) {
        deleteSelectedLines();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storeLines, selectionMode, selectedLines, points]);

  const handleClick = (event) => {
    if (selectionMode) return; // Prevent drawing new lines in selection mode

    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    let point = new Vector3(posX, posY, 0);

    if (perpendicularLine && points.length > 0) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }
    const newPoints = [...points, point];
    dispatch(setPoints(newPoints));

    if (newPoints.length >= 2) {
      addPoint(point, newPoints[newPoints.length - 2]);
    }
  };

  const handleLineClick = (id) => {
    if (selectionMode) {
      setSelectedLines((prev) =>
        prev.includes(id)
          ? prev.filter((lineId) => lineId !== id)
          : [...prev, id]
      );
    }
  };

  useEffect(() => {
    console.log("Points updated:", points);
  }, [points]);

  return (
    <div className="container">
      <div className="canvas-container">
        {/* 2D (Orthographic) Canvas */}
        <Canvas
          style={{
            height: window.innerHeight,
            width: "100%",
            background: "#f0f0f0",
          }}
          orthographic
          raycaster={{ params: { Line: { threshold: 5 } } }}
          camera={{ position: [0, 0, 500], zoom: 1 }}
          onClick={handleClick}
        >
          {/* Render lines in 2D view */}
          {storeLines.map((line) => (
            <BoxGeometry
              key={line.id}
              start={line.points[0]}
              end={line.points[1]}
              isSelected={selectedLines.includes(line.id)}
              onClick={() => handleLineClick(line.id)}
            />
          ))}
          
          {/* 2D grid */}
          <Grid
            rotation={[Math.PI / 2, 0, 0]}
            cellSize={100}
            cellThickness={2}
            cellColor="red"
            sectionSize={20}
            sectionThickness={1.5}
            sectionColor="lightgray"
            fadeDistance={10000}
            infiniteGrid
            fadeStrength={1}
            fadeFrom={1}
          />
        </Canvas>
      </div>

      <div className="button-container">
        {/* 3D (Perspective) Canvas */}
        <div className="perspective-canvas">
          <Canvas
            style={{ height: 400, width: "100%" }}
            camera={{ position: [0,0, 800], fov: 75 }}

          >
            {/* Render lines in 3D view */}
            {storeLines.map((line) => (
              <WallGeometry
                key={line.id}
                start={line.points[0]}
                end={line.points[1]}
                isSelected={selectedLines.includes(line.id)}
                onClick={() => handleLineClick(line.id)}
              />
            ))}
            
            {/* 3D grid */}
            <Grid
              rotation={[Math.PI / 2, 0, 0]}
              cellSize={100}
              cellThickness={2}
              cellColor="red"
              sectionSize={20}
              sectionThickness={1.5}
              sectionColor="lightgray"
              fadeDistance={10000}
              infiniteGrid
              //fadeStrength={1}
              //fadeFrom={1}
            />
            
            {/* Orbit controls for 3D view */}
            <OrbitControls />
          </Canvas>
        </div>
        
        {/* Buttons for interaction */}
        <div className="button-container1">
          <button onClick={deleteLastPoint}>Delete Last Point</button>
          <button onClick={perpendicularHandler}>
            {perpendicularLine ? "Perpendicular Line" : "Not Perpendicular Line"}
          </button>
          <button onClick={toggleSelectionMode}>
            {selectionMode ? "Cancel Select and Delete" : "Select and Delete"}
          </button>
          <button>Dummy Button 2</button>
          <button>Dummy Button 3</button>
          <button>Dummy Button 2</button>
          <button>Dummy Button 3</button>
          <button>Dummy Button 2</button>
          <button>Dummy Button 3</button>
          <button>Dummy Button 2</button>
          <button>Dummy Button 3</button>
          <button>Dummy Button 2</button>
          <button>Dummy Button 3</button>
          <button>Dummy Button 2</button>
          <button>Dummy Button 3</button>
          <button>Dummy Button 2</button>
          <button>Dummy Button 3</button>

        </div>
      </div>
    </div>
  );
};

export default App;