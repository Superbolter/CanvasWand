function linePolygonIntersections(coordinates, A, B, C) {
  const intersections = [];

  function getIntersection(p1, p2) {
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const denominator = A * dx + B * dy;
    if (denominator === 0) {
      // Line is parallel to the segment
      return null;
    }

    const t = -(A * x1 + B * y1 + C) / denominator;
    if (t >= 0 && t <= 1) {
      // Intersection point lies on the segment
      const ix = x1 + t * dx;
      const iy = y1 + t * dy;
      return { x: ix, y: iy };
    }
    return null;
  }

  // Find all intersection points
  for (let i = 0; i < coordinates.length; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % coordinates.length];

    const intersection = getIntersection(p1, p2);
    if (intersection) {
      intersections.push({ point: intersection, index: i + 1 });
    }
  }

  let newCoordinates = [...coordinates];

  // Ensure we have at least 2 intersections
  if (intersections.length >= 2) {
    // Sort the intersections by their index in the polygon
    intersections.sort((a, b) => a.index - b.index);

    // Insert the intersection points into the coordinates array in order
    for (let i = intersections.length - 1; i >= 0; i--) {
      newCoordinates.splice(intersections[i].index, 0, intersections[i].point);
    }

    let subPolygons = [[]]; // Array of sub-polygons
    let currentPolygonIndex = 0; // Index of the current sub-polygon

    // Traverse the newCoordinates and switch between polygons on encountering intersections
    for (let i = 0; i < newCoordinates.length; i++) {
      const point = newCoordinates[i];

      if (
        intersections.some(
          (inter) => inter.point.x === point.x && inter.point.y === point.y
        )
      ) {
        subPolygons[currentPolygonIndex].push(point);

        // Switch to the next sub-polygon
        currentPolygonIndex++;
        if (currentPolygonIndex === intersections.length) {
          currentPolygonIndex = 0;
        }
        subPolygons[currentPolygonIndex] =
          subPolygons[currentPolygonIndex] || [];
        subPolygons[currentPolygonIndex].push(point);
      } else {
        // Collect points in the current sub-polygon
        subPolygons[currentPolygonIndex].push(point);
      }
    }

    // Ensure that the last points are connected to close the polygons
    const Resulting = [];
    subPolygons.forEach((polygon) => {
      const result = removeDuplicates(polygon);
      if (result.length > 2) Resulting.push(result);
    });
    // console.log(`Sub-polygons:`, Resulting);

    return Resulting;
  }

  // If less than 2 intersections, return the original polygon
  return [[...coordinates]];
}

function removeDuplicates(arr) {
  const seen = new Set();

  return arr.filter((item) => {
    const serialized = JSON.stringify(item); // Convert object to a string
    if (!seen.has(serialized)) {
      seen.add(serialized); // Add to set if not seen
      return true;
    }
    return false; // Skip duplicates
  });
}

function getLineEquation(x1, y1, x2, y2) {
  // Calculate coefficients A, B, and C
  const A = y2 - y1;
  const B = x1 - x2;
  const C = x2 * y1 - x1 * y2;

  return { A, B, C };
}

export const dividePolygon = (polygon, linePoints) => {
  const { A, B, C } = getLineEquation(
    linePoints[0].x,
    linePoints[0].y,
    linePoints[1].x,
    linePoints[1].y
  );
  const result = linePolygonIntersections(polygon, A, B, C);
  return result;
};
