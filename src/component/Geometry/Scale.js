import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Plane,
  Vector3,
  Matrix4,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  TextureLoader,
  RepeatWrapping,
} from "three";

import {
  setLeftPosState,
  setRightPosState,
} from "../../features/drawing/drwingSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useDrawing } from "../../hooks/useDrawing.js";
import usePoints from "../../hooks/usePoints.js";
import { resetShowFirstTimePopup, setShowFirstTimePopup } from "../../Actions/PopupAction.js";
import scale from "../../assets/scale.png"

export const Scale = () => {
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
  const { leftPos, rightPos, userLength } = useSelector((state) => state.drawing);
  const [leftJawActivated, setLeftJawActivated] = useState(false);
  const [rightJawActivated, setRightJawActivated] = useState(false);
  const tolerance = 1e-3;
  const { screenToNDC} = usePoints();
  const { showFirstTimePopup, firstTimePopupNumber, enableFirstTimePopup } =useSelector((state) => state.PopupState);

  const textureLoader = useMemo(() => new TextureLoader(), []);
  const texture = useMemo(
    () => textureLoader.load(scale), 
    [textureLoader]
  );
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;


  useEffect(() => {
    if (mesh.current) {
      const factor = dimensions.l / 24;
      texture.repeat.set(factor, 1);
    }
  }, [dimensions.l]);
  

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
      updateMesh(new Vector3(leftPos.x, leftPos.y, 0), new Vector3(rightPos.x, rightPos.y, 0));
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
    let frameId = null;

    const handlePointerMove = (event) => {
      if (!isDraggingBox && !dragging) return;

      if (!isPointerMoving) {
        setIsPointerMoving(true);
        frameId = requestAnimationFrame(() => {
          setIsPointerMoving(false);
        });
      }

      let newPoint = screenToNDC(event.clientX, event.clientY);

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
          dispatch(setLeftPosState({x:adjustedX, y:adjustedY, z:0}));

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
          dispatch(setRightPosState({x:adjustedX, y:adjustedY, z:0}));
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

      dispatch(setLeftPosState({x:rotatedLeft.x, y:rotatedLeft.y, z:0}));
      dispatch(setRightPosState({x:rotatedRight.x, y:rotatedRight.y, z:0}));
      leftJaw.current.position.set(rotatedLeft.x, rotatedLeft.y, 0);
      rightJaw.current.position.set(rotatedRight.x, rotatedRight.y, 0);
    };

    canvasContainer.addEventListener("pointermove", handlePointerMove);
    canvasContainer.addEventListener("pointerup", handlePointerUp);

    return () => {
      cancelAnimationFrame(frameId);
      canvasContainer.removeEventListener("pointermove", handlePointerMove);
      canvasContainer.removeEventListener("pointerup", handlePointerUp);
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
    if(showFirstTimePopup){
      dispatch(resetShowFirstTimePopup());
    }
    setDragging(mesh.current);
    setIsDraggingBox(true);
    event.stopPropagation();
  };

  const handlePointerDownJaw = (event, jawRef) => {
    document.getElementsByClassName('canvas-container')[0].style.cursor = "col-resize";

    const clickPosition = screenToNDC(event.clientX, event.clientY);

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
    if(dragging === leftJaw || dragging === rightJaw){
      showPopup();
    }else{
      setTimeout(()=>{
        showPopup();
      },5000)
    }
    setDragging(null);
    setIsDraggingBox(false);
    setLeftJawActivated(false);
    setRightJawActivated(false);
    event.stopPropagation();
  };

  const showPopup = () =>{
    if(userLength === 0 && !showFirstTimePopup && firstTimePopupNumber === 1 && enableFirstTimePopup){
      dispatch(setShowFirstTimePopup({
        showFirstTimePopup: true,
        firstTimePopupNumber: 2,
        popupDismissable: true,
        firstTimePopupType: "ui"
      }));
    }
  }

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
        {/* <meshBasicMaterial color={"#6360FB"} transparent={true} opacity={0.8} /> */}
        <meshBasicMaterial attach="material" map={texture} />
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
              ? [3, 30, 5] // Vertical
              : [30, 3, 5]
          } // Horizontal
        />
        <meshBasicMaterial color={leftJawActivated ? "red" : "#9E61FF"} transparent={true} opacity={0} />
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
              ? [3, 30, 5] // Vertical
              : [30, 3, 5]
          } // Horizontal
        />
        <meshBasicMaterial color={rightJawActivated ? "red" : "#9E61FF"} transparent={true} opacity={0} />
      </mesh>
      <mesh
        ref={leftJaw}
        position={[leftPos.x, leftPos.y, 3]}
      >
        <boxGeometry
          args={
            Math.abs(
              rightJaw.current?.position.y - leftJaw.current?.position.y
            ) < tolerance
              ? [2, 30, 0] // Vertical
              : [30, 2, 0]
          } // Horizontal
        />
        <meshBasicMaterial color={leftJawActivated ? "red" : "#9E61FF"} />
      </mesh>
      <mesh
        ref={rightJaw}
        position={[rightPos.x, rightPos.y, 3]}
      >
        <boxGeometry
          args={
            Math.abs(
              rightJaw.current?.position.y - leftJaw.current?.position.y
            ) < tolerance
              ? [2, 30, 0] // Vertical
              : [30, 2, 0]
          } // Horizontal
        />
        <meshBasicMaterial color={rightJawActivated ? "red" : "#9E61FF"} />
      </mesh>
    </>
  );
};
