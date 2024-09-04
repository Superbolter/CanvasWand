import { Vector3 } from 'three';
import { SNAPPING_THRESHOLD } from "../constant/constant";






// Helper function to check intersection and find intersection point
export const getLineIntersection = (p1, p2, p3, p4,snapActive) => {

  const closestPointOnLine = closestPointOnSegment(
    p1,
    p2,
    p4
  );
  if (closestPointOnLine.distanceTo(p4) < (snapActive ?SNAPPING_THRESHOLD:0)) {
    return closestPointOnLine;
  }

  const s1_x = p2.x - p1.x;
  const s1_y = p2.y - p1.y;
  const s2_x = p4.x - p3.x;
  const s2_y = p4.y - p3.y;

  const s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
  const t = (s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Intersection detected
    const intX = p1.x + (t * s1_x);
    const intY = p1.y + (t * s1_y);
    const intersection = new Vector3(intX, intY, 0);
    const tolerance = 1e-4; // Adjust tolerance as needed

    // Check if intersection point is very close to any of the endpoints
    if (
      intersection.distanceToSquared(p1) < tolerance ||
      intersection.distanceToSquared(p2) < tolerance ||
      intersection.distanceToSquared(p3) < tolerance ||
      intersection.distanceToSquared(p4) < tolerance
    ) {
      return null;
    }

    return intersection;
  }

  return null; // No intersection
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


