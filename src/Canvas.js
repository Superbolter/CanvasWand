import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Grid,
  Line,
  Text,
  OrbitControls,
  OrthographicCamera,
  Html,
} from "@react-three/drei";
import BoxGeometry from "./component/Geometry/BoxGeometry.js";
import WallGeometry from "./component/Geometry/WallGeometry.js";
import BackgroundImage from "./component/CanvasOverLays/background.js";
import { useDrawing } from "./hooks/useDrawing.js";
import { useActions } from "./hooks/useActions.js";
import CreateFiller from "./component/Geometry/filler.js";
import RomeDataManager from "./app/RomeDataManager.js";
import { cookies } from "./App";
import { setLinePlacementMode ,setSnapPoint} from "./features/drawing/drwingSlice.js";
import { DraggableDoor } from "./component/Geometry/DragDrop.js";
import { Scale } from "./component/Geometry/Scale.js";
import DrawtoolHeader from "./component/Overlays/DrawtoolHeader.js";
import { useDispatch, useSelector } from "react-redux";
import {
  drawToolData,
  setHelpVideo,
  setHelpVideoNumberr,
  setStoreLines,
  updateLineTypeId,
} from "./Actions/ApplicationStateAction.js";
import ContextualMenu from "./component/CanvasOverLays/ContextualMenu.js";
import ButtonComponent from "./component/Overlays/ButtonComponent.js";
import PropertiesPopup from "./component/Overlays/PropertiesPopup.js";
import RoomNamePopup from "./component/Overlays/RoomNamePopup.js";
import RoomFiller from "./component/Geometry/roomFiller.js";
import ScalePopup from "./component/Overlays/ScalePopup.js";
import blade from "./assets/blade.png";
import {
  setContextualMenuStatus,
  setEnablePolygonSelection,
  setNewLine,
  setShiftPressed,
  setShowPopup,
  setShowSnapLine,
  setStop,
  setTypeId,
} from "./Actions/DrawingActions.js";
import UpdateDistance from "./component/Helpers/updateDistance.js";
import { Vector3, Shape } from "three";
import CappedLine from "./component/Geometry/CappedLine.js";
import { setSnapActive } from "./features/drawing/drwingSlice.js";
import CameraController from "./component/Helpers/CameraController.js";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "./constant/constant.js";
import convert from "convert-units";
import BottomComponent from "./component/CanvasOverLays/BottomComponent.js";
import useModes from "./hooks/useModes.js";
import newCursor from "./assets/linedraw.png";
import usePoints from "./hooks/usePoints.js";
import TemporaryFiller from "./component/Geometry/temporaryFiller.js";
import cursor from "./assets/Default.png"
import SetScalePopup from "./component/Popups/SetScalePopup.js";
import HelpVideoPopup from "./component/Popups/HelpVideoPopup.js";
import useMouse from "./hooks/useMouse.js";
import FirstTimePopupCanvas from "./component/Popups/FirstTimePopupCanvas.js";
import FirstTimePopupUI from "./component/Popups/FirstTimePopupUI.js";
import UndoRedoButton from "./component/Overlays/UndoRedoButton.js";
import Logo from "./component/CanvasOverLays/Logo.js";
import EscapeHelper from "./component/CanvasOverLays/EscapeHelper.js";

export const CanvasComponent = () => {
  const dispatch = useDispatch();
  const {
    handleClick,
    handleLineClick,
    deleteSelectedLines,
    deleteSelectedRoom,
  } = useDrawing();
  const { handleMouseMove, handleMouseDown, handleMouseUp, 
    isSelecting,
    startPoint,
    endPoint,
    nearPoint,
    nearVal,
    draggingLineIndex,
    draggingLine,
    currentLinePostion,
    setCurrentLinePostion,
    currentMousePosition,
    currentStrightMousePosition,
    distance,
    curvePoints,
    curveAngle,
    curveAnglePosition,
    lineAngle
   } = useMouse();
  const { undo, redo } = useActions();
  const { toggleSelectionMode, perpendicularHandler } = useModes();
  const {screenToNDC, decimalToFeetInches} = usePoints();

  const {
    leftPos,
    rightPos,
    merge,
    lineBreak,
    perpendicularLine,
    linePlacementMode,
    measured,
    idSelection,
    roomSelectors,
    snapActive,
    userLength,
    userWidth,
    snapPoint
  } = useSelector((state) => state.drawing);
  const {
    storeBoxes,
    selectionMode,
    selectedLines,
    storeLines,
    factor,
    points,
    activeRoomIndex,
    designStep,
    expandRoomPopup,
    activeRoomButton,
    showSetScalePopup,
    img,
    escapeMessageShow,
    helpVideoNumber
  } = useSelector((state) => state.ApplicationState);
  const { typeId, stop, showSnapLine, snappingPoint, temporaryPolygon, enablePolygonSelection,} = useSelector(
    (state) => state.Drawing
  );

  const {enableFirstTimePopup, showFirstTimePopup, firstTimePopupType} = useSelector((state) => state.PopupState);

  const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const [zoom, setZoomState] = useState(1);
  const [isNeeded, setIsNeeded] = useState(false);
  const [gridFactor, setGridFactor] = useState(10);

  const setZoom = (zoom, val = true) => {
    setZoomState(zoom);
    setIsNeeded(val);
  };

  const handleKeyDown = (event) => {
    if (event.key === "s" || event.key === "S") {
      dispatch(setStop(!stop));
      window.GAEvent("DrawTool", "Shortcut", "SetStop");
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "x" || event.key === "X")
    ) {
      perpendicularHandler();
      window.GAEvent("DrawTool", "Shortcut", "PerpendicularChange");
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "z" || event.key === "Z")
    ) {
      undo();
      window.GAEvent("DrawTool", "Shortcut", "Undo");
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "y" || event.key === "Y")
    ) {
      redo();
      window.GAEvent("DrawTool", "Shortcut", "Redo");
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "c" || event.key === "C")
    ) {
      dispatch(setSnapActive(!snapActive));
      window.GAEvent("DrawTool", "Shortcut", "SnapActive");
    }
   
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "Q" || event.key === "q")
    ) {
      if (snapPoint === "normal") {
        dispatch(setSnapPoint("upper"));
        window.GAEvent("DrawTool", "Shortcut", "SnapPointUpper");
      } else {
        dispatch(setSnapPoint("normal"));
        window.GAEvent("DrawTool", "Shortcut", "SnapPointNormal");
      }
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "b" || event.key === "B")
    ) {
      if (linePlacementMode === "midpoint") {
        dispatch(setLinePlacementMode("below"));
        window.GAEvent("DrawTool", "Shortcut", "LinePlacementModeBelow");
      } else {
        dispatch(setLinePlacementMode("midpoint"));
        window.GAEvent("DrawTool", "Shortcut", "LinePlacementModeMidpoint");
      }
    }
    if (
      event.key === "escape" ||
      (event.key === "Escape" && !merge && !lineBreak)
    ) {
      if (designStep === 2 && !selectionMode) {
        dispatch(setShowPopup(false));
        dispatch(setTypeId(0))
        toggleSelectionMode();
      } else if(activeRoomButton === "add" && designStep === 3){
        dispatch(setEnablePolygonSelection(!enablePolygonSelection))
      } 
      else if (!selectionMode) {
        dispatch(setNewLine(true));
        dispatch(setStop(true));
        dispatch(setShowSnapLine(false));
        dispatch(setContextualMenuStatus(false));
      }
      window.GAEvent("DrawTool", "Shortcut", "Escape");
    }
    if (selectionMode && (event.key === "Delete" || event.keyCode === 46)) {
      if (designStep === 3 && activeRoomIndex !== -1) {
        deleteSelectedRoom();
        window.GAEvent("DrawTool", "Shortcut", "DeleteRoom");
      } else {
        deleteSelectedLines();
        window.GAEvent("DrawTool", "Shortcut", "DeleteLine");
      }
    }
    if (event.key === "Shift") {
      dispatch(setShiftPressed(true));
      window.GAEvent("DrawTool", "Shortcut", "ShiftPressed");
    }
    if(!selectionMode && designStep === 2){
      if(event.key === "W" || event.key === "w"){
        dispatch(updateLineTypeId(1))
        window.GAEvent("DrawTool", "Shortcut", "LineTypeWall")
      }
      if(event.key === "D" || event.key === "d"){
        dispatch(updateLineTypeId(2))
        window.GAEvent("DrawTool", "Shortcut", "LineTypeDoor")
      }
      if(event.key === "R" || event.key === "r"){
        dispatch(updateLineTypeId(4))
        window.GAEvent("DrawTool", "Shortcut", "LineTypeRailing")
      }
      if(event.key === "N" || event.key === "n"){
        dispatch(updateLineTypeId(3))
        window.GAEvent("DrawTool", "Shortcut", "LineTypeWindow")
      }
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Shift") {
      dispatch(setShiftPressed(false));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    storeLines,
    selectionMode,
    selectedLines,
    points,
    stop,
    leftPos,
    rightPos,
    storeBoxes,
    designStep,
    perpendicularLine,
    snapActive,
    linePlacementMode,
    roomSelectors,
    enablePolygonSelection,
    temporaryPolygon
  ]);

  useEffect(() => {
    const floorplanId = getUrlParameter("floorplanId");
    if (floorplanId) {
      window.GAEvent("DrawTool", "AppOpened", "FloorplanOpened", floorplanId);
    }else{
      window.GAEvent("DrawTool", "AppOpened", "NoFloorplanId", "");
    }
    RomeDataManager.instantiate();
    if (cookies.get("USER-SESSION", { path: "/" }) !== undefined) {
      const result = cookies.get("LOGIN-RESPONSE", { path: "/" });

      RomeDataManager.setUserEmail(result.email, result.persistence_token);
      window.curentUserSession = result;
      window.GAEvent("DrawTool", "UserLanded", "LoggedIn", result.user_id);
    }

    dispatch(drawToolData(floorplanId));
    window.cameraContext = {}
  }, []);

  const createQuadrilateral = (p1, p2, p3, p4) => {
    const shape = new Shape();
    shape.moveTo(p1.x, p1.y);
    shape.lineTo(p2.x, p2.y);
    shape.lineTo(p3.x, p3.y);
    shape.lineTo(p4.x, p4.y);
    shape.lineTo(p1.x, p1.y);
    return shape;
  };

  const [test, setTest] = useState(null);

  const handleLineMove = (point) => {
    const line = storeLines[draggingLine];
      const linePoints = line.points;
      const lineLength = linePoints[1].distanceTo(linePoints[0]);
      if(Math.abs(linePoints[0].x - linePoints[1].x) > Math.abs(linePoints[0].y - linePoints[1].y)){
        const newStart = new Vector3(point.x - lineLength/2, point.y, 0);
        const newEnd = new Vector3(point.x + lineLength/2, point.y, 0);
        setTest([newStart, newEnd]);
        setCurrentLinePostion([newStart, newEnd]);
      } else {
        const newStart = new Vector3(point.x , point.y - lineLength/2, 0);
        const newEnd = new Vector3(point.x, point.y + lineLength/2, 0);
        setTest([newStart, newEnd]);
        setCurrentLinePostion([newStart, newEnd]);
      }
  }

  useEffect(()=>{
    const canvasContainer = document.querySelector(".canvas-container");
    const handlePointerMove = (event)=>{
      if(draggingLine){
        const point = screenToNDC(event.clientX, event.clientY);
        dispatch(setContextualMenuStatus(false));
        handleLineMove(point);
      }
    }
    if(draggingLine){
      canvasContainer.addEventListener("pointermove", handlePointerMove);
    }
    canvasContainer.addEventListener('contextmenu', (event)=>{
      event.preventDefault();
      event.stopPropagation();
    })
    return () => {
      canvasContainer.removeEventListener("pointermove", handlePointerMove);
      canvasContainer.removeEventListener('contextmenu', (event)=>{
        event.preventDefault();
        event.stopPropagation();
      })
    };
  },[draggingLine])

  useEffect(()=>{
    if(typeId === 0 && !selectionMode){
      toggleSelectionMode();
    }
  },[typeId, selectionMode])

  useEffect(()=>{
    switch(measured){
      case "in":
        setGridFactor(12);
        break;
      case "cm":
        setGridFactor(10);
        break;
      case "m":
        setGridFactor(0.1);
        break;
      case "mm":
        setGridFactor(100);
        break;
      default:
        setGridFactor(1)
        break;
    }
  },[measured])

  useEffect(()=>{
    var type = "";
    if(designStep  === 1 && helpVideoNumber === 1){
      type = "setScale";
      dispatch(setHelpVideoNumberr(2));
    }else if(designStep === 2 && helpVideoNumber === 2){
      type = "addWall";
      dispatch(setHelpVideoNumberr(3));
    }else if(designStep === 3 && helpVideoNumber === 3){
      type = "defineRoom";
      dispatch(setHelpVideoNumberr(4));
    }
    dispatch(setHelpVideo(true, type));
  },[designStep])

  var feetLength = 0;
  if(measured === "ft"){
    feetLength = decimalToFeetInches(distance);
  }

  return (
    <div className="container">
      <div
        className="canvas-container"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={
          designStep === 1
            ? { cursor: "grab" }
            : lineBreak
            ? { cursor: `url(${blade}) 8 8, crosshair` }
            : selectionMode
            ? designStep === 3
              ? enablePolygonSelection
                ? { cursor: `url(${newCursor}) 16 16, crosshair` }
                : { cursor: `url(${cursor}) 4 4, default` }
              : { cursor: "grab" }
            : { cursor: `url(${newCursor}) 16 16, crosshair` }
        }
      >
        {/* 2D (Orthographic) Canvas */}
        <Canvas
          style={{
            height: window.innerHeight,
            width: "100%",
            background: "#EFEFEF",
          }}
          orthographic
          raycaster={{ params: { Line: { threshold: 5 } } }}
          camera={{ position: [0, 0, 500], zoom: 1 }}
          onClick={handleClick}
          gl={{ powerPreference: 'high-performance' }}
        >
          <CameraController zoom={zoom} setZoom={setZoom} isNeeded={isNeeded} />

          {/* {isSelecting && startPoint && endPoint && (
            <mesh>
              <shapeGeometry
                attach="geometry"
                args={[
                  createQuadrilateral(
                    startPoint,
                    new Vector3(endPoint.x, startPoint.y, 0),
                    endPoint,
                    new Vector3(startPoint.x, endPoint.y, 0)
                  ),
                ]}
              />
              <meshBasicMaterial
                color={"rgba(0, 0, 255, 0.2)"}
                transparent={true}
                opacity={0.2}
              />
            </mesh>
          )} */}
          {nearPoint && lineBreak && <UpdateDistance nearVal={nearVal} />}

          {designStep === 1 && <Scale />}
          <BackgroundImage />
          {/* Render lines in 2D view */}
          {designStep > 1 &&
            storeLines.map((line, index) => {
              const lineIndex = draggingLineIndex.find(
                (line) => line.index === index
              );
              return (
                <BoxGeometry
                  key={line.id}
                  start={
                    lineIndex !== undefined && lineIndex.type === "start"
                      ? currentMousePosition
                      : test && draggingLine === index
                      ? test[0]
                      : line.points[0]
                  }
                  end={
                    lineIndex !== undefined && lineIndex.type === "end"
                      ? currentMousePosition
                      : test && draggingLine === index
                      ? test[1]
                      : line.points[1]
                  }
                  dimension={{ width: line.width, height: line.height }}
                  typeId={line.typeId}
                  isSelected={selectedLines.includes(line.id)}
                  lineId={line.id}
                />
              );
            })}
          {designStep === 2 &&
            draggingLineIndex.length === 0 &&
            !currentLinePostion && 
              storeLines.map((line, index) => {
                return(
                  <CappedLine line={line} index={index} />
                )
              })
            }
          {designStep > 1 &&
            showSnapLine &&
            snappingPoint.length > 0 &&
            !lineBreak && (
              <Line
                points={[snappingPoint[1], snappingPoint[0]]}
                color="green"
                lineWidth={5}
              />
            )}

          {designStep === 2 &&
            currentMousePosition &&
            points.length > 0 &&
            !stop && (
              <>
                <Line
                  points={[points[points.length - 1], currentMousePosition]}
                  color="black"
                  lineWidth={2}
                />
                <BoxGeometry
                  start={points[points.length - 1]}
                  end={currentMousePosition}
                  dimension={{
                    width: convert(INITIAL_BREADTH / factor[1])
                      .from(measured)
                      .to("mm"),
                    height: convert(INITIAL_HEIGHT / factor[2])
                      .from(measured)
                      .to("mm"),
                  }}
                  typeId={typeId}
                  isSelected={false}
                  showDimension={true}
                  distance={
                    storeLines.length === 0 &&
                    userLength === 0 &&
                    userWidth === 0 &&
                    !img
                      ? true
                      : null
                  }
                />
                {currentStrightMousePosition && !perpendicularLine && curveAngle > 3 &&(
                  <>
                    <Line
                      points={[
                        points[points.length - 1],
                        currentStrightMousePosition,
                      ]}
                      color="blue"
                      lineWidth={5}
                    />
                    <Line points={curvePoints} color="black" lineWidth={1} transparent={true} opacity={0.5}/>
                    <Text
                      position={[
                        currentMousePosition.x - points[points.length - 1].x > 0 ? (points[points.length - 1].x +
                          currentStrightMousePosition.x) /
                          2 - 10: (points[points.length - 1].x +
                            currentStrightMousePosition.x) /
                            2 + 10,
                        currentMousePosition.y - points[points.length - 1].y > 0?
                        (points[points.length - 1].y +
                          currentStrightMousePosition.y) /
                          2 -
                          20: (points[points.length - 1].y +
                            currentStrightMousePosition.y) /
                            2 +
                            20,
                        0,
                      ]}
                      rotation={[0, 0 , lineAngle< 3? lineAngle: 0]}
                      color="black"
                      anchorX="center"
                      anchorY="middle"
                      fontSize={8}
                      fontWeight="bold"
                    >
                      {measured === "ft"
                        ? `${feetLength.feet}'${feetLength.inches} ${measured}`
                        : `${distance.toFixed(2)} ${measured}`}
                    </Text>
                    <Text
                      position={curveAnglePosition}
                      color="black"
                      anchorX="center"
                      anchorY="middle"
                      fontSize={8}
                      fontWeight="bold"
                    >
                      {curveAngle.toFixed(2)}°
                    </Text>
                  </>
                )}
              </>
            )}
          {/* {designStep === 2 &&
            storeBoxes.map((box, index) => (
              <CreateFiller
                key={index}
                p1={box.p1}
                p2={box.p2}
                p3={box.p3}
                p4={box.p4}
              />
            ))} */}

          {designStep > 1 && <ContextualMenu />}
          {showFirstTimePopup && enableFirstTimePopup && firstTimePopupType==="canvas" && <FirstTimePopupCanvas />}

          {designStep === 3 &&
            roomSelectors.map((room, index) => (
              <RoomFiller
                key={room.roomId}
                polygon={room.polygon}
                roomName={room.roomName}
                roomType={room?.roomType}
                wallIds={room.wallIds}
                index={index}
              />
            ))}

          {designStep === 3 &&
            (activeRoomButton === "add" || activeRoomButton === "divide") &&
            temporaryPolygon.length > 0 && (
              <TemporaryFiller polygon={temporaryPolygon} />
            )}
          {designStep === 3 &&
            enablePolygonSelection &&
            currentMousePosition &&
            temporaryPolygon.length > 0 && (
              <>
                <Line
                  points={[
                    temporaryPolygon[temporaryPolygon.length - 1],
                    currentMousePosition,
                  ]}
                  color="blue"
                  lineWidth={2}
                />
              </>
            )}

          {/* 2D grid */}
          {/* <Grid
            rotation={[Math.PI / 2, 0, 0]}
            // cellSize={(1/factor[0]) * 10}
            cellThickness={0}
            cellColor="#FFFFFF"
            sectionSize={ designStep ===1 || showSetScalePopup ?  50 : (1/factor[0]) * gridFactor}
            //sectionThickness={1.5}
            sectionColor="#FFFFFF"
            fadeDistance={10000}
            infiniteGrid
            fadeStrength={0.5}
            fadeFrom={0.5}
            opacity={0.3}
            materialProps={{
              toneMapped: false,
              transparent: true,
              opacity: 0.3,
            }}
          /> */}
        </Canvas>
        <DrawtoolHeader />
        <UndoRedoButton/>
        <Logo/>
        {designStep === 2 && !selectionMode && escapeMessageShow && <EscapeHelper/>}
        <BottomComponent zoom={zoom} setZoom={setZoom} />
      </div>
      {designStep > 1 ? (
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
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#EFEFEF",
                  borderRadius: "16px",
                }}
                orthographic
                camera={{ position: [0, 0, 800], fov: 75 }}
              >
                <OrthographicCamera
                  makeDefault
                  zoom={0.15}
                  position={[0, 0, 800]}
                />

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
                    onClick={() => handleLineClick(line.id)}
                  />
                ))}

                {/* 3D grid */}
                <Grid
                  rotation={[Math.PI / 2, 0, 0]}
                  cellSize={0}
                  cellThickness={0}
                  cellColor="black"
                  sectionSize={0}
                  sectionThickness={1.5}
                  sectionColor="lightgray"
                  fadeDistance={10000}
                  infiniteGrid
                />

                {/* Orbit controls for 3D view */}
                <OrbitControls
                  enablePan={true} // Disable panning if needed
                  zoomToCursor={true}
                  maxAzimuthAngle={Math.PI / 3} // Limit horizontal rotation to 60 degrees (PI/3 radians)
                  minAzimuthAngle={-Math.PI / 3} // Limit horizontal rotation to -60 degrees (-PI/3 radians)
                  // maxPolarAngle={Math.PI / 3} // Limit vertical rotation to 60 degrees
                  // minPolarAngle={Math.PI / 2 - Math.PI / 3} // Limit vertical rotation to 30 degrees above the horizontal plane
                  defaultPolarAngle={Math.PI / 2 - Math.PI / 6} // Set default vertical angle to 30 degrees
                />
              </Canvas>
            </div>
            <PropertiesPopup />
            <RoomNamePopup />
            <ButtonComponent />
            <HelpVideoPopup />
            {showSetScalePopup && <SetScalePopup />}
            {showFirstTimePopup && enableFirstTimePopup && firstTimePopupType==="ui" && <FirstTimePopupUI />}
          </div>
        </div>
      ) : (
        <div className="button-container">
          <ScalePopup />
          <HelpVideoPopup />
          {showFirstTimePopup && enableFirstTimePopup && firstTimePopupType==="ui" && <FirstTimePopupUI />}
        </div>
      )}
    </div>
  );
};

export default CanvasComponent;
