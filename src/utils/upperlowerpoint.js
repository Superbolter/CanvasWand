import { Vector3 } from 'three';
import convert from "convert-units"; 

// Helper function to calculate upper and lower points
export const calculateUpperAndLowerPoints = (storeLines, factor, measured) => {
  let pointUpper = [];
  let pointLower = [];

  
    storeLines.forEach((storeLine) => {
      // console.log("Hello i am storing point ");
      const start = storeLine.points[0];
      const end = storeLine.points[1];
      const width = convert(storeLine.width * factor[1])
        .from("mm")
        .to(measured);

      const direction = new Vector3().subVectors(end, start).normalize();

      // Calculate the perpendicular vector
      const perpVector = new Vector3(-direction.y, direction.x, 0).multiplyScalar(width / 2);

      // Calculate the four corners
      const upperLeft = new Vector3().addVectors(start, perpVector);
      const lowerLeft = new Vector3().subVectors(start, perpVector);
      const upperRight = new Vector3().addVectors(end, perpVector);
      const lowerRight = new Vector3().subVectors(end, perpVector);

      // Accumulate the points in the arrays
      pointUpper = [...pointUpper, { leftUpper: upperLeft, rightUpper: upperRight }];
      pointLower = [...pointLower, { leftLower: lowerLeft, rightLower: lowerRight }];
    });
  

  return { pointUpper, pointLower };
};
