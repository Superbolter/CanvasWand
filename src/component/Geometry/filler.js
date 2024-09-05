// import React from "react";
// import { extend } from "@react-three/fiber";
// import { Vector3, Shape, ShapeGeometry, MeshBasicMaterial } from "three";

// // Extend the R3F renderer with ShapeGeometry
// extend({ ShapeGeometry });

// const createTriangle = (p1, p2, p3) => {
//   console.log("shape creation called",p1,p2,p3);
//   const shape = new Shape();
//   shape.moveTo(p1.x, p1.y);
//   shape.lineTo(p2.x, p2.y);
//   shape.lineTo(p3.x, p3.y);
//   shape.closePath();
//   return shape;
// };

// const CreateFiller = ({ p1, p2, p3,p4 }) => {


//     if (!p1 || !p2 || !p3 || !p4) {
//         console.error("One or more points are undefined", { p1, p2, p3, p4 });
//         return null;
//       }
//   const shape = createTriangle(p1, p4, p3);
//   const geometry = new ShapeGeometry(shape);
//   const material = new MeshBasicMaterial({ color: '#787878', transparent: true });

//   const fillerMidpoint = new Vector3().addVectors(p1, p4, p3).multiplyScalar(1 / 3);
//   return (
//     <mesh>
//       <shapeGeometry attach="geometry" args={[shape]} />
//       <meshBasicMaterial attach="material" args={[material]} />
//     </mesh>
//   );
// };

// export default CreateFiller;


import React, { useMemo } from "react";
import { extend } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { Shape, ShapeGeometry, MeshBasicMaterial,TextureLoader } from "three";
import Wall from "../../assets/Walll.png"

// Extend the R3F renderer with ShapeGeometry
extend({ ShapeGeometry });

const createQuadrilateral = (p1, p2, p3, p4) => {
  const shape = new Shape();
  shape.moveTo(p4.x, p4.y);
  shape.lineTo(p2.x, p2.y);
  shape.lineTo(p3.x, p3.y);
  shape.lineTo(p1.x, p1.y);
  shape.lineTo(p4.x, p4.y); // Close the shape by going back to the first point
  return shape;
};

const CreateFiller = ({ p1, p2, p3, p4 }) => {
  const textureLoader = useMemo(() => new TextureLoader(), []);
  const { measured, roomSelect, newline, linePlacementMode } = useSelector(
    (state) => state.drawing
  );

  const wallTexture = useMemo(
    () => textureLoader.load(Wall), // Replace with the path to your window image
    [textureLoader]
  );
  if (!p1 || !p2 || !p3 || !p4||linePlacementMode==="midpoint") {
    // console.error("One or more points are undefined", { p1, p2, p3, p4 });
    return null;
  }

  
  //console.log("Hello create filler", p1, p2, p3, p4);
  const shape = createQuadrilateral(p1, p2, p3, p4);
  const geometry = new ShapeGeometry(shape);
  const material = new MeshBasicMaterial({ color: '#787878', transparent: true });

  return (
    <mesh>
    <shapeGeometry attach="geometry" args={[shape]} />
    {/* <meshBasicMaterial attach="material" args={[material]} transparent={true} opacity={0.75}/> */}
    <meshBasicMaterial map={wallTexture} transparent={true} opacity={0.9}/>
    </mesh>
  );
};

export default CreateFiller;

