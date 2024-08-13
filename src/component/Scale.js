import React, { useRef, useState, useEffect } from "react";
import { Vector3, Matrix4 } from "three";

import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant";
import {
  setFactor,
  setLeftPosState,
  setRightPosState,
  setScale,
} from "../features/drawing/drwingSlice.js";
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
  const [isPointerMoving, setIsPointerMoving] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const { handleDoubleClick, setLeftPos, setRightPos} = useDrawing();
  const { leftPos, rightPos } = useSelector((state) => state.drawing)

  useEffect(()=>{
    const updateMesh = (pointA, pointB) => {
      const midpoint = new Vector3().addVectors(pointA, pointB).multiplyScalar(0.5);
      console.log(midpoint)
      setPosition(midpoint);

      const angle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
      setLineAngle(angle);
      mesh.current.rotation.z = angle;

      mesh.current.position.set(midpoint.x, midpoint.y, 0);
    };


    if(firstLoad){
      setFirstLoad(false)
      updateMesh(leftPos, rightPos)
      const l = Math.abs(rightPos.x - leftPos.x)
      const w = Math.abs(rightPos.y - leftPos.y);
      const h = 0;
      setDimensions({l,w,h})
      // dispatch(setLeftPosState(new Vector3(-50, 0, 0)))
      // dispatch(setRightPosState(new Vector3(50, 0, 0)))
    }
  },[firstLoad])

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

      const newPoint = new Vector3(posX, posY, 0);

      if (dragging) {
        if (dragging === mesh.current) {
          const delta = newPoint.sub(position);
          setPosition(position.add(delta));
          updatePoints(position);
        } else if (dragging === left) {
          left.current.position.set(newPoint.x, newPoint.y, 0);
          setLeftPos(new Vector3(newPoint.x, newPoint.y, 0));

          const length = right.current.position.distanceTo(left.current.position);
          setDimensions((prev) => ({ ...prev, l: length }));

          updateMesh(left.current.position, right.current.position);
        } else if (dragging === right) {
          right.current.position.set(newPoint.x, newPoint.y, 0);
          setRightPos(new Vector3(newPoint.x, newPoint.y, 0));

          const length = right.current.position.distanceTo(left.current.position);
          setDimensions((prev) => ({ ...prev, l: length }));

          updateMesh(left.current.position, right.current.position);
        }
      }
    };

    const updateMesh = (pointA, pointB) => {
      const midpoint = new Vector3().addVectors(pointA, pointB).multiplyScalar(0.5);
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
      left.current.position.set(rotatedLeft.x, rotatedLeft.y, 0);
      right.current.position.set(rotatedRight.x, rotatedRight.y, 0);
    };

    canvasContainer.addEventListener("pointermove", handlePointerMove);

    return () => {
      cancelAnimationFrame(frameId);
      canvasContainer.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDraggingBox, dragging, dimensions.l, position, lineAngle, isPointerMoving]);

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
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={handleDoubleClick}
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
