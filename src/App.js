import React, { useEffect, useState } from "react";
import "./App.css";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Line, Text } from "@react-three/drei";
import convert from "convert-units";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "./constant/constant.js";
import { useDispatch, useSelector } from "react-redux";
import DownloadJSONButton from "./component/ConvertToJson.js";
import { getLineIntersection } from "./utils/intersect.js";
import {
  setPoints,
  setStoreLines,
  setPerpendicularLine,
  setFactor,
  setMeasured,
  setInformation,
  setIdSelection,
} from "./features/drawing/drwingSlice.js";
import { uniqueId, calculateAlignedPoint } from "./utils/uniqueId";
import { snapToPoint } from "./utils/snapping.js";
import { Vector3 } from "three";
import BoxGeometry from "./component/BoxGeometry.js"; // Import the BoxGeometry component
import WallGeometry from "./component/WallGeometry.js";
import { LengthConverter } from "./component/LengthConverter.js";
import LineEditForm from "./component/LineEditForm.js";
import BackgroundImage from "./component/background.js";
export const App = () => {
  const dispatch = useDispatch();
  const {
    points,
    storeLines,
    idSelection,
    perpendicularLine,
    factor,
    measured,
    information,
  } = useSelector((state) => state.drawing);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedLines, setSelectedLines] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [newLine, setNewLine] = useState(false);
  const [currentMousePosition, setCurrentMousePosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [stop, setStop] = useState(false);

  const addPoint = (newPoint, startPoint) => {

    console.log('hello', newPoint, startPoint);
    let newLine = {
      id: uniqueId(),
      points: [startPoint, newPoint],
      length: convert(startPoint.distanceTo(newPoint) * factor[0])
        .from(measured)
        .to("mm"),
      width: convert(INITIAL_BREADTH / factor[1])
        .from(measured)
        .to("mm"),
      height: convert(INITIAL_HEIGHT / factor[2])
        .from(measured)
        .to("mm"),
      widthchangetype: "between",
      widthchange: 0,
    };
  
    let updatedStoreLines = [...storeLines];
    let intersections = [];
    let newPoints = [...points];
  
    // Collect all intersections
    storeLines.forEach((line) => {
      const intersection = getLineIntersection(
        line.points[0],
        line.points[1],
        startPoint,
        newPoint
      );
      if (intersection) {
        intersections.push({ line, intersection });
      }
    });

    console.log("intersection points",intersections);
  
    // Sort intersections based on their distance from startPoint along the new line
    intersections.sort((a, b) =>
      startPoint.distanceTo(a.intersection) - startPoint.distanceTo(b.intersection)
    );
  
    let currentStartPoint = startPoint;
  
    // Store new segments of the new line
    intersections.forEach(({ intersection }) => {
      const splitNewLine = {
        ...newLine,
        id: uniqueId(),
        points: [currentStartPoint, intersection],
      };
      splitNewLine.length = convert(
        splitNewLine.points[0].distanceTo(splitNewLine.points[1]) * factor[0]
      )
        .from(measured)
        .to("mm");
  
      updatedStoreLines.push(splitNewLine);
  
      // Update the currentStartPoint for the next segment
      currentStartPoint = intersection;
      newPoints.push(currentStartPoint);
    });
  
    // Add the final segment of the new line
    const finalNewLineSegment = {
      ...newLine,
      id: uniqueId(),
      points: [currentStartPoint, newPoint],
    };
    finalNewLineSegment.length = convert(
      finalNewLineSegment.points[0].distanceTo(finalNewLineSegment.points[1]) * factor[0]
    )
      .from(measured)
      .to("mm");
  
    updatedStoreLines.push(finalNewLineSegment);
    newPoints.push(newPoint);
  
    // Also handle splitting the existing lines at the intersection points
    intersections.forEach(({ line, intersection }) => {
      const splitLine1 = {
        ...line,
        id: uniqueId(),
        points: [line.points[0], intersection],
      };
      const splitLine2 = {
        ...line,
        id: uniqueId(),
        points: [intersection, line.points[1]],
      };
  
      // Calculate lengths for new segments
      splitLine1.length = convert(
        splitLine1.points[0].distanceTo(splitLine1.points[1]) * factor[0]
      )
        .from(measured)
        .to("mm");
      splitLine2.length = convert(
        splitLine2.points[0].distanceTo(splitLine2.points[1]) * factor[0]
      )
        .from(measured)
        .to("mm");
  
      // Replace the old line with the new segments
      const lineIndex = updatedStoreLines.findIndex((l) => l.id === line.id);
      updatedStoreLines.splice(lineIndex, 1, splitLine1, splitLine2);

      // Insert the intersection point into the points array
    const startIdx = newPoints.findIndex(point => point.equals(line.points[0]));
    const endIdx = newPoints.findIndex(point => point.equals(line.points[1]));
    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
      newPoints.splice(startIdx + 1, 0, intersection);
    }
    });
    dispatch(setPoints(newPoints));
  
    dispatch(setStoreLines(updatedStoreLines));
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
      if (event.key === "s" || event.key === "S") {
        setStop(!stop);
      }
      if (selectionMode && (event.key === "Delete" || event.keyCode === 46)) {
        deleteSelectedLines();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storeLines, selectionMode, selectedLines, points, stop]);

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
    if (newLine) {
      setNewLine(false);
      const newPoint = [...points, point];
      dispatch(setPoints(newPoint));
      return;
    }

    if (perpendicularLine && points.length > 0) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }
    point = snapToPoint(point, points, storeLines); //snapping
    const newPoints = [...points, point];
    dispatch(setPoints(newPoints));

    if (newPoints.length >= 2) {
      addPoint(point, newPoints[newPoints.length - 2]);
    }

    if (newPoints.length === 2 && firstTime) {
      setFirstTime(false);
      const userHeight = parseFloat(
        prompt("Enter the height of the first line:")
      );
      const userLength = parseFloat(
        prompt("Enter the length of the first line:")
      );
      const userWidth = parseFloat(
        prompt("Enter the thickness of the first line:")
      );
      const lfactor =
        userLength / point.distanceTo(newPoints[newPoints.length - 2]);
      const wfactor = INITIAL_BREADTH / userWidth;
      const hfactor = INITIAL_HEIGHT / userHeight;
      dispatch(setFactor([lfactor, wfactor, hfactor]));

      dispatch(setPoints([]));
      dispatch(setStoreLines([]));
    }
    setCurrentMousePosition(null); // Clear the temporary line on click
    setDistance(0); // Reset distance display
  };

  const handleMouseMove = (event) => {
    if (points.length === 0 || stop || newLine) return; // No point to start from or not in perpendicular mode

    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    let point = new Vector3(posX, posY, 0);

    if (perpendicularLine) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }

    setCurrentMousePosition(point);

    const lastPoint = points[points.length - 1];
    const currentDistance = lastPoint.distanceTo(point);
    setDistance(currentDistance * factor[0]);
  };

  const handleLineClick = (id) => {
    if (selectionMode) {
      setSelectedLines((prev) =>
        prev.includes(id)
          ? prev.filter((lineId) => lineId !== id)
          : [...prev, id]
      );
    }
    //dispatch(setIdSelection([...selectedLines]));
  };
  const handleInformtion = () => {
    setSelectionMode(!selectionMode);
    dispatch(setInformation(!information));
  };

  useEffect(() => {
    //console.log("Points updated:", points);
  }, [points]);

  return (
    <div className="container">
      <div className="canvas-container" onMouseMove={handleMouseMove}>
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
          <BackgroundImage />
          {/* Render lines in 2D view */}
          {storeLines.map((line) => (
            <BoxGeometry
              key={line.id}
              start={line.points[0]}
              end={line.points[1]}
              dimension={{ width: line.width, height: line.height }}
              widthchange={line.widthchange}
              widthchangetype={line.widthchangetype}
              isSelected={selectedLines.includes(line.id)}
              onClick={() => handleLineClick(line.id)}
            />
          ))}

          {currentMousePosition && points.length > 0 && !stop && (
            <>
              <Line
                points={[points[points.length - 1], currentMousePosition]}
                color="blue"
                lineWidth={5}
              />
              <Text
                position={[
                  (points[points.length - 1].x + currentMousePosition.x) / 2,
                  (points[points.length - 1].y + currentMousePosition.y) / 2 +
                    10,
                  0,
                ]}
                color="black"
                anchorX="center"
                anchorY="middle"
                fontSize={10}
                fontWeight="bold"
              >
                {`${distance.toFixed(2)} ${measured}`}
              </Text>
            </>
          )}

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
            camera={{ position: [0, 0, 800], fov: 75 }}
          >
            {/* Render lines in 3D view */}
            {storeLines.map((line) => (
              <WallGeometry
                key={line.id}
                start={line.points[0]}
                end={line.points[1]}
                dimension={{ width: line.width, height: line.height }}
                widthchange={line.widthchange}
                widthchangetype={line.widthchangetype}
                isSelected={selectedLines.includes(line.id)}
                isChoose={idSelection.includes(line.id)}
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
            />

            {/* Orbit controls for 3D view */}
            <OrbitControls />
          </Canvas>
        </div>

        {/* Buttons for interaction */}
        <div className="button-container1">
          <button onClick={deleteLastPoint}>Delete Last Point</button>
          <button
            onClick={() => {
              setNewLine(true);
            }}
          >
            {newLine ? "NewLineAdded" : "Add New Line"}
          </button>
          <button onClick={perpendicularHandler}>
            {perpendicularLine
              ? "Perpendicular Line"
              : "Not Perpendicular Line"}
          </button>
          <button onClick={toggleSelectionMode}>
            {selectionMode ? "Cancel Select and Delete" : "Select and Delete"}
          </button>
          <button onClick={handleInformtion}>Information</button>
          <DownloadJSONButton lines={storeLines} points={points} />
          <LengthConverter />
          {information && (
            <LineEditForm
              selectedLines={selectedLines}
              setSelectedLines={setSelectedLines}
              setSelectionMode={setSelectionMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
