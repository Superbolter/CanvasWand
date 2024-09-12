import { useEffect, useState } from 'react';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import usePoints from '../../hooks/usePoints';
import { useSelector } from 'react-redux';
import newCursor from "../../assets/linedraw.png";

const DraggablePoint = ({ point, onDrag, index }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPoint, setDraggingPoint] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(new Vector3(point.x, point.y, point.z));
  const {screenToNDC} = usePoints();
  const {enablePolygonSelection} = useSelector(((state) => state.Drawing));

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const pt = screenToNDC(e.clientX, e.clientY);
    if(pt.distanceTo(point) < 10){
        setDraggingPoint(index);
        document.getElementsByClassName('canvas-container')[0].style.cursor = "move"
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    setDraggingPoint(null);
    if(enablePolygonSelection){
      document.getElementsByClassName('canvas-container')[0].style.cursor = `url(${newCursor}) 16 16, crosshair`
    }else{
      document.getElementsByClassName('canvas-container')[0].style.cursor = "default"
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging && draggingPoint !==index) return;

    e.stopPropagation();
    
    // Calculate the new position based on raycast intersection with the plane
    const intersect = screenToNDC(e.clientX, e.clientY);
    if (intersect && draggingPoint === index) {
      document.getElementsByClassName('canvas-container')[0].style.cursor = "move"
      setCurrentPosition(new Vector3(intersect.x, intersect.y, point.z)); // Only update x and y, keep z constant
      onDrag(intersect); // Update the parent with the new position
    }
  };

  useEffect(()=>{
    const canvasContainer = document.querySelector(".canvas-container");
    
    canvasContainer.addEventListener("pointermove", handlePointerMove);
    canvasContainer.addEventListener("pointerup", handlePointerUp);
    canvasContainer.addEventListener("pointerdown", handlePointerDown);
    return () => {
      canvasContainer.removeEventListener("pointermove", handlePointerMove);
      canvasContainer.removeEventListener("pointerup", handlePointerUp);
      canvasContainer.removeEventListener("pointerdown", handlePointerDown);
    };
  })

  return (
    <mesh
      position={currentPosition}
      onPointerOver={() => document.getElementsByClassName('canvas-container')[0].style.cursor = "move"}
      onPointerOut={() => { if(enablePolygonSelection){
        document.getElementsByClassName('canvas-container')[0].style.cursor = `url(${newCursor}) 16 16, crosshair`  
      }else{
        document.getElementsByClassName('canvas-container')[0].style.cursor = "default"
      }
    }}
    >
      <sphereGeometry args={[6, 6, 32]} />
      <meshBasicMaterial color="#4B73EC" />
    </mesh>
  );
};

export default DraggablePoint;
