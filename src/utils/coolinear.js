

import { SNAPPING_THRESHOLD } from "../constant/constant";

export const findLineForPoint = (point, storeLines) => {
    for (let line of storeLines) {
        if (line.points[0].distanceTo(point) < SNAPPING_THRESHOLD) {
          return line.points[0];
        }
        if (line.points[1].distanceTo(point) < SNAPPING_THRESHOLD) {
          return line.points[1];
        }
  
        // Check for snapping to the line segment itself
        const closestPointOnLine = closestPointOnSegment(
          line.points[0],
          line.points[1],
          point
        );
        if (closestPointOnLine.distanceTo(point) < SNAPPING_THRESHOLD) {
          return {closestPointOnLine,line};
        }
      }
  };




const closestPointOnSegment = (A, B, P) => {
    const AP = P.clone().sub(A);
    const AB = B.clone().sub(A);
    const magnitudeAB = AB.lengthSq();
    const ABAPproduct = AP.dot(AB);
    const distance = ABAPproduct / magnitudeAB;

    if (distance < 0) {
      return A;
    } else if (distance > 1) {
      return B;
    } else {
      return A.clone().add(AB.multiplyScalar(distance));
    }
}
