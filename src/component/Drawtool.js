import React, { useEffect, useState } from "react";
import "../App.css";
import { Canvas } from "@react-three/fiber";
import { Grid, Line, Text, OrbitControls, Html, Lathe } from "@react-three/drei";
import BoxGeometry from "./BoxGeometry";
import WallGeometry from "./WallGeometry";
// import DownloadJSONButton from "./component/ConvertToJson";
import LengthConverter from "./LengthConverter";
import LineEditForm from "./LineEditForm";
import BackgroundImage from "./background";
import { useDrawing } from "../hooks/useDrawing.js"
import {
  setPoints,
  setStoreLines,
  setPerpendicularLine,
  setFactor,
  setInformation,
  setIdSelection,
} from "../features/drawing/drwingSlice.js";
import { DraggableDoor } from "./DragDrop";
import ButtonComponent from "./ButtonComponent.js";
import DrawtoolHeader from "./DrawtoolHeader.js";
import WallPropertiesPopup from "./WallPropertiesPopup.js";
import WindowPropertiesPopup from "./WindowPropertiesPopup.js";
import ContextualMenu from "./ContextualMenu.js";
import { Provider, useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import DoorPropertiesPopup from "./DoorPropertiesPopup.js";
import RailingPropertiesPopup from "./RailingPropertiesPopup.js";
import { setLineId } from "../Actions/DrawingActions.js";
import { drawToolData } from "../Actions/ApplicationStateAction.js";
import RomeDataManager from "../app/RomeDataManager.js";

export const cookies=new Cookies();
export const Drawtool = () => {
  
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

    snappingPoint,
    showSnapLine,
    setShowSnapLine,
    setSnappingPoint,
  } = useDrawing();
  
  const {contextualMenuStatus,type_id,lineId}=useSelector((state)=>state.Drawing);
  const {floorplanId,drawData}=useSelector((state)=>state.ApplicationState);
  const dispatch=useDispatch()
  useEffect(() => {
    
   
    console.log(drawData)
    if(storeLines.length>0){
      dispatch(setLineId(storeLines[storeLines.length-1].id));
      console.log([(storeLines[storeLines.length - 1].points[1].x + storeLines[storeLines.length - 1].points[0].x) / 2,
      (storeLines[storeLines.length - 1].points[1].y+storeLines[storeLines.length - 1].points[0].y) / 2,0])
      
    }
    const lines = drawData&&drawData.lines&&drawData.lines.map(line => ({
      id: line.id,
      points: [
          { x: line.startPoint.x, y: line.startPoint.y, z: line.startPoint.z },
          { x: line.endPoint.x, y: line.endPoint.y, z: line.endPoint.z }
      ],
      length: line.length,
      width: line.width,
      height: line.height,
      widthchangetype: line.widthchangetype,
      widthchange: line.widthchange,
      type: line.type,
      typeId:line.typeId
  }));
  console.log(lines)
     if(lines)
     dispatch(setStoreLines(lines))
  
  }, [storeLines]);

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
            background: "#FAFAFA",
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
              typeId={line.typeId}
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
                  (points[points.length - 1].y + currentMousePosition.y) / 2 + 10,
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
            cellThickness={0}
            sectionSize={40}
            sectionColor="lightgrey"
            fadeDistance={10000}
            infiniteGrid
            fadeStrength={1}
            fadeFrom={1}
          />

          
        </Canvas>
      </div>

      <div className="button-container">
        {/* 3D (Perspective) Canvas */}
        {/* Buttons for interaction */}
        <div className="button-container1">
          <button onClick={deleteLastPoint}>Delete Last Point</button>
          <button onClick={toggleSelectionroomMood}>
            {roomSelect ? "selectingRoom" : "roomSelecter"}
          </button>
          <button onClick={() => setNewLine(!newLine)}>
            {newLine ? "NewLineAdded" : "Add New Line"}
          </button>
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
          {/* <DownloadJSONButton
            lines={storeLines}
            points={points}
            roomSelectors={roomSelectors}
          /> */}
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
     
      <div style={{ position: "relative" }}>
     
        <DrawtoolHeader deleteLastPoint={deleteLastPoint} lines={storeLines}
            points={points}
            roomSelectors={roomSelectors}/>
        {contextualMenuStatus&&<ContextualMenu />}
        <div className="perspective-canvas" style={{ position: "absolute", right: "20px", top: "20px", backgroundColor: "#ffffff", height: "232px", width: "252px", borderRadius: "16px",boxShadow: "0px 4px 14px -3px #0C0C0D21" }}>
          <Canvas
            style={{ height: "100%", width: "100%", borderRadius: "12px" }}
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
              cellThickness={0}
              sectionSize={80}
              sectionColor="lightgrey"
              fadeDistance={10000}
              infiniteGrid
              fadeStrength={1}
              fadeFrom={10}
            />

            {/* Orbit controls for 3D view */}
            <OrbitControls />
          </Canvas>
        </div>
        <WindowPropertiesPopup />
        <WallPropertiesPopup />
        <DoorPropertiesPopup/>
        <RailingPropertiesPopup/>
        <ButtonComponent  setNewLine={() => setNewLine(!newLine)}/>
      </div>
    </div>
  );
};

export default Drawtool;
