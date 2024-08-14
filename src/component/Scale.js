import React, { useRef, useState, useEffect, useCallback } from "react";
import { Vector3 } from "three";
import { useDispatch, useSelector } from "react-redux";
import { useDrawing } from "../hooks/useDrawing.js";

export const Scale = () => {
  const dispatch = useDispatch();
  const mesh = useRef();
  const left = useRef();
  const right = useRef();
  const [dragging, setDragging] = useState(null);
  const [dimensions, setDimensions] = useState({ l: 100, w: 15, h: 0 });
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const [position, setPosition] = useState(new Vector3(0, 0, 0));
  const [lineAngle, setLineAngle] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const { setLeftPos, setRightPos } = useDrawing();
  const { leftPos, rightPos } = useSelector((state) => state.drawing);

  // Move updateMesh outside of useEffect so it can be used globally
  const updateMesh = useCallback((pointA, pointB) => {
    const midpoint = new Vector3().addVectors(pointA, pointB).multiplyScalar(0.5);
    setPosition(midpoint);

    const angle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
    setLineAngle(angle);

    if (mesh.current) {
      mesh.current.rotation.z = angle;
      mesh.current.position.set(midpoint.x, midpoint.y, 0);
    }
  }, []);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      updateMesh(leftPos, rightPos);
      const l = Math.abs(rightPos.x - leftPos.x);
      setDimensions({ l, w: 15, h: 0 });
    }
  }, [firstLoad, leftPos, rightPos, updateMesh]);

  useEffect(() => {
    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();
    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const handlePointerMove = (event) => {
      if (!isDraggingBox && !dragging) return;

      let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const posX = x * (cameraWidth / 2);
      const posY = y * (cameraHeight / 2);

      const newPoint = new Vector3(posX, posY, 0);

      if (dragging) {
        if (dragging === mesh.current) {
          // Move the line freely and update points synchronously
          const delta = newPoint.sub(position);
          const updatedPosition = position.add(delta);
          setPosition(updatedPosition);
          updatePoints(updatedPosition);
        } else if (dragging === left) {
          // Move the left point horizontally only and adjust the line's length accordingly
          const updatedLeft = new Vector3(newPoint.x, left.current.position.y, 0);
          left.current.position.set(updatedLeft.x, updatedLeft.y, 0);
          setLeftPos(updatedLeft);

          const length = right.current.position.distanceTo(updatedLeft);
          setDimensions((prev) => ({ ...prev, l: length }));

          updateMesh(updatedLeft, right.current.position);
        } else if (dragging === right) {
          // Move the right point horizontally only and adjust the line's length accordingly
          const updatedRight = new Vector3(newPoint.x, right.current.position.y, 0);
          right.current.position.set(updatedRight.x, updatedRight.y, 0);
          setRightPos(updatedRight);

          const length = updatedRight.distanceTo(left.current.position);
          setDimensions((prev) => ({ ...prev, l: length }));

          updateMesh(left.current.position, updatedRight);
        }
      }
    };

    const updatePoints = (boxCenter) => {
      const halfLength = dimensions.l / 2;
      const leftPos = new Vector3(boxCenter.x - halfLength, boxCenter.y, 0);
      const rightPos = new Vector3(boxCenter.x + halfLength, boxCenter.y, 0);

      setLeftPos(leftPos);
      setRightPos(rightPos);
      left.current.position.set(leftPos.x, leftPos.y, 0);
      right.current.position.set(rightPos.x, rightPos.y, 0);

      // Synchronize the mesh immediately after updating points
      updateMesh(leftPos, rightPos);
    };

    canvasContainer.addEventListener("pointermove", handlePointerMove);

    return () => {
      canvasContainer.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDraggingBox, dragging, dimensions.l, position, lineAngle, updateMesh]);

  const handlePointerDownSphere = (event, sphereRef) => {
    setDragging(sphereRef);
    event.stopPropagation();
  };

  const handlePointerUpSphere = (event) => {
    setDragging(null);
    setIsDraggingBox(false);
    event.stopPropagation();
  };

  const handlePointerDownBox = (event) => {
    setDragging(mesh.current);
    setIsDraggingBox(true);
    event.stopPropagation();
  };

  const handlePointerUpBox = (event) => {
    setDragging(null);
    setIsDraggingBox(false);
    event.stopPropagation();
  };

  return (
    <>
      <mesh
        ref={mesh}
        position={position.toArray()}
        rotation={[0, 0, lineAngle]}
        onPointerDown={handlePointerDownBox}
        onPointerUp={handlePointerUpBox}
      >
        <boxGeometry args={[dimensions.l, 10, dimensions.h]} />
        <meshBasicMaterial color={"orange"} transparent={true} />
      </mesh>
      <mesh
        ref={left}
        position={leftPos.toArray()}
        onPointerDown={(event) => handlePointerDownSphere(event, left)}
        onPointerUp={handlePointerUpSphere}
      >
        <sphereGeometry args={[5, 8, 8]} />
        <meshBasicMaterial color={"brown"} />
      </mesh>
      <mesh
        ref={right}
        position={rightPos.toArray()}
        onPointerDown={(event) => handlePointerDownSphere(event, right)}
        onPointerUp={handlePointerUpSphere}
      >
        <sphereGeometry args={[5, 8, 8]} />
        <meshBasicMaterial color={"brown"} />
      </mesh>
    </>
  );
};
