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


import React from "react";
import { extend } from "@react-three/fiber";
import { Shape, ShapeGeometry, MeshBasicMaterial } from "three";

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
  if (!p1 || !p2 || !p3 || !p4) {
    console.error("One or more points are undefined", { p1, p2, p3, p4 });
    return null;
  }

  

  const shape = createQuadrilateral(p1, p2, p3, p4);
  const geometry = new ShapeGeometry(shape);
  const material = new MeshBasicMaterial({ color: '#787878', transparent: true });

  return (
    <mesh>
    <shapeGeometry attach="geometry" args={[shape]} />
    <meshBasicMaterial attach="material" args={[material]} />
    </mesh>
  );
};

export default CreateFiller;

