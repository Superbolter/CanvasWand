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

  return {
    screenToNDC,
  };
};

export default usePoints;
