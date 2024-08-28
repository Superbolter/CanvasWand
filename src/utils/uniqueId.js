import {v4 as uuidv4} from 'uuid';
import { Vector3 } from "three";

export const uniqueId = () => {
    let uniqueId = uuidv4();
    return uniqueId;
};








// export const calculateAlignedPoint = (previousprevpoint, previousPoint, newPosition) => {
//   const [x0, y0, z0] = previousprevpoint;
//   const [x1, y1, z1] = previousPoint;
//   const [x2, y2, z2] = newPosition;

//   // Calculate the angle between previousprevpoint and previousPoint
//   const dxPrev = x1 - x0;
//   const dyPrev = y1 - y0;
//   const anglePrev = Math.atan2(dyPrev, dxPrev) * (180 / Math.PI);

//   // Calculate the angle between previousPoint and newPosition
//   const dxNew = x2 - x1;
//   const dyNew = y2 - y1;
//   const angleNew = Math.atan2(dyNew, dxNew) * (180 / Math.PI);

//   const tolerance = 10;
//   let newPoint = new Vector3(x2, y2, z2);

//   // Handle case when previousprevpoint is at the origin (0,0,0)
//   if (x0 === 0 && y0 === 0 && z0 === 0) {
//     if (Math.abs(dxNew) < tolerance) {
//       // Align vertically if near vertical
//       newPoint.setX(x1);
//     } else if (Math.abs(dyNew) < tolerance) {
//       // Align horizontally if near horizontal
//       newPoint.setY(y1);
//     }
//     return newPoint;
//   }

//   // Determine alignment based on the previous line's angle
//   const isNearHorizontal = Math.abs(anglePrev) <= tolerance || Math.abs(anglePrev - 180) <= tolerance;
//   const isNearVertical = Math.abs(anglePrev - 90) <= tolerance || Math.abs(anglePrev - 270) <= tolerance;


//     if (Math.abs(angleNew - anglePrev) <= tolerance || Math.abs(360 - Math.abs(angleNew - anglePrev)) <= tolerance) {

//       console.log("hello from general case");
    
//       // Check if the points are near vertical (i.e., x1 ≈ x2)
//       if (Math.abs(x1 - x2) <= tolerance) {
//         // Set the new point's x-coordinate to align vertically
//         newPoint.setX(x1);
//       } else {
//         // Calculate the slope and intercept for the general case
//         const slope = Math.tan(anglePrev * (Math.PI / 180));
//         const intercept = y1 - slope * x1;
//         newPoint.setY(slope * newPoint.x + intercept);
//       }
    
//     } else {
//       // Free movement when the new angle doesn't match the previous alignment closely
//       newPoint.setX(x2);
//       newPoint.setY(y2);
//     }
    
//     return newPoint;
    
//   //}


// };



export const calculateAlignedPoint = (previousPoint, newPosition) => {
  const [x1, y1, z1] = previousPoint;
  const [x2, y2, z2] = newPosition;

  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  const dz = Math.abs(z1 - z2);

  let newPoint = new Vector3(x2, y2, z2);

  if (dx >= dy && dx >= dz) {
    newPoint.setY(y1); 
    newPoint.setZ(z1); 
  } else if (dy >= dx && dy >= dz) {
    newPoint.setX(x1); 
    newPoint.setZ(z1); 
  } else {
    newPoint.setX(x1); 
    newPoint.setY(y1); 
  }

  return newPoint;
};









  export const replaceValue =( updatedPoints,oldValue,newValue)=>{
    console.log("hii", updatedPoints,oldValue,newValue);
    return updatedPoints.map(val=>val===oldValue?newValue:val);
  };
  