import { SNAPPING_THRESHOLD } from "../constant/constant";

 export const snapToPoint = (point,points,storeLines) => {
    // Check against all points and endpoints of existing lines
    for (let p of points) {
      if (p.distanceTo(point) < 5) {
        return p;
      }
    }
    for (let line of storeLines) {
      if (line.points[0].distanceTo(point) < 5) {
        return line.points[0];
      }
      if (line.points[1].distanceTo(point) < 5) {
        return line.points[1];
      }

      // Check for snapping to the line segment itself
      const closestPointOnLine = closestPointOnSegment(
        line.points[0],
        line.points[1],
        point
      );
      if (closestPointOnLine.distanceTo(point) < 5) {
        return closestPointOnLine;
      }
    }
    return point;
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
  };
