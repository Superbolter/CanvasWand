import { SNAPPING_THRESHOLD } from "../constant/constant";
import { useDispatch, useSelector } from "react-redux";
import convert from "convert-units";
import { Vector3 } from "three";

const upperPoints = (start, end, width, point, factor, measured) => {
  width = convert(width * factor[1])
    .from("mm")
    .to(measured);

  let direction = new Vector3().subVectors(end, start).normalize();

  // Calculate the perpendicular vector
  let perpVector = new Vector3(-direction.y, direction.x, 0).multiplyScalar(
    width
  );
  const upperLeft = new Vector3().addVectors(point, perpVector);
  return upperLeft;
};

export const snapToPoint = (
  point,
  points,
  storeLines,
  snapActive,
  factor,
  measured,
  snapPoint,
  linePlacementMode
) => {
  // console.log("upperPoints called with: ", {
  //   snapPoint,
  //   snapActive,
  //   linePlacementMode,
  // });
  if (!snapActive) {
    return point;
  }

  // Check against all points and endpoints of existing lines
  for (let p of points) {
    if (p.distanceTo(point) < (snapActive ? 5 : 0)) {
      if (snapPoint === "upper" && linePlacementMode === "below") {
        for (let line of storeLines) {
          if (line.points[0].equals(p) || line.points[1].equals(p)) {
            p = upperPoints(
              line.points[0],
              line.points[1],
              line.width,
              p,
              factor,
              measured
            );
          }
        }
      }
      return p;
    }
  }

  for (let line of storeLines) {
    if (
      line.points[0].distanceTo(point) < (snapActive ? 5 : 0)
    ) {
      let closestPoint = line.points[0];
      if(snapPoint === "upper" && linePlacementMode === "below"){
          closestPoint = upperPoints(
            line.points[0],
            line.points[1],
            line.width,
            line.points[0],
            factor,
            measured
          );
      }
      return closestPoint;
    }
    if (
      line.points[1].distanceTo(point) < (snapActive ? 5 : 0)
    ) {
      let closestPoint = line.points[1];
      if(snapPoint === "upper" && linePlacementMode === "below"){
          closestPoint = upperPoints(
            line.points[0],
            line.points[1],
            line.width,
            line.points[1],
            factor,
            measured
          );
      }
      return closestPoint;
    }

    // Check for snapping to the line segment itself
    let closestPointOnLine = closestPointOnSegment(
      line.points[0],
      line.points[1],
      point
    );
    if (closestPointOnLine.distanceTo(point) < 5) {
      if (snapPoint === "upper" && linePlacementMode === "below") {
        closestPointOnLine = upperPoints(
          line.points[0],
          line.points[1],
          line.width,
          closestPointOnLine,
          factor,
          measured
        );

      }

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
