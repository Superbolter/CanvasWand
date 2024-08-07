import React, { useRef, useState, useEffect } from "react";
import { Vector3 } from "three";
import { useDrawing } from "../hooks/useDrawing.js";
import { findLineForPoint } from "../utils/coolinear";
import { useDispatch, useSelector } from "react-redux";

export const DraggableDoor = ({
  doorPosition,
  setDoorPosition,
  isDraggingDoor,
  setIsDraggingDoor,
  handlePointerDown,
  handlePointerUp,
}) => {
  const mesh = useRef();
  const left = useRef();
  const right = useRef();
  const [dragging, setDragging] = useState(null);
  const [attachedLine, setAttachedLine] = useState(null);
  const [line, setLine] = useState(null);
  const [lastLineDirection, setLastLineDirection] = useState(new Vector3(1, 0, 0));
  const {
    dimensions,
    setDimensions,
  } = useDrawing();

  const dispatch = useDispatch();
  const {
    storeLines,
  } = useSelector((state) => state.ApplicationState);

  useEffect(() => {
    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();
    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const handlePointerMove = (event) => {
      if (!isDraggingDoor && !dragging) return;

      let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const posX = x * (cameraWidth / 2);
      const posY = y * (cameraHeight / 2);

      if (isDraggingDoor) {
        const point = new Vector3(posX, posY, 0);
        const result = findLineForPoint(point, storeLines);
        if (result) {
          const { closestPointOnLine, line } = result;
          setLine(line);
          if (closestPointOnLine) {
            setAttachedLine(line);
            const d = dimensions;
            setDimensions(d);
            setLastLineDirection(getLineDirection(line));
            alignDoorWithLine(line, closestPointOnLine);
          }
        } else {
          alignDoorWithLastDirection(posX, posY);
          setAttachedLine(null);
        }
      } else if (dragging) {
        const newPoint = new Vector3(posX, posY, 0);
        if (attachedLine) {
          const closestPointOnLine = findClosestPointOnLine(newPoint, attachedLine);
          dragging.current.position.set(closestPointOnLine.x, closestPointOnLine.y, 0);

          // Calculate new length
          const newLength = Math.abs(left.current.position.x - right.current.position.x);
          setDimensions((prev) => ({ ...prev, l: newLength }));

          // Update the position of the mesh
          const midX = (left.current.position.x + right.current.position.x) / 2;
          mesh.current.position.set(midX, left.current.position.y, 0);
        } else {
          dragging.current.position.set(posX, posY, 0);

          // Calculate new length
          const newLength = Math.abs(left.current.position.x - right.current.position.x);
          setDimensions((prev) => ({ ...prev, l: newLength }));

          // Update the position of the mesh
          const midX = (left.current.position.x + right.current.position.x) / 2;
          mesh.current.position.set(midX, left.current.position.y, 0);
        }
      }

      event.stopPropagation();
    };

    const alignDoorWithLine = (line, closestPointOnLine) => {
      const d = dimensions;
      const direction = getLineDirection(line);

      // Position the door in the middle of the closest point on the line
      const doorPosition = closestPointOnLine.clone();

      // Update door rotation
      const angle = Math.atan2(direction.y, direction.x);
      mesh.current.rotation.set(0, 0, angle);

      // Position the door
      mesh.current.position.set(doorPosition.x, doorPosition.y, 0);
      left.current.position.set(
        doorPosition.x - (d.l / 2) * Math.cos(angle),
        doorPosition.y - (d.l / 2) * Math.sin(angle),
        0
      );
      right.current.position.set(
        doorPosition.x + (d.l / 2) * Math.cos(angle),
        doorPosition.y + (d.l / 2) * Math.sin(angle),
        0
      );
    };

    const alignDoorWithLastDirection = (posX, posY) => {
      const d = dimensions;
      const angle = Math.atan2(lastLineDirection.y, lastLineDirection.x);

      // Position the door
      mesh.current.position.set(posX, posY, 0);
      left.current.position.set(
        posX - (d.l / 2) * Math.cos(angle),
        posY - (d.l / 2) * Math.sin(angle),
        0
      );
      right.current.position.set(
        posX + (d.l / 2) * Math.cos(angle),
        posY + (d.l / 2) * Math.sin(angle),
        0
      );
    };

    const getLineDirection = (line) => {
      const startPoint = line.points[0];
      const endPoint = line.points[1];
      return new Vector3().subVectors(endPoint, startPoint).normalize();
    };

    canvasContainer.addEventListener("pointermove", handlePointerMove);

    return () => {
      canvasContainer.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDraggingDoor, dragging, storeLines, dimensions, attachedLine, lastLineDirection]);

  const handlePointerDownSphere = (event, sphereRef) => {
    setDragging(sphereRef);
    event.stopPropagation();
  };

  const handlePointerUpSphere = (event) => {
    setDragging(null);
    setIsDraggingDoor(false);
    event.stopPropagation();
  };

  const findClosestPointOnLine = (point, line) => {
    const { points } = line;
    const lineVector = new Vector3().subVectors(points[1], points[0]);
    const pointVector = new Vector3().subVectors(point, points[0]);
    const projection = pointVector.projectOnVector(lineVector);
    return new Vector3().addVectors(points[0], projection);
  };

  return (
    <>
      <mesh
        ref={mesh}
        position={doorPosition}
        onPointerDown={(event) => {
          handlePointerDown(event, right, left, mesh);
          setIsDraggingDoor(true);
        }}
        onPointerUp={(event) => {
          handlePointerUp(event, line, right, left);
          setIsDraggingDoor(false);
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <boxGeometry args={[dimensions.l, dimensions.w, dimensions.h]} />
        <meshBasicMaterial color={"orange"} transparent={true} />
      </mesh>
      <mesh
        ref={left}
        onPointerDown={(event) => handlePointerDownSphere(event, left)}
        onPointerUp={handlePointerUpSphere}
      >
        <sphereGeometry args={[10, 8, 8]} />
        <meshBasicMaterial color={"brown"} />
      </mesh>
      <mesh
        ref={right}
        onPointerDown={(event) => handlePointerDownSphere(event, right)}
        onPointerUp={handlePointerUpSphere}
      >
        <sphereGeometry args={[10, 8, 8]} />
        <meshBasicMaterial color={"brown"} />
      </mesh>
    </>
  );
};
