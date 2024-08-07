import React, { useEffect } from "react";
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
import RomeDataManager from "./app/RomeDataManager.js";
import {cookies} from "./App"
import {
  setPoints,
  setStoreLines,
  setScale,
  setPerpendicularLine,
  setFactor,
  setInformation,
  setIdSelection,
} from "./features/drawing/drwingSlice.js";
import { DraggableDoor } from "./component/DragDrop.js";
import { Scale } from "./component/Scale.js";
import DrawtoolHeader from "./component/DrawtoolHeader.js";
import { useDispatch, useSelector } from "react-redux";
import { drawToolData } from "./Actions/ApplicationStateAction.js";
import ContextualMenu from "./component/ContextualMenu.js";
import ButtonComponent from "./component/ButtonComponent.js";
import WallPropertiesPopup from "./component/WallPropertiesPopup.js";
import WindowPropertiesPopup from "./component/WindowPropertiesPopup.js";
import DoorPropertiesPopup from "./component/DoorPropertiesPopup.js";
import RailingPropertiesPopup from "./component/RailingPropertiesPopup.js";
import RoomNamePopup from "./component/RoomNamePopup.js";

export const CanvasComponent = () => {
  const dispatch = useDispatch();
  const {scale} = useSelector((state) => state.drawing);
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
    redo,
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
    roomSelect,
    perpendicularLine,
    measured,
    information,
    idSelection,
    doorPosition,
    merge,setMerge,
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
    escape
  } = useDrawing();

  const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const { contextualMenuStatus, type_id, lineId } = useSelector(
    (state) => state.Drawing
  );
  const { floorplanId, drawData, storeLines, points } = useSelector(
    (state) => state.ApplicationState
  );

  useEffect(() => {
    // console.log(type_id);
    console.log(storeLines);
    console.log(points);
    console.log(lineId);
    // console.log(cookies);
    const floorplanId = getUrlParameter('floorplanId');
    console.log(floorplanId)
    RomeDataManager.instantiate();
    if (cookies.get("USER-SESSION", { path: "/" }) !== undefined) {
      const result = cookies.get("LOGIN-RESPONSE", { path: "/" });

      RomeDataManager.setUserEmail(result.email, result.persistence_token);
      window.curentUserSession = result;
    }
    
    dispatch(drawToolData(floorplanId));
  }, []);

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

          {scale && (<Scale/>)}
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
            sectionColor="white"
            fadeDistance={10000}
            infiniteGrid
            fadeStrength={1}
            fadeFrom={1}
          />
          
        </Canvas>
        
      </div>
      {!scale &&
      <div className="button-container">
        {/* 3D (Perspective) Canvas */}
        {/* <div className="perspective-canvas">
          
        </div> */}

        {/* Buttons for interaction */}
        {/* <div className="button-container1">
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
          {/*check setNewLine(true); *
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
          <button onClick={() =>{ setMerge(!merge)
            setStop(!stop);
          }}>{merge?"merge active":"merge"}</button>
          <button onClick={handleInformtion}>Information</button>
          <button onClick={() => dispatch(setScale(!scale))}>Scale</button>
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
        </div> */}
        <div style={{ position: "relative" }}>
          <DrawtoolHeader
            deleteLastPoint={deleteLastPoint}
            redo={redo}
            lines={storeLines}
            points={points}
            roomSelectors={roomSelectors}
          />
          {contextualMenuStatus && <ContextualMenu/>}
          <div
          className="perspective-canvas"
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            backgroundColor: "#ffffff",
            height: "232px",
            width: "252px",
            borderRadius: "16px",
            boxShadow: "0px 4px 14px -3px #0C0C0D21",
          }}
        >
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
              cellThickness={0}
              cellColor="black"
              sectionSize={80}
              sectionThickness={1.5}
              sectionColor="lightgray"
              fadeDistance={10000}
              infiniteGrid
            /> 

            {/* Orbit controls for 3D view */}
            <OrbitControls />
          </Canvas>
        </div>
          <WindowPropertiesPopup />
          <WallPropertiesPopup />
          <DoorPropertiesPopup />
          <RailingPropertiesPopup />
          <RoomNamePopup />
          <ButtonComponent setNewLine={escape} />
        </div>
      </div>
      }
    </div>
  );
};

export default CanvasComponent;
