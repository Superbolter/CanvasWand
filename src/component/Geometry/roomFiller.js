import React, { useEffect, useMemo, useState } from "react";
import { extend } from "@react-three/fiber";
import { Shape, ShapeGeometry, MeshBasicMaterial, Vector3, Box3 } from "three";
import { Html, Line } from "@react-three/drei";
import { useDrawing } from "../../hooks/useDrawing";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveRoomIndex,
  setExpandRoomNamePopup,
  setRoomDetails,
  setRoomEditingMode,
  setRoomName,
  setSelectedLinesState,
} from "../../Actions/ApplicationStateAction";
import { Check } from "@mui/icons-material";
import DraggablePoint from "./DraggablePoints";
import { setRoomSelectors } from "../../features/drawing/drwingSlice";
import usePoints from "../../hooks/usePoints";
import {colors} from "../../utils/colors"
import { setRoomRedoStack, setRoomUndoStack } from "../../Actions/DrawingActions";
import { resetShowFirstTimePopup, setShowFirstTimePopup } from "../../Actions/PopupAction";

// Extend the R3F renderer with ShapeGeometry
extend({ ShapeGeometry });

const createShape = (points) => {
  const shape = new Shape();
  shape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }
  shape.lineTo(points[0].x, points[0].y); // Close the shape by going back to the first point
  return shape;
};

const getCentroid = (points) => {
  let centroid = new Vector3(0, 0, 0);
  points.forEach((point) => {
    centroid.add(new Vector3(point.x, point.y, point.z || 0));
  });
  centroid.divideScalar(points.length);
  return centroid;
};

const calculateBoundingBox = (points) => {
  const box = new Box3();
  points.forEach((point) => {
    box.expandByPoint(new Vector3(point.x, point.y, point.z || 0));
  });
  return box;
};

const updateSharedPoints = (rooms, draggedPoint, newPosition) => {
  return rooms.map((room) => ({
    ...room,
    polygon: room.polygon.map((point) =>
      point.x === draggedPoint.x && point.y === draggedPoint.y
        ? new Vector3(newPosition.x, newPosition.y, point.z || 0)
        : point
    ),
  }));
};

const RoomFiller = ({ roomName, roomType, wallIds, index, polygon }) => {
  const { selectedRoomName, activeRoomButton, storeLines, points, activeRoomIndex } =
    useSelector((state) => state.ApplicationState);
  const { roomSelectors } = useSelector((state) => state.drawing);
  const { roomActionHistory } = useSelector((state) => state.Drawing);
  const { isPointInsidePolygon} = usePoints();
  const dispatch = useDispatch();
  const [initialRoomState, setInitialRoomState] = useState(null);
  const { showFirstTimePopup, firstTimePopupNumber, enableFirstTimePopup } = useSelector((state) => state.PopupState);
  
  useEffect (()=>{
    if(index === 0 && !showFirstTimePopup && firstTimePopupNumber < 11 && firstTimePopupNumber >6 && enableFirstTimePopup && polygon){
      const centroid = getCentroid(polygon);
      dispatch(setShowFirstTimePopup({
        showFirstTimePopup: true,
        firstTimePopupNumber: 11,
        firstTimePopupType: "canvas",
        popupDismissable: true,
        customisedPosition: new Vector3(centroid.x + 50, centroid.y, 0),
      }))
    }
  },[roomSelectors, showFirstTimePopup, firstTimePopupNumber])

  const handleDragPoint = (newPosition, draggedPoint) => {
    if (!initialRoomState) {
      setInitialRoomState([...roomSelectors]);
    }
    // Update the shared points in all rooms
    const updatedRooms = updateSharedPoints(
      roomSelectors,
      draggedPoint,
      newPosition
    );
    dispatch(setRoomSelectors(updatedRooms));
    // const newLine = []
    //   storeLines.map((line) => {
    //     if(isPointInsidePolygon(polygon, line.points[0]) && isPointInsidePolygon(polygon, line.points[1])){
    //       newLine.push(line.id)
    //     }
    //   })
    //   dispatch(setSelectedLinesState(newLine));
  };

  const handleDragUndo = (newPosition, draggedPoint) => {
    // Update the shared points in all rooms
    const updatedRooms = updateSharedPoints(
      roomSelectors,
      draggedPoint,
      newPosition
    );
    const history = [...roomActionHistory];
    history.push({
      type: "updateRoom",
      oldRooms: initialRoomState,
      newRooms: updatedRooms,
    });
    setInitialRoomState(null);
    dispatch(setRoomUndoStack(history));
    dispatch(setRoomRedoStack([]));
  };

  const handleRoomClick = (e) => {
    if (activeRoomButton === "add") return;
    e.stopPropagation();
    if (selectedRoomName === roomName) {
      dispatch(setSelectedLinesState([]));
      dispatch(setExpandRoomNamePopup(false));
      dispatch(setRoomEditingMode(false));
      dispatch(setRoomName(""));
      dispatch(setRoomDetails(""));
      dispatch(setActiveRoomIndex(-1));
      dispatch(resetShowFirstTimePopup())
      return;
    }
    if(firstTimePopupNumber < 12 && enableFirstTimePopup){
      const centroid = getCentroid(polygon);
      dispatch(setShowFirstTimePopup({
        showFirstTimePopup: true,
        firstTimePopupNumber: 12,
        firstTimePopupType: "canvas",
        popupDismissable: true,
        customisedPosition: new Vector3(centroid.x + 50, centroid.y, 0),
      }))
    }else if(firstTimePopupNumber < 13 && enableFirstTimePopup){
      dispatch(setShowFirstTimePopup({
        showFirstTimePopup: true,
        firstTimePopupNumber: 13,
        firstTimePopupType: "ui",
        popupDismissable: true,
        customisedPosition: null,
      }))
    }
    dispatch(setSelectedLinesState(wallIds));
    dispatch(setExpandRoomNamePopup(true));
    dispatch(setRoomEditingMode(true));
    dispatch(setRoomName(roomName));
    dispatch(setRoomDetails(roomType));
    dispatch(setActiveRoomIndex(index));
  };
  const sortedPoints = polygon
  const shape = createShape(sortedPoints);
  const geometry = new ShapeGeometry(shape);
  const material = new MeshBasicMaterial({
    color: activeRoomIndex === index ? "#4B73EC" :  colors[index % colors.length],
    transparent: true,
    opacity: activeRoomIndex !== index && activeRoomIndex!==-1 ?0.1: 0.3,
  });

  const centroid = getCentroid(sortedPoints);
  const boundingBox = calculateBoundingBox(sortedPoints);
  const boxSize = new Vector3();
  boundingBox.getSize(boxSize);

  // Adjust font size based on bounding box dimensions
  const fontSize = Math.min(boxSize.x, boxSize.y) * 0.1;
  return (
    activeRoomButton === "divide" && activeRoomIndex !== index ? null:
    <>
      <mesh>
        <shapeGeometry attach="geometry" args={[shape]} />
        <meshBasicMaterial attach="material" args={[material]} />
        {activeRoomButton === "divide" || (activeRoomIndex !== -1 && activeRoomIndex !== index) ? null : (
          <Html
            position={[centroid.x - fontSize, centroid.y, centroid.z]}
            zIndexRange={[0, 0]}
            style={{ zIndex: "12" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor:
                  activeRoomIndex === index ? "#4B73EC" : "white",
                borderRadius: "8px",
                width: "max-content",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: "500",
                fontSize:
                  fontSize < 18 ? (fontSize > 9 ? fontSize : "9px") : "18px",
                color:
                  activeRoomIndex === index
                    ? "white"
                    : roomType !== null && roomType !== ""
                    ? "#4B73EC"
                    : "black",
                border:
                activeRoomIndex === index || (roomType !== null && roomType !== "")
                    ? "2px solid #4B73EC"
                    : "0.7px solid #B6BABD",
                pointerEvents: activeRoomButton === "add" ? "none" : "auto",
                opacity: activeRoomButton === "add" ? 0.5 : 1,
                cursor: "pointer",
              }}
              onClick={handleRoomClick}
            >
              {roomType !== null && activeRoomIndex !== index && roomType!== ""? (
                <Check
                  sx={{
                    color: "#4B73EC",
                    fontSize:
                      fontSize < 18
                        ? fontSize > 9
                          ? fontSize + 4
                          : "9px"
                        : "18px",
                    marginRight: "4px",
                  }}
                />
              ) : null}
              {roomName}
            </div>
          </Html>
        )}
      </mesh>
      {sortedPoints.map((point, i) => (
        <>
        {activeRoomIndex === index ?
          <DraggablePoint
            key={i}
            index={i}
            point={new Vector3(point.x, point.y, 5)}
            onDrag={(newPosition) => handleDragPoint(newPosition, point)}
            onDragEnd={(newPosition) => handleDragUndo(newPosition, point)}
          />:
          <mesh key={i} position={[point.x, point.y, 0]}>
            <sphereGeometry args={[6, 6, 32]} />
            <meshBasicMaterial color={colors[index % colors.length]} />
          </mesh>
        }
          {i < sortedPoints.length - 1 ? (
            <Line
              points={[
                [point.x, point.y, activeRoomIndex === index ? 5 : 0],
                [sortedPoints[i + 1].x, sortedPoints[i + 1].y, activeRoomIndex === index ? 5 : 0],
              ]}
              color={activeRoomIndex === index ? "blue" : colors[index % colors.length]}
              lineWidth={2}
            />
          ) : null}
          {i === sortedPoints.length - 1 ? (
            <Line
              points={[
                [point.x, point.y, activeRoomIndex === index ? 5 : 0],
                [sortedPoints[0].x, sortedPoints[0].y, activeRoomIndex === index ? 5 : 0],
              ]}
              color={activeRoomIndex === index ? "blue" : colors[index % colors.length]}
              lineWidth={2}
            />
          ) : null}
        </>
      ))}
    </>
  );
};

export default RoomFiller;
