import { SNAPPING_THRESHOLD } from "../constant/constant";
import { Vector3 } from "three";

const upperPoints = (start, end, width, point) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  let direction = new Vector3().subVectors(end, start).normalize();

  // Calculate the perpendicular vector
  let perpVector = new Vector3(-direction.y, direction.x, 0).multiplyScalar(
    width
  );
  const upperLeft = new Vector3().addVectors(point, perpVector);
  return upperLeft;
};

export const findLineForPoint = (point, storeLines, snapActive) => {
  for (let line of storeLines) {
    if (
      line.points[0].distanceTo(point) < (snapActive ? SNAPPING_THRESHOLD : 0)
    ) {
      return line.points[0];
    }
    if (
      line.points[1].distanceTo(point) < (snapActive ? SNAPPING_THRESHOLD : 0)
    ) {
      return line.points[1];
    }

    // Check for snapping to the line segment itself
    let closestPointOnLine = closestPointOnSegment(
      line.points[0],
      line.points[1],
      point
    );
    if (
      closestPointOnLine.distanceTo(point) <
      (snapActive ? SNAPPING_THRESHOLD : 0)
    ) {
      return { closestPointOnLine, line };
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
};
