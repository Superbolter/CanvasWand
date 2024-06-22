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
      <mesh
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
      </mesh>
    </>
  );
};

export default WallGeometry;

// import React, { useMemo } from 'react';
// import { useLoader } from '@react-three/fiber';
// import { TextureLoader } from 'three';
// import { extend } from '@react-three/fiber';
// import { BoxGeometry } from 'three';
// import Brick1 from '../assets/Bricks1.jpg'; // Adjust the path to your texture
// import * as THREE from 'three';

// extend({ BoxGeometry });

// const WallGeometry = ({ start, end, height = 10, isSelected, onClick }) => {
//   const length = start.distanceTo(end);
//   const midpoint = start.clone().lerp(end, 0.5);
//   const angle = Math.atan2(end.y - start.y, end.x - start.x);

//   // Load textures using useMemo for performance optimization
//   const texture = useLoader(TextureLoader, Brick1);
//   console.log(texture);
//   // const bumpMapTexture = useMemo(() => {
//   //   const bumpMap = new TextureLoader().load(Brick1);
//   //   bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
//   //   bumpMap.repeat.set(length / 1, height / 1);
//   //   return bumpMap;
//   // }, [length, height]);

//   // const normalMapTexture = useMemo(() => {
//   //   const normalMap = new TextureLoader().load(Brick1);
//   //   normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
//   //   normalMap.repeat.set(length / 1, height / 1);
//   //   return normalMap;
//   // }, [length, height]);

//   return (
//    <>
//     <mesh position={midpoint} rotation={[0, 0, angle]} onClick={onClick}>
//       <boxGeometry args={[length, height, 10]} />
//       <meshStandardMaterial
//         //map={texture}
//         // bumpMap={bumpMapTexture}
//         // normalMap={normalMapTexture}
//         // bumpScale={0.2}
//         // roughness={0.7}
//         // metalness={0.0}
//         side={THREE.DoubleSide}
//         //color={isSelected ? 'green' : 'white'}
//       />
//     </mesh>
//      <mesh >
//      <sphereGeometry args={[10, 16, 16]} />
//      <meshBasicMaterial  map={texture}
//         // bumpMap={bumpMapTexture}
//         // normalMap={normalMapTexture}
//         // bumpScale={0.2}
//         // roughness={0.7}
//         // metalness={0.0}
//         side={THREE.DoubleSide} />
//    </mesh></>
//   );
// };

// export default WallGeometry;

// import { Vector3 } from "three";
// import React from 'react';
// import { useLoader } from '@react-three/fiber';
// import { TextureLoader } from 'three';
// import Brick1 from '../assets/Bricks1.jpg'; // Adjust the path to your texture
// import * as THREE from 'three';

// const WallGeometry = ({ start, end, width = 10, baseHeight = 20 }) => {
//   const texture = useLoader(TextureLoader, Brick1);

//   if (!start || !end) return null;

//   const length = start.distanceTo(end);
//   const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5); // Using 0.5 for the midpoint
//   const angle = Math.atan2(end.y - start.y, end.x - start.x);

//   // Calculate dimensions for the wall and base
//   const boxWidth = width; // Width of the wall
//   const boxHeight = 60; // Height of the wall
//   const boxLength = length; // Length of the wall
//   const baseWidth = width; // Width of the base (same as wall width)

//   // Calculate the base position
//   const basePosition = new Vector3(midpoint.x, 0, midpoint.z);

//   return (
//     <>
//       {/* Wall */}
//       <mesh position={midpoint} rotation={[0, 0, angle]}>
//         <boxGeometry args={[boxLength, boxHeight, boxWidth]} />
//         <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
//       </mesh>

//       {/* Base */}
//       <mesh position={[basePosition.x, basePosition.y, basePosition.z]} rotation={[0, 0, angle]}>
//         <boxGeometry args={[boxLength, baseHeight, baseWidth]} />
//         <meshBasicMaterial color={0x808080} />
//       </mesh>
//     </>
//   );
// };

// export default WallGeometry;
