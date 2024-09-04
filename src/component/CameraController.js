import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { setCameraContext } from "../Actions/DrawingActions";

const CameraController = ({
  zoom,
  setZoom,
  scale,
  userLength,
  userWidth,
  isNeeded,
}) => {
  const { camera } = useThree();
  const dispatch = useDispatch();
  const { cameraContext } = useSelector((state) => state.Drawing);
  const controlsRef = useRef();

  useEffect(() => {
    if (Object.keys(cameraContext).length === 0) {
      dispatch(setCameraContext(camera));
    }
  }, [camera, cameraContext, dispatch]);

  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.addEventListener("change", () => {
        const newContext = camera.clone();
        dispatch(setCameraContext(newContext));
      });

      return () => {
        controls.removeEventListener("change", () => {});
      };
    }
  }, [camera, dispatch]);

  useEffect(() => {
    if (isNeeded) {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }
    const newContext = camera.clone();
    dispatch(setCameraContext(newContext));
  }, [zoom, camera, dispatch]);

  const handleControlsChange = () => {
    setZoom(camera.zoom, false);
  };

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={false}
      enableZoom={
        scale &&
        !(
          userLength === 0 ||
          userWidth === 0 ||
          userLength === undefined ||
          userWidth === undefined ||
          userLength === "" ||
          userWidth === ""
        )
          ? false
          : true
      }
      minZoom={1}
      maxZoom={4.5}
      minPan={new THREE.Vector3(-100 * camera.zoom, -100 * camera.zoom, 0)}
      maxPan={new THREE.Vector3(100 * camera.zoom, 100 * camera.zoom, 0)}
      onChange={handleControlsChange}
      maxAzimuthAngle={Math.PI / 100}
      minAzimuthAngle={-Math.PI / 100}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
      zoomToCursor={true}
    />
  );
};

export default CameraController;
