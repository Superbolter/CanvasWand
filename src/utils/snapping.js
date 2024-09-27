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
  if (!snapActive) {
    return point;
  }

  // Check against all points and endpoints of existing lines
  for (let p of points) {
    if (p.distanceTo(point) < (snapActive ? SNAPPING_THRESHOLD : 0)) {
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

    const upperP0 = upperPoints(
      line.points[0],
      line.points[1],
      line.width,
      line.points[0],
      factor,
      measured
    );

    const upperP1 = upperPoints(
      line.points[0],
      line.points[1],
      line.width,
      line.points[1],
      factor,
      measured
    );
    if (
      line.points[0].distanceTo(point) < (snapActive ? SNAPPING_THRESHOLD : 0)||
      upperP0.distanceTo(point) < (snapActive ? SNAPPING_THRESHOLD : 0)
    ) {
      let closestPoint = line.points[0];
      let upperP = upperP0;
      const upperDistance = upperP.distanceTo(point);
      const belowDistance = closestPoint.distanceTo(point);
      if(snapPoint === "upper" && linePlacementMode === "below"){
          if(upperDistance >= belowDistance ){
            closestPoint = upperP;
          }
      }
      return closestPoint;
    }


    if (
      line.points[1].distanceTo(point) < (snapActive ? SNAPPING_THRESHOLD : 0)||
      upperP1.distanceTo(point) < (snapActive ? SNAPPING_THRESHOLD : 0)
    ) {
      let closestPoint = line.points[1];
      let upperP = upperP1;

      const upperDistance = upperP.distanceTo(point);
      const belowDistance = closestPoint.distanceTo(point);
      if(snapPoint === "upper" && linePlacementMode === "below"){
        if(upperDistance >= belowDistance ){
          closestPoint = upperP;
        }
      }
      return closestPoint;
    }
    

    // Check for snapping to the line segment itself
    // let closestPointOnLine = closestPointOnSegment(
    //   line.points[0],
    //   line.points[1],
    //   point
    // );
    // let closestUpperPointOnLine = closestPointOnSegment(
    //   upperPoints(line.points[0], line.points[1], line.width, line.points[0], factor, measured),
    //   upperPoints(line.points[0], line.points[1], line.width, line.points[1], factor, measured),
    //   point
    // );

    // const closestPointDistance = closestPointOnLine.distanceTo(point);
    // const closestUpperDistance = closestUpperPointOnLine.distanceTo(point);
    // if (closestPointDistance < SNAPPING_THRESHOLD || closestUpperDistance < SNAPPING_THRESHOLD) {

    //   if (snapPoint === "upper" && linePlacementMode === "below") {
    //    if((closestPointDistance<=closestUpperDistance) ){
    //     closestPointOnLine = upperPoints(
    //       line.points[0],
    //       line.points[1],
    //       line.width,
    //       closestPointOnLine,
    //       factor,
    //       measured
    //     );
    //    }
    //    else if((closestPointDistance>closestUpperDistance)||closestUpperDistance < SNAPPING_THRESHOLD){
    //     if (snapPoint === "upper" && linePlacementMode === "below") {
    //     closestPointOnLine = upperPoints(
    //       line.points[0],
    //       line.points[1],
    //       line.width,
    //       closestUpperPointOnLine,
    //       factor,
    //       measured
    //     );
    //    }
    //   }

    //   }

      

    //   return closestPointOnLine;
    // }
    let closestPointOnLine = closestPointOnSegment(
      line.points[0],
      line.points[1],
      point
    );
    if (closestPointOnLine.distanceTo(point) < SNAPPING_THRESHOLD) {
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
