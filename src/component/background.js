import React, { Suspense } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Image from "../assets/img.jpg";

const BackgroundImage = () => {
  const { viewport } = useThree();

  // Use TextureLoader to load the image texture asynchronously
  const texture = useLoader(TextureLoader, Image);


  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]}  />
      <meshBasicMaterial map={texture}  transparent = {0.3} opacity={0.2}/>
    </mesh>
  );
};



export default BackgroundImage;