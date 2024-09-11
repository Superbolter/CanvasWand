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
  const { selectedRoomName, activeRoomButton, storeLines, points } =
    useSelector((state) => state.ApplicationState);
  const { roomSelectors } = useSelector((state) => state.drawing);
  const { isPointInsidePolygon} = usePoints();
  const dispatch = useDispatch();

  const handleDragPoint = (newPosition, draggedPoint) => {
    // Update the shared points in all rooms
    const updatedRooms = updateSharedPoints(
      roomSelectors,
      draggedPoint,
      newPosition
    );
    dispatch(setRoomSelectors(updatedRooms));
    const newLine = []
      storeLines.map((line) => {
        if(isPointInsidePolygon(polygon, line.points[0]) && isPointInsidePolygon(polygon, line.points[1])){
          newLine.push(line.id)
        }
      })
      dispatch(setSelectedLinesState(newLine));
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
      return;
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
    color: "#4B73EC",
    transparent: true,
    opacity: 0.1,
  });

  const centroid = getCentroid(sortedPoints);
  const boundingBox = calculateBoundingBox(sortedPoints);
  const boxSize = new Vector3();
  boundingBox.getSize(boxSize);

  // Adjust font size based on bounding box dimensions
  const fontSize = Math.min(boxSize.x, boxSize.y) * 0.1;

  return (
    <>
      <mesh>
        <shapeGeometry attach="geometry" args={[shape]} />
        <meshBasicMaterial attach="material" args={[material]} />
        {activeRoomButton === "divide" ? null : (
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
                  selectedRoomName === roomName ? "#4B73EC" : "white",
                borderRadius: "8px",
                width: "max-content",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: "500",
                fontSize:
                  fontSize < 18 ? (fontSize > 9 ? fontSize : "9px") : "18px",
                color:
                  selectedRoomName === roomName
                    ? "white"
                    : roomType !== null && roomType !== ""
                    ? "#4B73EC"
                    : "black",
                border:
                  selectedRoomName === roomName || (roomType !== null && roomType !== "")
                    ? "2px solid #4B73EC"
                    : "0.7px solid #B6BABD",
                pointerEvents: activeRoomButton === "add" ? "none" : "auto",
                opacity: activeRoomButton === "add" ? 0.5 : 1,
              }}
              onClick={handleRoomClick}
            >
              {roomType !== null && selectedRoomName !== roomName && roomType!== ""? (
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
      {sortedPoints.map((point, index) => (
        <>
          <DraggablePoint
            key={index}
            index={index}
            point={new Vector3(point.x, point.y, 0)}
            onDrag={(newPosition) => handleDragPoint(newPosition, point)}
          />
          {index < sortedPoints.length - 1 ? (
            <Line
              points={[
                [point.x, point.y, 0],
                [sortedPoints[index + 1].x, sortedPoints[index + 1].y, 0],
              ]}
              color="blue"
              lineWidth={2}
            />
          ) : null}
          {index === sortedPoints.length - 1 ? (
            <Line
              points={[
                [point.x, point.y, 0],
                [sortedPoints[0].x, sortedPoints[0].y, 0],
              ]}
              color="blue"
              lineWidth={2}
            />
          ) : null}
        </>
      ))}
    </>
  );
};

export default RoomFiller;
