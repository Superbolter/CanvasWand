import React, { Suspense } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Image from "../assets/img.jpg";
import { useSelector } from "react-redux";

const BackgroundImage = () => {
  const fixedWidth = 900; // Set the desired fixed width
  const fixedHeight = 520; // Set the desired fixed height, or calculate based on the image aspect ratio
  // Use TextureLoader to load the image texture asynchronously
  const image=useSelector((state)=>state.ApplicationState.img);
  const texture = useLoader(TextureLoader, image? `https://${image}`: Image);


  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[fixedWidth, fixedHeight]}  />
      <meshBasicMaterial map={texture}  transparent = {0.9} opacity={0.5}/>
    </mesh>
  );
};



export default BackgroundImage;



// import React, { Suspense } from "react";
// import { Canvas, useThree, useLoader } from "@react-three/fiber";
// import { TextureLoader } from "three";

// // Image URL
// const imageUrl = "http://d21xri4ugh8s6d.cloudfront.net/atom/images/ascJhS6sWnGNVfYMH3qvxQ/774edf54-2317-404c-a712-086eeda3c9ee.png";

// const BackgroundImage = () => {
//   const { viewport } = useThree();

//   // Use TextureLoader to load the image texture asynchronously
//   const texture = useLoader(TextureLoader, imageUrl);

//   return (
//     <mesh position={[0, 0, -1]}>
//       <planeGeometry args={[viewport.width, viewport.height]} />
//       <meshBasicMaterial map={texture} transparent={true} opacity={0.2} />
//     </mesh>
//   );
// };

// export default BackgroundImage;