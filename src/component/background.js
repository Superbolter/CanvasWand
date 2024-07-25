import React, { Suspense, useEffect } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useSelector } from "react-redux";
import Image from "../assets/img.png";

const BackgroundImage = () => {
  const fixedWidth = 800; // Set the desired fixed width
  const fixedHeight = 420; // Set the desired fixed height, or calculate based on the image aspect ratio
  const image=useSelector((state)=>state.ApplicationState.img)
  
  // Use TextureLoader to load the image texture asynchronously
  const texture = useLoader(TextureLoader,`https://${image}`);
  
  
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[fixedWidth, fixedHeight]} />
      <meshBasicMaterial map={texture} transparent={true} opacity={0.2} />
    </mesh>
  );
};



export default BackgroundImage;
