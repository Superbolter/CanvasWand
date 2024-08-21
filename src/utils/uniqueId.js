import {v4 as uuidv4} from 'uuid';
import { Vector3 } from "three";

export const uniqueId = () => {
    let uniqueId = uuidv4();
    return uniqueId;
};



// export const calculateAlignedPoint = (previousPoint, newPosition) => {
//   const [x1, y1, z1] = previousPoint;
//   const [x2, y2, z2] = newPosition;

//   const dx = Math.abs(x1 - x2);
//   const dy = Math.abs(y1 - y2);
//   const dz = Math.abs(z1 - z2);

//   let newPoint = new Vector3(x2, y2, z2);

//   // Only apply alignment if the difference is less than 30
//   if (dx >= dy && dx<100) {
//     newPoint.setY(y1); 
//     newPoint.setZ(z1); 
//   } else if (dy >= dx && dy<100) {
//     newPoint.setX(x1); 
//     newPoint.setZ(z1); 
//   } 

//   return newPoint;
// };






// export const calculateAlignedPoint = (previousprevpoint, previousPoint, newPosition) => {
//   const [x0, y0, z0] = previousprevpoint;
//   const [x1, y1, z1] = previousPoint;
//   const [x2, y2, z2] = newPosition;

//   let anglePrev;

//   // If previousprevpoint is at the origin, create an imaginary line
//   if (x0 === 0 && y0 === 0 && z0 === 0) {
//     anglePrev = 0; // Horizontal line
//   } else {
//     // Calculate the angle between previousprevpoint and previousPoint
//     anglePrev = Math.atan2(y1 - y0, x1 - x0) * (180 / Math.PI);
//   }

//   // Calculate the angle between previousPoint and newPosition
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const angleNew = Math.atan2(dy, dx) * (180 / Math.PI);

//   // Calculate the difference in angles
//   const angleDifference = Math.abs(anglePrev - angleNew);

//   let newPoint = new Vector3(x2, y2, z2);

//   // Define the tolerance for alignment
//   const tolerance = 5;

//   // Check if angle difference is within tolerance for straight lines
//   if (
//     (Math.abs(angleDifference) <= tolerance) || // 0 degrees
//     (Math.abs(angleDifference - 90) <= tolerance) || // 90 degrees
//     (Math.abs(angleDifference - 180) <= tolerance) || // 180 degrees
//     (Math.abs(angleDifference - 270) <= tolerance)    // 270 degrees
//   ) {
//     // Align the new position with the previous line
//     if (Math.abs(angleDifference) <= tolerance || Math.abs(angleDifference - 180) <= tolerance) {
//       // Horizontal alignment
//       newPoint.setY(y1); // Align Y with the previous point
//     } else if (Math.abs(angleDifference - 90) <= tolerance || Math.abs(angleDifference - 270) <= tolerance) {
//       // Vertical alignment
//       newPoint.setX(x1); // Align X with the previous point
//     }
//   } 

//   return newPoint;
// };





// export const calculateAlignedPoint = (previousprevpoint, previousPoint, newPosition) => {
//   const [x0, y0, z0] = previousprevpoint;
//   const [x1, y1, z1] = previousPoint;
//   const [x2, y2, z2] = newPosition;

//   let anglePrev;

//   // If previousprevpoint is at the origin, create an imaginary line
//   if (x0 === 0 && y0 === 0 && z0 === 0) {
//     anglePrev = 0; // Horizontal line
//   } else {
//     // Calculate the angle between previousprevpoint and previousPoint
//     anglePrev = Math.atan2(y1 - y0, x1 - x0) * (180 / Math.PI);
//   }

//   // Calculate the angle between previousPoint and newPosition
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const angleNew = Math.atan2(dy, dx) * (180 / Math.PI);

//   // Calculate the difference in angles
//   const angleDifference = Math.abs(anglePrev - angleNew);

//   let newPoint = new Vector3(x2, y2, z2);

//   // Define the tolerance for alignment
//   const tolerance = 5;

//   // Check if the previous line is vertical
//   const isPreviousVertical = Math.abs(anglePrev - 90) <= tolerance || Math.abs(anglePrev - 270) <= tolerance;

//   // Check if angle difference is within tolerance for straight lines
//   if (
//     (Math.abs(angleDifference) <= tolerance) || // 0 degrees
//     (Math.abs(angleDifference - 90) <= tolerance) || // 90 degrees
//     (Math.abs(angleDifference - 180) <= tolerance) || // 180 degrees
//     (Math.abs(angleDifference - 270) <= tolerance)    // 270 degrees
//   ) {
//     // Align the new position with the previous line
//     if (Math.abs(angleDifference) <= tolerance || Math.abs(angleDifference - 180) <= tolerance) {
//       // Horizontal alignment
//       newPoint.setY(y1); // Align Y with the previous point
//     } else if (Math.abs(angleDifference - 90) <= tolerance || Math.abs(angleDifference - 270) <= tolerance) {
//       // Vertical alignment
//       newPoint.setX(x1); // Align X with the previous point
//     }
//   } else if (isPreviousVertical) {
//     // Optimize for vertical previous line
//     newPoint.setX(x1); // Align X with the previous point if the previous line is vertical
//   }

//   return newPoint;
// };








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

//   // Calculate the difference in angles
//   const angleDifference = Math.abs(anglePrev - angleNew);
//   const tolerance = 10;

//   let newPoint = new Vector3(x2, y2, z2);

//   // Determine if the angle between the lines is within the tolerance
//   if (angleDifference <= tolerance || (360 - angleDifference) <= tolerance) {
//     // Maintain the alignment based on the previous line's angle
//     if (Math.abs(anglePrev - 0) <= tolerance || Math.abs(anglePrev - 180) <= tolerance) {
//       // Horizontal alignment
//       newPoint.setY(y1); // Align Y with the previous point
//     } else if (Math.abs(anglePrev - 90) <= tolerance || Math.abs(anglePrev - 270) <= tolerance) {
//       // Vertical alignment
//       newPoint.setX(x1); // Align X with the previous point
//     } else {
//       // General alignment based on previous line's angle
//       const slope = Math.tan(anglePrev * (Math.PI / 180));
//       newPoint.setY(y1 + slope * (newPoint.x - x1));
//     }
//   }

//   return newPoint;
// };








// export const calculateAlignedPoint = (previousprevpoint, previousPoint, newPosition) => {
//   const [x0, y0, z0] = previousprevpoint;
//   const [x1, y1, z1] = previousPoint;
//   const [x2, y2, z2] = newPosition;
//   const dx = Math.abs(x1 - x2);
//   const dy = Math.abs(y1 - y2);
//   const dz = Math.abs(z1 - z2);

//   // Calculate the angle between previousprevpoint and previousPoint
//   const dxPrev = x1 - x0;
//   const dyPrev = y1 - y0;
//   const anglePrev = Math.atan2(dyPrev, dxPrev) * (180 / Math.PI);

//   // Calculate the angle between previousPoint and newPosition
//   const dxNew = x2 - x1;
//   const dyNew = y2 - y1;
//   const angleNew = Math.atan2(dyNew, dxNew) * (180 / Math.PI);

//   // Calculate the difference in angles
//   const angleDifference = Math.abs(anglePrev - angleNew);
//   const tolerance = 10;

//   let newPoint = new Vector3(x2, y2, z2);

//   // Determine if the angle between the lines is within the tolerance
//   if (angleDifference <= tolerance || (360 - angleDifference) <= tolerance) {
//     // Maintain the alignment based on the previous line's angle


//     if (dx<10 && dx<dy) {
//       // Previous line is vertical
//       newPoint.setX(x1); // Align X with the previous point for vertical lines
//     }
//     else{
//       // Maintain alignment based on previous line's angle
//       const slope = Math.tan(anglePrev * (Math.PI / 180));
//       const intercept = y1 - slope * x1;
//       newPoint.setY(slope * newPoint.x + intercept);
//     }
    
//   }

//   return newPoint;
// };








export const calculateAlignedPoint = (previousprevpoint, previousPoint, newPosition) => {
  const [x0, y0, z0] = previousprevpoint;
  const [x1, y1, z1] = previousPoint;
  const [x2, y2, z2] = newPosition;

  // Calculate the angle between previousprevpoint and previousPoint
  const dxPrev = x1 - x0;
  const dyPrev = y1 - y0;
  const anglePrev = Math.atan2(dyPrev, dxPrev) * (180 / Math.PI);

  // Calculate the angle between previousPoint and newPosition
  const dxNew = x2 - x1;
  const dyNew = y2 - y1;
  const angleNew = Math.atan2(dyNew, dxNew) * (180 / Math.PI);

  const tolerance = 10;
  let newPoint = new Vector3(x2, y2, z2);

  // Handle case when previousprevpoint is at the origin (0,0,0)
  if (x0 === 0 && y0 === 0 && z0 === 0) {
    if (Math.abs(dxNew) < tolerance) {
      // Align vertically if near vertical
      newPoint.setX(x1);
    } else if (Math.abs(dyNew) < tolerance) {
      // Align horizontally if near horizontal
      newPoint.setY(y1);
    }
    return newPoint;
  }

  // Determine alignment based on the previous line's angle
  const isNearHorizontal = Math.abs(anglePrev) <= tolerance || Math.abs(anglePrev - 180) <= tolerance;
  const isNearVertical = Math.abs(anglePrev - 90) <= tolerance || Math.abs(anglePrev - 270) <= tolerance;

  // if (isNearHorizontal) {
  //   if (Math.abs(angleNew) <= tolerance || Math.abs(angleNew - 180) <= tolerance) {
  //     // Snap to horizontal if the new angle is close to 0° or 180°
  //     newPoint.setY(y1);
  //   } else {
  //     // Free movement in X direction, follow the mouse for Y direction
  //     newPoint.setY(y2);
  //   }
  // } else if (isNearVertical) {
  //   console.log("hello from vertical");
  //   if (Math.abs(angleNew - 90) <= tolerance || Math.abs(angleNew - 270) <= tolerance) {
  //     console.log("hello inside vertical");
  //     // Snap to vertical if the new angle is close to 90° or 270°
  //     newPoint.setX(x1);
  //   } else {
  //     // Free movement in Y direction, follow the mouse for X direction
  //     newPoint.setX(x2);
  //   }
  // } else {
    // Handle the general case: snapping based on previous angle alignment
    if (Math.abs(angleNew - anglePrev) <= tolerance || Math.abs(360 - Math.abs(angleNew - anglePrev)) <= tolerance) {

      console.log("hello from general case");
    
      // Check if the points are near vertical (i.e., x1 ≈ x2)
      if (Math.abs(x1 - x2) <= tolerance) {
        // Set the new point's x-coordinate to align vertically
        newPoint.setX(x1);
      } else {
        // Calculate the slope and intercept for the general case
        const slope = Math.tan(anglePrev * (Math.PI / 180));
        const intercept = y1 - slope * x1;
        newPoint.setY(slope * newPoint.x + intercept);
      }
    
    } else {
      // Free movement when the new angle doesn't match the previous alignment closely
      newPoint.setX(x2);
      newPoint.setY(y2);
    }
    
    return newPoint;
    
  //}


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

//   // Calculate the difference in angles
//   const angleDifference = Math.abs(anglePrev - angleNew);
//   const tolerance = 10;

//   let newPoint = new Vector3(x2, y2, z2);

//   // Check if previousprevpoint is at the origin
//   if (x0 === 0 && y0 === 0 && z0 === 0) {
//     // Handle alignment based on near-horizontal or near-vertical
//     if (Math.abs(dxNew) < tolerance || Math.abs(dyNew) < tolerance) {
//       if (Math.abs(dxNew) < Math.abs(dyNew)) {
//         // Near vertical alignment
//         newPoint.setX(x1);
//       } else {
//         // Near horizontal alignment
//         newPoint.setY(y1);
//       }
//     }
//   } else {
//     // Determine alignment based on the previous line's angle
//     const isNearVertical = Math.abs(anglePrev - 90) <= tolerance || Math.abs(anglePrev - 270) <= tolerance;
//     const isNearHorizontal = Math.abs(anglePrev) <= tolerance || Math.abs(anglePrev - 180) <= tolerance;

//     if (isNearVertical) {
//       // Previous line is near vertical
//       if (Math.abs(dxNew) < 1) {
//         // Align X with the previous point for vertical lines
//         newPoint.setX(x1);
//       } else {
//         // Free movement in the X direction when angle is not close to vertical
//         newPoint.setX(x2);
//       }
//     } else if (isNearHorizontal) {
//       // Previous line is near horizontal
//       if (Math.abs(dyNew) < 10) {
//         // Align Y with the previous point for horizontal lines
//         newPoint.setY(y1);
//       } else {
//         // Free movement in the Y direction when angle is not close to horizontal
//         newPoint.setY(y2);
//       }
//     } else {
//       // General case: Maintain alignment based on previous line's angle
//       if (angleDifference <= tolerance || (360 - angleDifference) <= tolerance) {
//         const slope = Math.tan(anglePrev * (Math.PI / 180));
//         const intercept = y1 - slope * x1;
//         newPoint.setY(slope * newPoint.x + intercept);
//       }
//     }
//   }

//   return newPoint;
// };





// export const calculateAlignedPoint = (previousprevpoint,previousPoint, newPosition) => {
//   const [x1, y1, z1] = previousPoint;
//   const [x2, y2, z2] = newPosition;

//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const dz = z2 - z1;

//   // Calculate angles in the XZ and YZ planes
//   const angleXZ = Math.atan2(dz, dx) * (180 / Math.PI); // Angle in the XZ plane
//   const angleYZ = Math.atan2(dy, dz) * (180 / Math.PI); // Angle in the YZ plane

//   let newPoint = new Vector3(x2, y2, z2);

//   // Consider a slightly wider angle range, e.g., ±10 degrees
//   if (Math.abs(angleXZ) < 10) {
//     newPoint.setY(y1); // Keep Y aligned with the previous point
//   } else if (Math.abs(angleYZ) < 10) {
//     newPoint.setX(x1); // Keep X aligned with the previous point
//   } else {
//     return new Vector3(x2, y2, z2);
//   }

//   return newPoint;
// };



  export const replaceValue =( updatedPoints,oldValue,newValue)=>{
    console.log("hii", updatedPoints,oldValue,newValue);
    return updatedPoints.map(val=>val===oldValue?newValue:val);
  };
  