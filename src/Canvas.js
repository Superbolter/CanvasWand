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
import { setLinePlacementMode } from "./features/drawing/drwingSlice.js";
import { DraggableDoor } from "./component/Geometry/DragDrop.js";
import { Scale } from "./component/Geometry/Scale.js";
import DrawtoolHeader from "./component/Overlays/DrawtoolHeader.js";
import { useDispatch, useSelector } from "react-redux";
import {
  drawToolData,
  setStoreLines,
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
  setNewLine,
  setShiftPressed,
  setShowPopup,
  setShowSnapLine,
  setStop,
} from "./Actions/DrawingActions.js";
import UpdateDistance from "./component/Helpers/updateDistance.js";
import { Vector3, Shape } from "three";
import CappedLine from "./component/Geometry/CappedLine.js";
import { setSnapActive } from "./features/drawing/drwingSlice.js";
import CameraController from "./component/Helpers/CameraController.js";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "./constant/constant.js";
import convert from "convert-units";
import ZoomComponent from "./component/CanvasOverLays/ZoomComponent.js";
import useModes from "./hooks/useModes.js";
import newCursor from "./assets/linedraw.png"

export const CanvasComponent = () => {
  const dispatch = useDispatch();
  const { scale, snapActive } = useSelector((state) => state.drawing);
  const {
    handleClick,
    handleMouseMove,
    addOn,
    handleLineClick,
    handleMouseDown,
    handleMouseUp,
    currentMousePosition,
    doorPosition,
    setDoorPosition,
    isDraggingDoor,
    setIsDraggingDoor,
    handlePointerDown,
    handlePointerUp,
    deleteSelectedLines,
    deleteSelectedRoom,
    nearPoint,
    nearVal,
    isSelecting,
    startPoint,
    endPoint,
    draggingLineIndex
  } = useDrawing();
  const { undo, redo } = useActions();
  const { toggleSelectionMode, perpendicularHandler } = useModes();

  const {
    leftPos,
    rightPos,
    merge,
    lineBreak,
    perpendicularLine,
    linePlacementMode,
    userLength,
    userWidth,
    measured,
    idSelection,
    roomSelectors,
  } = useSelector((state) => state.drawing);
  const {
    storeBoxes,
    roomSelectorMode,
    selectionMode,
    selectedLines,
    storeLines,
    factor,
    points,
    activeRoomIndex
  } = useSelector((state) => state.ApplicationState);
  const { typeId, stop, showSnapLine, snappingPoint } = useSelector(
    (state) => state.Drawing
  );

  const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const [zoom, setZoomState] = useState(1);
  const [isNeeded, setIsNeeded] = useState(false);

  const setZoom = (zoom, val = true) => {
    setZoomState(zoom);
    setIsNeeded(val);
  };

  const handleKeyDown = (event) => {
    if (event.key === "s" || event.key === "S") {
      dispatch(setStop(!stop));
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "x" || event.key === "X")
    ) {
      perpendicularHandler();
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "z" || event.key === "Z")
    ) {
      undo();
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "y" || event.key === "Y")
    ) {
      redo();
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "c" || event.key === "C")
    ) {
      dispatch(setSnapActive(!snapActive));
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "b" || event.key === "B")
    ) {
      if (linePlacementMode === "midpoint") {
        dispatch(setLinePlacementMode("below"));
      } else {
        dispatch(setLinePlacementMode("midpoint"));
      }
    }
    if (
      event.key === "escape" ||
      (event.key === "Escape" && !merge && !lineBreak)
    ) {
      if (!roomSelectorMode) {
        dispatch(setShowPopup(false));
        toggleSelectionMode();
      } else if (!selectionMode) {
        dispatch(setNewLine(true));
        dispatch(setStop(true));
        dispatch(setShowSnapLine(false));
        dispatch(setContextualMenuStatus(false));
      }
    }
    if (selectionMode && (event.key === "Delete" || event.keyCode === 46)) {
      if(roomSelectorMode && activeRoomIndex!== -1){
        deleteSelectedRoom()
      }else{
        deleteSelectedLines();
      }
    }
    if(event.key === "Shift"){
      dispatch(setShiftPressed(true))
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Shift"){
      dispatch(setShiftPressed(false))
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
    roomSelectorMode,
    perpendicularLine,
    snapActive,
    linePlacementMode,
    roomSelectors
  ]);

  useEffect(() => {
    const floorplanId = getUrlParameter("floorplanId");
    RomeDataManager.instantiate();
    if (cookies.get("USER-SESSION", { path: "/" }) !== undefined) {
      const result = cookies.get("LOGIN-RESPONSE", { path: "/" });

      RomeDataManager.setUserEmail(result.email, result.persistence_token);
      window.curentUserSession = result;
    }

    dispatch(drawToolData(floorplanId));
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

  return (
    <div className="container">
      <div
        className="canvas-container"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        // onWheel={handleWheel}
        style={
          scale
            ? { cursor: "grab" }
            : lineBreak
            ? { cursor: `url(${blade}) 8 8, crosshair` }
            : selectionMode
            ? roomSelectorMode
              ? { cursor: "pointer" }
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
        >
          <CameraController
            zoom={zoom}
            setZoom={setZoom}
            scale={scale}
            userLength={userLength}
            userWidth={userWidth}
            isNeeded={isNeeded}
          />

          {isSelecting && startPoint && endPoint && (
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
          )}
          {nearPoint && lineBreak && <UpdateDistance nearVal={nearVal} />}

          {scale && <Scale/>}
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
          {console.log(draggingLineIndex.find((line) => line.index === 10))}
          {!scale &&
            storeLines.map((line, index) => {
              const lineIndex = draggingLineIndex.find((line) => line.index === index);
              return (
              <BoxGeometry
                key={line.id}
                start={lineIndex!==undefined && lineIndex.type === "start" ? currentMousePosition:line.points[0]}
                end={lineIndex!==undefined && lineIndex.type === "end" ? currentMousePosition:line.points[1]}
                dimension={{ width: line.width, height: line.height }}
                typeId={line.typeId}
                isSelected={selectedLines.includes(line.id)}
                onClick={(e) => handleLineClick(e, line.id)}
              />
              );
            })}
          {/* {!scale && <BoxSegments lines={storeLines}/>} */}
          {!scale && draggingLineIndex.length === 0 && (
            // <LineSegments lines={storeLines} />
            // <BoxSegments lines={storeLines} />
            <CappedLine lines={storeLines} />
          )}

          {!scale && showSnapLine && snappingPoint.length > 0 && (
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
                onClick={() => {}}
              />
              {/* <Text
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
              </Text> */}
            </>
          )}
          {!scale &&
            storeBoxes.map((box, index) => (
              <CreateFiller
                key={index}
                p1={box.p1}
                p2={box.p2}
                p3={box.p3}
                p4={box.p4}
              />
            ))}

          {!scale && <ContextualMenu />}

          {!scale &&
            roomSelectorMode &&
            roomSelectors.map((room, index) => (
              <RoomFiller
                key={room.roomId}
                roomName={room.roomName}
                roomType={room?.roomType}
                wallIds={room.wallIds}
                index={index}
              />
            ))}

          {/* 2D grid */}
          <Grid
            rotation={[Math.PI / 2, 0, 0]}
            cellSize={10}
            cellThickness={0}
            cellColor="#FFFFFF"
            sectionSize={50}
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
          />
        </Canvas>
        <DrawtoolHeader />

        {scale &&
        !(
          userLength === 0 ||
          userWidth === 0 ||
          userLength === undefined ||
          userWidth === undefined ||
          userLength === "" ||
          userWidth === ""
        ) ? null : (
          <ZoomComponent zoom={zoom} setZoom={setZoom} />
        )}
      </div>
      {!scale ? (
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
                    onClick={(e) => handleLineClick(e, line.id)}
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
          </div>
        </div>
      ) : (
        <div className="button-container">
          <ScalePopup />
        </div>
      )}
    </div>
  );
};

export default CanvasComponent;
