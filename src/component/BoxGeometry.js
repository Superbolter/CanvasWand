// BoxGeometry.js
import React from "react";
import { Vector3 } from "three";

const BoxGeometry = ({ start, end, width = 20, isSelected, onClick, handlePointClick, currentPoint, newPointMode, opacity = 0.5 }) => {
  if (!start || !end) return null;

  const length = start.distanceTo(end);
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Determine the rotation angle for the box
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  return (
    <>
      <mesh position={midpoint} rotation={[0, 0, angle]} onClick={onClick}>
        <boxGeometry args={[length, width, 0]} />
        <meshBasicMaterial color={isSelected ? "green" : "blue"} transparent={true} opacity={opacity} />
      </mesh>
      <mesh position={start} onClick={(e) => { e.stopPropagation(); handlePointClick(start); }}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshBasicMaterial color={(newPointMode && start.equals(currentPoint)) ? "yellow" : "red"} transparent={true} opacity={opacity} />
      </mesh>
      <mesh position={end} onClick={(e) => { e.stopPropagation(); handlePointClick(end); }}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshBasicMaterial color={(newPointMode && end.equals(currentPoint)) ? "yellow" : "red"} transparent={true} opacity={opacity} />
      </mesh>
    </>
  );
};

export default BoxGeometry;