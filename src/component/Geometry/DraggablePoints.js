import { useEffect, useState } from 'react';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import usePoints from '../../hooks/usePoints';

const DraggablePoint = ({ point, onDrag, index }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingPoint, setDraggingPoint] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(new Vector3(point.x, point.y, point.z));
  const {screenToNDC} = usePoints();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const pt = screenToNDC(e.clientX, e.clientY);
    if(pt.distanceTo(point) < 10){
        setDraggingPoint(index);
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    setDraggingPoint(null);
  };

  const handlePointerMove = (e) => {
    if (!isDragging && draggingPoint !==index) return;

    e.stopPropagation();
    
    // Calculate the new position based on raycast intersection with the plane
    const intersect = screenToNDC(e.clientX, e.clientY);
    if (intersect && draggingPoint === index) {
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
    //   onPointerDown={handlePointerDown} // Start dragging
    //   onPointerUp={handlePointerUp} // Stop dragging
    //   onPointerMove={handlePointerMove} // Handle movement while dragging
    //   scale={[0.2, 0.2, 0.2]} // Adjust size
    >
      <sphereGeometry args={[6, 6, 32]} />
      <meshBasicMaterial color="#4B73EC" />
    </mesh>
  );
};

export default DraggablePoint;
