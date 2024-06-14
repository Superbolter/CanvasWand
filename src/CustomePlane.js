import React, { useRef } from "react";
import * as THREE from "three";

const CustomPlane = ({ width, height }) => {
  const planeRef = useRef();

  return (
    <mesh ref={planeRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeBufferGeometry attach="geometry" args={[width, height]} />
      <meshStandardMaterial attach="material" color="lightblue" />
    </mesh>
  );
};

export default CustomPlane;
