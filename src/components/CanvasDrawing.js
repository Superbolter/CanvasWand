// src/components/CanvasDrawing.js
import React from "react";
import { Canvas } from "@react-three/fiber";
import TexturedPlane from "./TexturedPlane";
import { useSelector } from "react-redux";
import AxesHelper from "./AxesHelper";
import CameraControls from "./CameraControls";
import Wall3D from "./Wall3D";

const CanvasDrawing = ({texture}) => {

    const {
        is3D,
        walls3D,
      } = useSelector((state) => state.drawing);
  return is3D ? (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: 0,
      }}
    >
      <ambientLight intensity={1} />
      {texture && <TexturedPlane texture={texture} />}
      <AxesHelper />
      <CameraControls />
      {walls3D.map((wall, index) => (
        <Wall3D
          key={index}
          start={wall.start}
          end={wall.end}
          height={wall.height}
          width={wall.width}
        />
      ))}
    </Canvas>
  ) : null;
};

export default CanvasDrawing;
