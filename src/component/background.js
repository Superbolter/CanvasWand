import React, { Suspense } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Image from "../assets/img.png";

const BackgroundImage = () => {
  const fixedWidth = 800; // Set the desired fixed width
  const fixedHeight = 420; // Set the desired fixed height, or calculate based on the image aspect ratio
  
  // Use TextureLoader to load the image texture asynchronously
  const texture = useLoader(TextureLoader, Image);

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[fixedWidth, fixedHeight]} />
      <meshBasicMaterial map={texture} transparent={true} opacity={0.2} />
    </mesh>
  );
};



export default BackgroundImage;
