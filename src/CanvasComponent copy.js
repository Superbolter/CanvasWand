// CanvasComponent.js
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import { AxesHelper } from 'three';

const CanvasComponent = () => {
  const [spheres, setSpheres] = useState([]);

  const handleClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;

    const x = (offsetX / event.target.clientWidth) * 2 - 1;
    const y = -(offsetY / event.target.clientHeight) * 2 + 1;

    setSpheres([...spheres, { x, y }]);
  };

  function Cube() {
    return (
      <mesh  position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    );
  }

  return (
    <Canvas onClick={handleClick}  style={{ height: window.innerHeight, width: window.innerWidth}}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {spheres.map((sphere, index) => (
        <Sphere
          key={index}
          position={[sphere.x * 5, sphere.y * 5, 0]}
          args={[0.2, 0.2, 0.2]}
        >
          <meshStandardMaterial attach="material" color="blue" />
        </Sphere>
      ))}

        <Cube/>

    </Canvas>
  );
};

export default CanvasComponent;
