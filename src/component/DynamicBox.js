// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { Vector3 } from "three";
// import { useSelector } from "react-redux";
// import convert from "convert-units";
// import { Grid, Line, Text, OrbitControls } from "@react-three/drei";

//  export const DynamicBox = ({ start, end, width, color }) => {
//     if (!start || !end) return null;

//     const length = start.distanceTo(end);
//     const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
//     const angle = Math.atan2(end.y - start.y, end.x - start.x);
//     const offset = new Vector3(-Math.sin(angle) * width / 2, Math.cos(angle) * width / 2, 0);
//     const adjustedMidpoint = midpoint.add(offset);
  
//     return (
//       <>
//         <mesh position={adjustedMidpoint} rotation={[0, 0, angle]}>
//           <boxGeometry args={[length, width, 0.1]} />
//           <meshBasicMaterial color={color} transparent={true} opacity={0.5} />
//         </mesh>
//         {/* Distance Text */}
//         <Text
//           position={[
//             (start.x + end.x) / 2,
//             (start.y + end.y) / 2 + 10,
//             0,
//           ]}
//           color="black"
//           anchorX="center"
//           anchorY="middle"
//           fontSize={10}
//           fontWeight="bold"
//         >
//           {`${length.toFixed(2)} mm`}
//         </Text>
//         {/* Angle Text */}
//         <Text
//           position={[
//             (start.x + end.x) / 2,
//             (start.y + end.y) / 2 - 20,
//             0,
//           ]}
//           color="black"
//           anchorX="center"
//           anchorY="middle"
//           fontSize={10}
//           fontWeight="bold"
//         >
//           {`${(angle * (180 / Math.PI)).toFixed(1)}°`}
//         </Text>
//       </>
//     );
// };






// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { Vector3, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, Line } from "three";
// import { Text } from "@react-three/drei";

// const DynamicBox = ({ start, end, width, color, measured, distance }) => {
//   if (!start || !end) return null;

//   const length = start.distanceTo(end);
//   const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
//   const angle = Math.atan2(end.y - start.y, end.x - start.x);
//   const offset = new Vector3(-Math.sin(angle) * width / 2, Math.cos(angle) * width / 2, 0);
//   const adjustedMidpoint = midpoint.add(offset);

//   // Adjust text positions to always be below the box
//   const textOffset = new Vector3(-Math.sin(angle) * 30, Math.cos(angle) * 30, 0);

//   // Create arc path for angle visualization
//   const arcRadius = 50;
//   const arcSegments = 64;
//   const arcVertices = [];

//   for (let i = 0; i <= arcSegments; i++) {
//     const segmentAngle = (i / arcSegments) * angle;
//     arcVertices.push(Math.cos(segmentAngle) * arcRadius, Math.sin(segmentAngle) * arcRadius, 0);
//   }

//   const arcGeometry = new BufferGeometry();
//   arcGeometry.setAttribute('position', new Float32BufferAttribute(arcVertices, 3));

//   // Calculate the position for the angle text and arc
//   const angleTextPosition = start.clone().add(new Vector3(Math.cos(angle / 2) * arcRadius, Math.sin(angle / 2) * arcRadius, 0));
//   const arcPosition = start.clone();

//   return (
//     <>
//       <mesh position={adjustedMidpoint} rotation={[0, 0, angle]}>
//         <boxGeometry args={[length, width, 0.1]} />
//         <meshBasicMaterial color={color} transparent={true} opacity={0.5} />
//       </mesh>
//       {/* Distance Text */}
//       <mesh position={adjustedMidpoint.clone().add(textOffset)}>
//         <planeGeometry args={[60, 20]} />
//         <meshBasicMaterial color="#f5f5f5" opacity={1} transparent={true} />
//         <Text
//           position={[0, 0, 0.1]}
//           color="black"
//           anchorX="center"
//           anchorY="middle"
//           fontSize={10}
//           fontWeight="bold"
//         >
//           {`${distance.toFixed(2)} ${measured}`}
//         </Text>
//       </mesh>
//       {/* Angle Text */}
//       <mesh position={angleTextPosition}>
//         <planeGeometry args={[30, 20]} />
//         <meshBasicMaterial color="#f5f5f5" opacity={1} transparent={true} />
//         <Text
//           position={[0, 0, 0.1]}
//           color="black"
//           anchorX="center"
//           anchorY="middle"
//           fontSize={10}
//           fontWeight="bold"
//         >
//           {`${(angle * (180 / Math.PI)).toFixed(1)}°`}
//         </Text>
//       </mesh>
//       {/* Angle Arc */}
//       <line geometry={arcGeometry} position={arcPosition}>
//         <lineBasicMaterial color="black" linewidth={1} />
//       </line>
//     </>
//   );
// };

// export default DynamicBox;
