import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

const usePoints = () => {
  const { cameraContext } = useSelector((state) => state.Drawing);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const screenToNDC = (clientX, clientY) => {
    mouse.current.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.current.setFromCamera(mouse.current, cameraContext);

    // Define a plane at z = 0 and find the intersection point
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersectionPoint);

    return new THREE.Vector3(intersectionPoint.x, intersectionPoint.y, 0);
  };

  const isPointInsidePolygon = (vertices, point) => {
    const { x: x0, y: y0 } = point;
    let windingNumber = 0;
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
      const { x: x1, y: y1 } = vertices[i];
      const { x: x2, y: y2 } = vertices[(i + 1) % n];

      // Calculate the angle between the point and the polygon edge
      const angle1 = Math.atan2(y1 - y0, x1 - x0);
      const angle2 = Math.atan2(y2 - y0, x2 - x0);
      let diff = angle2 - angle1;

      // Adjust for angles that cross the -π/π boundary
      if (diff > Math.PI) {
        diff -= 2 * Math.PI;
      } else if (diff < -Math.PI) {
        diff += 2 * Math.PI;
      }

      windingNumber += diff;
    }

    return Math.abs(windingNumber) > Math.PI; // Non-zero winding number means inside
  }

  function arePointsSimilar(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y;
  }

  return {
    screenToNDC,
    isPointInsidePolygon,
    arePointsSimilar
  };
};

export default usePoints;
