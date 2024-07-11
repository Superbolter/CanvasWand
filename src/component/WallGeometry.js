// BoxGeometry.js
import { Vector3 } from "three";
import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { extend } from "@react-three/fiber";
import Brick1 from "../assets/Bricks1.jpg"; // Adjust the path to your texture
import * as THREE from "three";
import { useSelector } from "react-redux";
import convert from "convert-units";

const WallGeometry = ({
  start,
  end,
  dimension,
  widthchange,
  widthchangetype,
  isSelected,
  onClick,
  //handlePointClick,
  currentPoint,
  newPointMode,
  opacity = 0.5,
  type,
}) => {
  const texture = useLoader(TextureLoader, Brick1);
  const { measured,factor } = useSelector((state) => state.drawing);

  if (!start || !end) return null;

  const length = start.distanceTo(end);
  const height = convert(dimension.height*factor[2]).from("mm").to(measured);
  const width = convert(dimension.width*factor[1]).from("mm").to(measured);
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.48);

  if(end.y === start.y){
    if (widthchangetype === 'inside') {
      // Adjust the width to inside (keeping the horizontal level unchanged)
      midpoint.y += widthchange ;
    } else if (widthchangetype === 'outside') {
      // Adjust the width to outside (keeping the horizontal level unchanged)
      midpoint.y -= widthchange ;
     
    }
  }
  else{
    if (widthchangetype === 'inside') {
      // Adjust the width to inside (keeping the vertical level unchanged)
      midpoint.x -= widthchange ;
     
    } else if (widthchangetype === 'outside') {
      // Adjust the width to outside (keeping the vertical level unchanged)

      midpoint.x += widthchange ;
      
    }
  }

  // Determine the rotation angle for the box
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  

  return (
    <>
    { type !=="imaginary" && (<mesh
        position={[midpoint.x, midpoint.y, midpoint.z + height/2]}
        rotation={[0, 0, angle]}
      >
        <boxGeometry
          args={[
            length,
            width,
            height,
          ]}
        />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>)}
    </>
  );
};

export default WallGeometry;

