import React, { useMemo, useState } from "react";
import { extend } from "@react-three/fiber";
import { Shape, ShapeGeometry, MeshBasicMaterial, Vector3, Box3 } from "three";
import { Html } from "@react-three/drei";
import { useDrawing } from "../../hooks/useDrawing";
import { useDispatch, useSelector } from "react-redux";
import { setActiveRoomIndex, setExpandRoomNamePopup, setRoomDetails, setRoomEditingMode, setRoomName, setSelectedLinesState } from "../../Actions/ApplicationStateAction";
import { Check } from "@mui/icons-material";

// Extend the R3F renderer with ShapeGeometry
extend({ ShapeGeometry });

const sortPointsClockwise = (points) => {
  const centroid = getCentroid(points);
  return points.sort((a, b) => {
    const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
    const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
    return angleA - angleB;
  });
};

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

const RoomFiller = ({ roomName, roomType, wallIds, index }) => {
  const {selectedRoomName, activeRoomButton,storeLines, points} = useSelector((state) => state.ApplicationState);
  const dispatch = useDispatch();

  const roomPoints = useMemo(() => {
    let pts = [];
    wallIds.forEach((id) => {
      const line = storeLines.find((line) => line.id === id);
      if (line) {
        const startPoint = line.points[0];
        const endPoint = line.points[1];
        if (startPoint && pts.find((pt) =>pt.x === startPoint.x && pt.y === startPoint.y && pt.z === startPoint.z) === undefined){
          pts.push(startPoint);
        }
        if (endPoint && pts.find((pt) =>pt.x === endPoint.x && pt.y === endPoint.y && pt.z === endPoint.z) === undefined) {
          pts.push(endPoint);
        }
      }
    });
    return pts;
  }, [wallIds, storeLines, points]);

  if (roomPoints.length < 3) {
    console.error("Not enough points to form a shape", roomPoints);
    return null;
  }

  const handleRoomClick = (e) => {
    if(activeRoomButton === "add") return;
    e.stopPropagation();
    if(selectedRoomName === roomName) {
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
  }

  const sortedPoints = sortPointsClockwise(roomPoints);
  const shape = createShape(sortedPoints);
  const geometry = new ShapeGeometry(shape);
  const material = new MeshBasicMaterial({ color: "#4B73EC", transparent: true , opacity: 0.1});

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
        {activeRoomButton === "divide" ? null:  
      <Html
        position={[centroid.x - fontSize, centroid.y, centroid.z]}
        zIndexRange={[0, 0]}
        style={{zIndex:"12"}}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          backgroundColor: selectedRoomName === roomName? "#4B73EC":"white",
          borderRadius: "8px",
          width: "max-content",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: "500",
          fontSize: fontSize < 18? (fontSize > 9? fontSize: "9px"): "18px",
          color: selectedRoomName === roomName? "white":roomType!==null? "#4B73EC":"black", 
          border: selectedRoomName === roomName || roomType!==null? "2px solid #4B73EC":"0.7px solid #B6BABD",
          pointerEvents: activeRoomButton === "add" ? "none":"auto",
          opacity: activeRoomButton === "add"? 0.5: 1,
        }}
          onClick={handleRoomClick}
        >
          {roomType!==null && selectedRoomName !== roomName ? <Check sx={{color: "#4B73EC", fontSize: fontSize < 18? (fontSize > 9? fontSize + 4: "9px"): "18px", marginRight: "4px"}} /> : null}
          {roomName}
        </div>
      </Html>
      }
      </mesh>
    </>
  );
};

export default RoomFiller;
