import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Line, Text, OrbitControls, OrthographicCamera, Html } from "@react-three/drei";
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
  setLinePlacementMode,
} from "./features/drawing/drwingSlice.js";
import { DraggableDoor } from "./component/DragDrop.js";
import { Scale } from "./component/Scale.js";
import DrawtoolHeader from "./component/DrawtoolHeader.js";
import { useDispatch, useSelector } from "react-redux";
import { drawToolData, setSelectedLinesState } from "./Actions/ApplicationStateAction.js";
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
import { setCameraContext, setContextualMenuStatus, setShowPopup } from "./Actions/DrawingActions.js";
import UpdateDistance from "./component/updateDistance.js";
import * as THREE from 'three';
import { Vector3, Shape, ShapeGeometry, MeshBasicMaterial,TextureLoader } from "three";
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CappedLine from "./component/CappedLine.js";


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
    addRoom,
    isSelecting,
    startPoint,
    endPoint,
    setDraggingPointIndex,
    setIsSelecting,
    setStartPoint,
    setEndPoint,
    handleResetRooms,
    raycaster,
    mouse
  } = useDrawing();

  const { leftPos, rightPos, merge, lineBreak, perpendicularLine, linePlacementMode, userLength, userWidth } = useSelector((state) => state.drawing)
  const { storeBoxes, roomSelectorMode, selectionMode,selectedLines, expandRoomPopup} = useSelector((state) => state.ApplicationState);


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

  const [zoom, setZoom] = useState(1);

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomSensitivity = 0.001; // Adjust this value to change zoom sensitivity
    const newZoom = zoom * (1 - event.deltaY * zoomSensitivity);
    setZoom(Math.max(1, Math.min(4.5, newZoom))); // Limit zoom between 0.1 and 10
  };

  const handleKeyDown = (event) => {
    if (event.key === "s" || event.key === "S") {
      setStop(!stop);
    }
    // if((event.key === "r" || event.key === "R") && !event.ctrlKey && roomSelectorMode){
    //   room();
    // }
    if((event.ctrlKey || event.metaKey)&&(event.key === "x" || event.key === "X")){
      perpendicularHandler();
    }
    if((event.ctrlKey || event.metaKey)&&(event.key === "z" || event.key === "Z")){
      // deleteLastPoint();
      undo();
    }
    if((event.ctrlKey || event.metaKey)&&(event.key === "y" || event.key === "Y")){
      redo();
    }
    if((event.ctrlKey || event.metaKey) && (event.key === "b" || event.key === "B")){
      if(linePlacementMode === "midpoint"){
        dispatch(setLinePlacementMode("below"))
      }else{
        dispatch(setLinePlacementMode("midpoint"))
      }
    }
    if(event.key === "escape" || event.key === "Escape" && !merge && !lineBreak){
      if(!roomSelectorMode){
        dispatch(setShowPopup(false))
        toggleSelectionMode()
      }else if(!selectionMode){
        setNewLine(true);
        setStop(true);
        setShowSnapLine(false);
        dispatch(setContextualMenuStatus(false))
      }
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
  }, [storeLines, selectionMode, selectedLines, points, stop ,leftPos, rightPos,storeBoxes,roomSelectorMode, perpendicularLine]);

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

  // const { camera, scene } = useThree();
  

  const createQuadrilateral = (p1, p2, p3, p4) => {
    const shape = new Shape();
    shape.moveTo(p1.x, p1.y);
    shape.lineTo(p2.x, p2.y);
    shape.lineTo(p3.x, p3.y);
    shape.lineTo(p4.x, p4.y);
    shape.lineTo(p1.x, p1.y); // Close the shape by going back to the first point
    return shape;
  };

  

  return (
    <div className="container">
      <div
        className="canvas-container"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        // onWheel={handleWheel}
        style={ scale? {cursor:'grab'}: lineBreak ?{cursor:`url(${blade}) 8 8, crosshair`} :selectionMode? roomSelectorMode? {cursor:"pointer"} :{ cursor: "grab"}:{cursor:'crosshair'}}
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

          <CameraController zoom={zoom} setZoom={setZoom} scale={scale} userLength={userLength} userWidth={userWidth}/>
          {isSelecting && startPoint && endPoint && (
            <mesh >
              <shapeGeometry  attach="geometry" args={[createQuadrilateral(startPoint,new Vector3(endPoint.x, startPoint.y,0) ,endPoint,new Vector3(startPoint.x, endPoint.y,0) )]} />
              <meshBasicMaterial color={"rgba(0, 0, 255, 0.2)"} transparent={true} opacity={0.2}/>
            </mesh>
          )}
          {nearPoint && lineBreak && (<UpdateDistance nearVal={nearVal}/>)}

          {scale && (<Scale raycaster={raycaster}  mouse={mouse} />)}
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
          {/* {!scale && <BoxSegments lines={storeLines}/>} */}
          {!scale && 
          // <LineSegments lines={storeLines} />
          // <BoxSegments lines={storeLines} />
            <CappedLine lines={storeLines} />
          }
          

          
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

          {!scale && <ContextualMenu selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines} toggleSelectionMode={toggleSelectionSplitMode} setSelectedLines={setSelectedLines} handleMerge={handleMergeClick} setMerge={setMerge} setLineBreak={setLineBreak}/>}

          {!scale && roomSelectorMode && roomSelectors.map((room, index) =>(<RoomFiller 
           key={room.roomId}
           roomName={room.roomName} 
           roomType={room?.roomType}
           wallIds ={room.wallIds} 
           index={index}
           />))}

          {/* 2D grid */}
          <Grid
            rotation={[Math.PI / 2, 0, 0]}
            cellSize={10}
            cellThickness={0}
            //cellColor="gray"
            sectionSize={10}
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
            handleResetRooms={handleResetRooms}
          />

          {scale && !(userLength===0 || userWidth===0 || userLength===undefined || userWidth===undefined || userLength==="" || userWidth==="") ? null:
            <ZoomComponent zoom={zoom} setZoom={setZoom}/>          
          }
      </div>
      {!scale ?
      <div className="button-container">
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
            orthographic
            camera={{ position: [0, 0, 800], fov: 75, }}
          >
            <OrthographicCamera makeDefault zoom={0.15} position={[0, 0, 800]} />

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
                typeId={line.typeId}
                isSelected={selectedLines.includes(line.id)}
                isChoose={idSelection.includes(line.id)}
                onClick={(e) => handleLineClick(e,line.id)}
              />
            ))}

            {/* 3D grid */}
            <Grid
              rotation={[Math.PI / 2, 0, 0]}
              cellSize={10}
              cellThickness={0}
              cellColor="black"
              sectionSize={80}
              sectionThickness={1.5}
              sectionColor="lightgray"
              fadeDistance={10000}
              infiniteGrid
            /> 

            {/* Orbit controls for 3D view */}
            <OrbitControls
              enablePan={false} // Disable panning if needed
              // maxPolarAngle={Math.PI / 2} // Limit vertical rotation to 90 degrees (horizontal plane)
              // minPolarAngle={Math.PI / 2} // Limit vertical rotation to 90 degrees (horizontal plane)
              maxAzimuthAngle={Math.PI / 3} // Optional: Limit horizontal rotation range if needed
              minAzimuthAngle={-Math.PI / 3} // Optional: Limit horizontal rotation range if needed
            />
          </Canvas>
        </div>
          <WindowPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines}/>
          <WallPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines} toggleSelectionMode={toggleSelectionSplitMode} setSelectedLines={setSelectedLines} handleMerge={handleMergeClick} />
          <DoorPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines}/>
          <RailingPropertiesPopup selectionMode={selectionMode} deleteSelectedLines={deleteSelectedLines}/>
          <RoomNamePopup toggleSelectionMode={toggleSelectionMode} addRoom={addRoom} />
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

const CameraController = ({zoom, setZoom, scale, userLength, userWidth }) => {
  const { camera } = useThree();
  const dispatch = useDispatch();
  const {cameraContext} = useSelector((state) => state.Drawing);
  useEffect(() => {
    if(Object.keys(cameraContext).length === 0) {
      dispatch(setCameraContext(camera));
    }
  }, []);
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.addEventListener('change', () => {
        const { target } = controls;
        target.clamp(controls.minPan, controls.maxPan);
      });
    }
  }, []);

  useEffect(() => {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
      const newContext = camera.clone();
      dispatch(setCameraContext(newContext));
  }, [zoom]);

  const handleControlsChange = () => {
    setZoom(camera.zoom);
  };

  return (
    <OrbitControls 
      ref={controlsRef}
      enableRotate={false} 
      enableZoom={scale && !(userLength===0 || userWidth===0 || userLength===undefined || userWidth===undefined || userLength==="" || userWidth==="")? false:true}
      minZoom={1}  
      maxZoom={4.5} 
      minPan={new THREE.Vector3(-100 * camera.zoom, -100 * camera.zoom, 0)}
      maxPan={new THREE.Vector3(100 * camera.zoom, 100 * camera.zoom, 0)}
      onChange={handleControlsChange}
      maxAzimuthAngle={Math.PI / 100}
      minAzimuthAngle={-Math.PI / 100}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
    />
  );
};

const ZoomComponent = ({ zoom, setZoom }) => {

  return (
    <div className="zoom-container">
      <button onClick={() => setZoom(Math.max((zoom - 0.5), 1))}>
        <ZoomOutIcon />
      </button>
      <input className="zoom-slider" type="range" min="1" max="4.5" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} style={{
        background: `linear-gradient(to right, #007AFF 0%, #007AFF ${(zoom - 1) / 3.5 * 100}%, #0000000D ${(zoom - 1) / 3.5 * 100}%, #0000000D 100%)`
      }}/>
      <button onClick={() => setZoom(Math.min((zoom + 0.5), 4.5))}>
        <ZoomInIcon />
      </button>
    </div>
  );
}

function LineSegments({ lines }) {
  const geometries = lines.map((line) => {
    return new THREE.BufferGeometry().setFromPoints(line.points);
  });

  return (
    <>
      {geometries.map((geometry, index) => (
        <lineSegments
          key={index}
          geometry={geometry}
          material={new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 20 })}
        />
      ))}
    </>
  );
}

function BoxSegments({ lines }) {
  return (
    <>
      {lines.map((line, index) => {
        const length = line.points[0].distanceTo(line.points[1]);
        const midpoint = new THREE.Vector3().addVectors(line.points[0], line.points[1]).multiplyScalar(0.5);
        const angle = Math.atan2(line.points[1].y - line.points[0].y, line.points[1].x - line.points[0].x);

        return (
          <mesh
            key={index}
            position={midpoint}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[length, 20, 0.1]} />
            <meshBasicMaterial color={0x000000} />
          </mesh>
        );
      })}
    </>
  );
}