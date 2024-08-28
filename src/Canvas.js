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
import RoomFiller from "./component/roomFiller.js";
import ScalePopup from "./component/ScalePopup.js";
import blade from "./assets/blade.png"
import { setShowPopup } from "./Actions/DrawingActions.js";
import UpdateDistance from "./component/updateDistance.js";

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
    undo,
    redo,
    setSelectedLines,
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
    setMerge,
    setDoorPosition,
    isDraggingDoor,
    setIsDraggingDoor,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    toggleSelectionSplitMode,
    roomSelectors,
    handlemode,
    type,
    setStop,
    setLineBreak,
    handleSaveClick,
    snappingPoint,
    showSnapLine,
    setShowSnapLine,
    setSnappingPoint,
    escape,
    deleteSelectedLines,
    room,
    showRoomNamePopup,
    handleDoubleClick,
    handleReset,
    handleMergeClick,
    nearPoint, 
    nearVal, 
    setNearVal,
    setNearPoint,
  } = useDrawing();

  const { leftPos, rightPos, merge, lineBreak } = useSelector((state) => state.drawing)
  const { storeBoxes, roomSelectorMode, selectionMode,selectedLines} = useSelector((state) => state.ApplicationState);


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

  const handleKeyDown = (event) => {
    if (event.key === "s" || event.key === "S") {
      setStop(!stop);
    }
    if((event.key === "r" || event.key === "R") && !event.ctrlKey && roomSelectorMode){
      room();
    }
    if(event.ctrlKey&&(event.key === "z" || event.key === "Z")){
      // deleteLastPoint();
      undo();
    }
    if(event.ctrlKey&&(event.key === "y" || event.key === "Y")){
      redo();
    }
    if(event.key === "escape" || event.key === "Escape" && !roomSelectorMode && !merge && !lineBreak){
      // escape();
      dispatch(setShowPopup(false))
      toggleSelectionMode();
    }
    if (selectionMode && (event.key === "Delete" || event.keyCode === 46)) {
      deleteSelectedLines();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storeLines, selectionMode, selectedLines, points, stop ,leftPos, rightPos,storeBoxes,roomSelectorMode]);

  useEffect(() => {
    // console.log(type_id);
    // console.log(cookies);
    const floorplanId = getUrlParameter('floorplanId');
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
        style={ scale? {cursor:'grab'}: lineBreak ?{cursor:`url(${blade}) 8 8, crosshair`} :selectionMode?{ cursor: "grab"}:{cursor:'crosshair'}}
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
        >{nearPoint&&(<UpdateDistance nearVal={nearVal}/>)}

          {scale && (<Scale/>)}
          {addOn && !scale && (
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
          {!scale && storeLines.map((line) => (
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
              onClick={(e) => handleLineClick(e,line.id)}
            />
          ))}

          
            {!scale && showSnapLine && snappingPoint && (
              <Line
              points={[snappingPoint[1], snappingPoint[0]]}
              color="green"
              lineWidth={5}
            />
            )}
             

          {!scale && currentMousePosition && points.length > 0 && !stop && (
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
          {!scale && storeBoxes.map((box, index) => (
            <CreateFiller key={index} p1={box.p1} p2={box.p2} p3={box.p3} p4={box.p4} />
          ))}

          {!scale && <ContextualMenu/>}

          {!scale && roomSelectorMode && roomSelectors.map((room) =>(<RoomFiller 
           key={room.roomId}
           roomName={room.roomName} 
           wallIds ={room.wallIds} 
           />))}

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
        <DrawtoolHeader
            undo={undo}
            redo={redo}
            handleSaveClick={handleSaveClick}
            handleDoubleClick={handleDoubleClick}
            handleReset={handleReset}
          />
      </div>
      {!scale ?
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
        </div>  */}
        <div style={{ position: "relative" }}>
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
            style={{ height: "100%", width: "100%" }}
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
                onClick={(e) => handleLineClick(e,line.id)}
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
          <WindowPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines}/>
          <WallPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines} toggleSelectionMode={toggleSelectionSplitMode} setSelectedLines={setSelectedLines} handleMerge={handleMergeClick} />
          <DoorPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines}/>
          <RailingPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines}/>
          <RoomNamePopup />
          <ButtonComponent setNewLine={escape} selectionMode={selectionMode} toggleSelectionMode={toggleSelectionMode} />
        </div>
      </div>
      :
      <div className="button-container">
        <ScalePopup handleDoubleClick={handleDoubleClick}/>
      </div>
      }
    </div>
  );
};

export default CanvasComponent;
