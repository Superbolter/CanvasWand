import React, { useRef, useState, useEffect } from "react";
import {
  Plane,
  Vector3,
  Matrix4,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";

import {
  setLeftPosState,
  setRightPosState,
} from "../features/drawing/drwingSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useDrawing } from "../hooks/useDrawing.js";

export const Scale = ({ raycaster, mouse}) => {
  const dispatch = useDispatch();
  const mesh = useRef();
  const leftJaw = useRef();
  const rightJaw = useRef();
  const [dragging, setDragging] = useState(null);
  const [dimensions, setDimensions] = useState({ l: 100, w: 15, h: 0 });
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const [position, setPosition] = useState(new Vector3(0, 0, 0));
  const [lineAngle, setLineAngle] = useState(0);
  const [isPointerMoving, setIsPointerMoving] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const { handleDoubleClick, setLeftPos, setRightPos } = useDrawing();
  const { leftPos, rightPos } = useSelector((state) => state.drawing);
  const { cameraContext  } = useSelector((state) => state.Drawing);
  const [leftJawActivated, setLeftJawActivated] = useState(false);
  const [rightJawActivated, setRightJawActivated] = useState(false);
  const tolerance = 1e-3;

  useEffect(() => {
    const updateMesh = (pointA, pointB) => {
      const midpoint = new Vector3()
        .addVectors(pointA, pointB)
        .multiplyScalar(0.5);
      setPosition(midpoint);

      const angle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
      setLineAngle(angle);
      mesh.current.rotation.z = angle;

      mesh.current.position.set(midpoint.x, midpoint.y, 0);
    };

    if (firstLoad) {
      setFirstLoad(false);
      updateMesh(leftPos, rightPos);
      const l =
        Math.abs(rightPos.x - leftPos.x) < 15
          ? Math.abs(rightPos.y - leftPos.y)
          : Math.abs(rightPos.x - leftPos.x);
      const w = 15;
      const h = 0;
      setDimensions({ l, w, h });
      // dispatch(setLeftPosState(new Vector3(-50, 0, 0)))
      // dispatch(setRightPosState(new Vector3(50, 0, 0)))
    }
  }, [firstLoad]);

  useEffect(() => {
    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();
    const cameraWidth = rect.width;
    const cameraHeight = rect.height;
    let frameId = null;

    const handlePointerMove = (event) => {
      if (!isDraggingBox && !dragging) return;

      if (!isPointerMoving) {
        setIsPointerMoving(true);
        frameId = requestAnimationFrame(() => {
          setIsPointerMoving(false);
        });
      }

      let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const posX = x * (cameraWidth / 2);
      const posY = y * (cameraHeight / 2);

      let newPoint = new Vector3(posX, posY, 0);

      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
      // Update the raycaster with the camera and mouse position
      raycaster.current.setFromCamera(mouse.current, cameraContext);
  
      // Define a plane at z = 0 and find the intersection point
      const plane = new Plane(new Vector3(0, 0, 1), 0);
      const intersectionPoint = new Vector3();
      raycaster.current.ray.intersectPlane(plane, intersectionPoint);
      newPoint = intersectionPoint;

      if (dragging) {
        if (dragging === mesh.current) {
          const delta = newPoint.sub(position);
          setPosition(position.add(delta));
          updatePoints(position);
        } else if (dragging === leftJaw) {
          const rightPosition = rightJaw.current.position;
          let adjustedX = newPoint.x;
          let adjustedY = newPoint.y;

          if (Math.abs(newPoint.y - rightPosition.y) < 100) {
            // Align horizontally
            adjustedY = rightPosition.y;
          } else if (Math.abs(newPoint.x - rightPosition.x) < 100) {
            // Align vertically
            adjustedX = rightPosition.x;
          } else {
            adjustedX = rightPosition.x;
          }

          leftJaw.current.position.set(adjustedX, adjustedY, 0);
          setLeftPos(new Vector3(adjustedX, adjustedY, 0));

          const length = rightJaw.current.position.distanceTo(
            leftJaw.current.position
          );
          setDimensions((prev) => ({ ...prev, l: length }));

          updateMesh(leftJaw.current.position, rightJaw.current.position);
        } else if (dragging === rightJaw) {
          const leftPosition = leftJaw.current.position;
          let adjustedX = newPoint.x;
          let adjustedY = newPoint.y;

          if (Math.abs(newPoint.y - leftPosition.y) < 100) {
            // Align horizontally
            adjustedY = leftPosition.y;
          } else if (Math.abs(newPoint.x - leftPosition.x) < 100) {
            // Align vertically
            adjustedX = leftPosition.x;
          } else {
            adjustedX = leftPosition.x;
          }

          rightJaw.current.position.set(adjustedX, adjustedY, 0);
          setRightPos(new Vector3(adjustedX, adjustedY, 0));

          const length = rightJaw.current.position.distanceTo(
            leftJaw.current.position
          );
          setDimensions((prev) => ({ ...prev, l: length }));

          updateMesh(leftJaw.current.position, rightJaw.current.position);
        }
      }
    };

    const updateMesh = (pointA, pointB) => {
      const midpoint = new Vector3()
        .addVectors(pointA, pointB)
        .multiplyScalar(0.5);
      setPosition(midpoint);

      const angle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
      setLineAngle(angle);
      mesh.current.rotation.z = angle;

      mesh.current.position.set(midpoint.x, midpoint.y, 0);
    };

    const updatePoints = (boxCenter) => {
      const halfLength = dimensions.l / 2;
      const offset = new Vector3(halfLength, 0, 0);
      const rotationMatrix = new Matrix4().makeRotationZ(lineAngle);

      const rotatedOffset = offset.clone().applyMatrix4(rotationMatrix);

      const rotatedLeft = boxCenter.clone().sub(rotatedOffset);
      const rotatedRight = boxCenter.clone().add(rotatedOffset);

      setLeftPos(rotatedLeft);
      setRightPos(rotatedRight);
      leftJaw.current.position.set(rotatedLeft.x, rotatedLeft.y, 0);
      rightJaw.current.position.set(rotatedRight.x, rotatedRight.y, 0);
    };

    canvasContainer.addEventListener("pointermove", handlePointerMove);

    return () => {
      cancelAnimationFrame(frameId);
      canvasContainer.removeEventListener("pointermove", handlePointerMove);
    };
  }, [
    isDraggingBox,
    dragging,
    dimensions.l,
    position,
    lineAngle,
    isPointerMoving,
  ]);

  const isWithinRange = (clickPosition, jawPosition, range = 10) => {
    return clickPosition.distanceTo(jawPosition) <= range;
  };

  const handlePointerDownBox = (event) => {
    setDragging(mesh.current);
    setIsDraggingBox(true);
    event.stopPropagation();
  };

  const handlePointerDownJaw = (event, jawRef) => {
    document.getElementsByClassName('canvas-container')[0].style.cursor = "col-resize"
    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();
    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    let clickPosition = new Vector3(posX, posY, 0);
  
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.current.setFromCamera(mouse.current, cameraContext);

    // Define a plane at z = 0 and find the intersection point
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const intersectionPoint = new Vector3();
    raycaster.current.ray.intersectPlane(plane, intersectionPoint);

    clickPosition = intersectionPoint;

    if (
      jawRef.current === leftJaw.current &&
      isWithinRange(clickPosition, leftJaw.current.position)
    ) {
      setLeftJawActivated(true);
      setDragging(leftJaw);
    } else if (
      jawRef.current === rightJaw.current &&
      isWithinRange(clickPosition, rightJaw.current.position)
    ) {
      setRightJawActivated(true);
      setDragging(rightJaw);
    }

    event.stopPropagation();
  };

  const handlePointerUp = (event) => {
    document.getElementsByClassName('canvas-container')[0].style.cursor = "grab"
    setDragging(null);
    setIsDraggingBox(false);
    setLeftJawActivated(false);
    setRightJawActivated(false);
    event.stopPropagation();
  };

  // Create line segments for jaws with increased length
  const createJawLine = (start, end, lengthMultiplier = 2) => {
    const direction = new Vector3().subVectors(end, start).normalize();
    const extendedStart = start
      .clone()
      .add(direction.clone().multiplyScalar(-lengthMultiplier));
    const extendedEnd = end
      .clone()
      .add(direction.clone().multiplyScalar(lengthMultiplier));

    const geometry = new BufferGeometry().setFromPoints([
      extendedStart,
      extendedEnd,
    ]);
    const material = new LineBasicMaterial({ color: "brown" });
    return <lineSegments args={[geometry, material]} />;
  };

  return (
    <>
      <mesh
        ref={mesh}
        position={position.toArray()}
        rotation={[0, 0, lineAngle]}
        onPointerDown={handlePointerDownBox}
        onPointerUp={handlePointerUp}
      >
        <boxGeometry args={[dimensions.l, dimensions.w, dimensions.h]} />
        <meshBasicMaterial color={"#6360FB"} transparent={true} opacity={0.8} />
      </mesh>
      {createJawLine(leftJaw.current?.position || new Vector3(), position)}
      {createJawLine(rightJaw.current?.position || new Vector3(), position)}
      <mesh
        ref={leftJaw}
        position={[leftPos.x + 1.5, leftPos.y, 3]}
        onPointerDown={(event) => handlePointerDownJaw(event, leftJaw)}
        onPointerUp={handlePointerUp}
        onPointerOver={() => document.getElementsByClassName('canvas-container')[0].style.cursor = "col-resize"}
        onPointerOut={() => { if(!leftJawActivated) document.getElementsByClassName('canvas-container')[0].style.cursor = "grab"}}
      >
        <boxGeometry
          args={
            Math.abs(
              rightJaw.current?.position.y - leftJaw.current?.position.y
            ) < tolerance
              ? [3, 30, dimensions.h] // Vertical
              : [30, 3, dimensions.h]
          } // Horizontal
        />
        <meshBasicMaterial color={leftJawActivated ? "red" : "black"} />
      </mesh>
      <mesh
        ref={rightJaw}
        position={[rightPos.x - 1.5, rightPos.y, 3]}
        onPointerDown={(event) => handlePointerDownJaw(event, rightJaw)}
        onPointerUp={handlePointerUp}
        onPointerOver={() => document.getElementsByClassName('canvas-container')[0].style.cursor = "col-resize"}
        onPointerOut={() => {if(!rightJawActivated) document.getElementsByClassName('canvas-container')[0].style.cursor = "grab"}}
      >
        <boxGeometry
          args={
            Math.abs(
              rightJaw.current?.position.y - leftJaw.current?.position.y
            ) < tolerance
              ? [3, 30, dimensions.h] // Vertical
              : [30, 3, dimensions.h]
          } // Horizontal
        />
        <meshBasicMaterial color={rightJawActivated ? "red" : "black"} />
      </mesh>
    </>
  );
};
