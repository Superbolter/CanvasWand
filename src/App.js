import React, { useEffect, useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Grid, Line, Text, OrbitControls, Html, Lathe } from "@react-three/drei";
import BoxGeometry from "./component/BoxGeometry";
import WallGeometry from "./component/WallGeometry";
import DownloadJSONButton from "./component/ConvertToJson";
import LengthConverter from "./component/LengthConverter";
import LineEditForm from "./component/LineEditForm";
import BackgroundImage from "./component/background";
import { useDrawing } from "./hooks/useDrawing";
import {
  setPoints,
  setStoreLines,
  setPerpendicularLine,
  setFactor,
  setInformation,
  setIdSelection,
} from "./features/drawing/drwingSlice.js";
import { DraggableDoor } from "./component/DragDrop";
import ButtonComponent from "./component/ButtonComponent.js";
import DrawtoolHeader from "./component/DrawtoolHeader.js";
import WallPropertiesPopup from "./component/WallPropertiesPopup.js";
import WindowPropertiesPopup from "./component/WindowPropertiesPopup.js";
import ContextualMenu from "./component/ContextualMenu.js";
import { Provider, useSelector } from "react-redux";
import Cookies from "universal-cookie";

export const App = () => {
  const cookies=new Cookies();
  
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
  // const [cookies, setCookies] = useState([]);

  // Function to fetch cookies
  // const fetchCookies = async () => {
  //   try {
  //     const cookies = await cookieStore.getAll();
  //     setCookies(cookies);
  //   } catch (error) {
  //     console.error('Error fetching cookies:', error);
  //   }
  // };
  const {contextualMenuStatus,type_id}=useSelector((state)=>state.Drawing);
  // const parseCookies = () => {
  //   const cookieString = document.cookie;
  //   const cookies = cookieString.split('; ').reduce((acc, cookie) => {
  //     const [name, ...valueParts] = cookie.split('=');
  //     const value = valueParts.join('=');
  //     acc[name] = decodeURIComponent(value);
  //     return acc;
  //   }, {});
  //   return cookies;
  // };
  useEffect(() => {
    console.log(type_id);
    console.log(storeLines);
    // const data=cookieStore.getAll();
    // console.log(cookieStore)
    //  const curentUserSessionCookie = parseCookies();
    //  if (curentUserSessionCookie) {
    //   //  console.log(curentUserSessionCookie['LOGIN-RESPONSE']);
    //   if(curentUserSessionCookie['LOGIN-RESPONSE']){

    //     const parsedData = JSON.parse(curentUserSessionCookie['LOGIN-RESPONSE']);
    //     console.log(parsedData)
    //   }
    //  } else {
    //    console.log('No curentUserSession cookie found');
    //  }
    //  fetchCookies()
    if(storeLines.length>0){

      console.log([(storeLines[storeLines.length - 1].points[1].x + storeLines[storeLines.length - 1].points[0].x) / 2,
      (storeLines[storeLines.length - 1].points[1].y+storeLines[storeLines.length - 1].points[0].y) / 2,0])
      // console.log([
      //   (points[points.length - 1].x + currentMousePosition.x) / 2,
      //   (points[points.length - 1].y + currentMousePosition.y) / 2 + 10,
      //   0,
      // ])
    }

    if (cookies.get('USER-SESSION', { path: "/" }) !== undefined) {

			const result = cookies.get('LOGIN-RESPONSE', { path: "/" })
			console.log(result)
			
			window.curentUserSession = result;
    }
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
     
      <div style={{ position: "relative" }}>
     
        <DrawtoolHeader deleteLastPoint={deleteLastPoint} />
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
        <ButtonComponent  setNewLine={() => setNewLine(!newLine)}/>
      </div>
    </div>
  );
};

export default App;
