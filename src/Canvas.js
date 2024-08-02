import React from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Grid, Line, Text, OrbitControls } from "@react-three/drei";
import BoxGeometry from "./component/BoxGeometry.js";
import WallGeometry from "./component/WallGeometry.js";
import DownloadJSONButton from "./component/ConvertToJson.js";
import LengthConverter from "./component/LengthConverter.js";
import LineEditForm from "./component/LineEditForm.js";
import BackgroundImage from "./component/background.js";
import { useDrawing } from "./hooks/useDrawing.js";
import CreateFiller from "./component/filler.js";


import {
  setPoints,
  setStoreLines,
  setPerpendicularLine,
  setFactor,
  setInformation,
  setIdSelection,
} from "./features/drawing/drwingSlice.js";
import { DraggableDoor } from "./component/DragDrop.js";

export const CanvasComponent = () => {
  const {
    handleClick,
    handleMouseMove,
    addOn,
    handleLineClick,
    handleInformtion,
    deleteLastPoint,
    handleMouseDown,
    handleMouseUp,
    toggleSelectionMode,
    perpendicularHandler,
    newLine,
    setNewLine,
    selectionMode,
    selectedLines,
    setSelectedLines,
    setSelectionMode,
    toggleDragMode,
    toggleDoorWindowMode,
    doorWindowMode,
    dragMode,
    currentMousePosition,
    distance,
    stop,
    points,
    storeLines,
    roomSelect,
    perpendicularLine,
    measured,
    information,
    idSelection,
    doorPosition,
    setDoorPosition,
    isDraggingDoor,
    setIsDraggingDoor,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    toggleSelectionroomMood,
    roomSelectors,
    handlemode,
    type,
    setStop,
    lineBreak,
    setLineBreak,

    snappingPoint,
    showSnapLine,
    setShowSnapLine,
    setSnappingPoint,
  } = useDrawing();

  return (
    <div className="container">
      <div
        className="canvas-container"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
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
          {addOn && (
            <DraggableDoor
              doorPosition={doorPosition}
              setDoorPosition={setDoorPosition}
              setIsDraggingDoor={setIsDraggingDoor}
              isDraggingDoor={isDraggingDoor}
              handlePointerDown={handlePointerDown}
              handlePointerUp={handlePointerUp}
              setStoreLines={setStoreLines}
              storeLines={storeLines}
            />
          )}
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
              type={line.type}
              isSelected={selectedLines.includes(line.id)}
              onClick={() => handleLineClick(line.id)}
            />
          ))}

          
            {showSnapLine && snappingPoint && (
              <Line
              points={[snappingPoint[1], snappingPoint[0]]}
              color="green"
              lineWidth={5}
            />
            )}
             

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

          <CreateFiller/>

          {/* 2D grid */}
          <Grid
            rotation={[Math.PI / 2, 0, 0]}
            cellSize={100}
            cellThickness={0}
            //cellColor="gray"
            sectionSize={40}
            //sectionThickness={1.5}
            sectionColor="gray"
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
                type={line.type}
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
          <button onClick={toggleSelectionroomMood}>
            {roomSelect ? "selectingRoom" : "roomSelecter"}
          </button>
          <button onClick={() => {setNewLine(!newLine)
            setStop(!stop);
          }}>
            {newLine ? "NewLineAdded" : "Add New Line"}
          </button>
          <button onClick={() =>{ setLineBreak(!lineBreak)
            setStop(!stop);
          }}>
            {lineBreak ? "breaking start" : "Break"}
          </button>
          {/*check setNewLine(true); */}
          <button onClick={perpendicularHandler}>
            {perpendicularLine
              ? "Perpendicular Line"
              : "Not Perpendicular Line"}
          </button>
          <button onClick={toggleSelectionMode}>
            {selectionMode && !roomSelect
              ? "Cancel Select and Delete"
              : "Select and Delete"}
          </button>
          <button onClick={toggleDragMode}>
            {dragMode ? "Disable Drag Mode" : "Enable Drag Mode"}
          </button>
          <button onClick={handleInformtion}>Information</button>
          <button onClick={handlemode}>
            {type === "imaginary" ? "imaginary line" : "real line"}
          </button>
          <button onClick={toggleDoorWindowMode}>
            {doorWindowMode === "none"
              ? "Add Door"
              : doorWindowMode === "door"
              ? "Place Door"
              : "Door Mode"}
          </button>
          <DownloadJSONButton
            lines={storeLines}
            points={points}
            roomSelectors={roomSelectors}
          />
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

export default CanvasComponent;
