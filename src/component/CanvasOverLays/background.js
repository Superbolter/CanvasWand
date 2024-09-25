import React, { Suspense, useMemo } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Image from "../../assets/img.jpg";
import { useSelector } from "react-redux";

const BackgroundImage = () => {
  const image=useSelector((state)=>state.ApplicationState.img);
  const imageOpacity = useSelector((state)=>state.ApplicationState.imageOpacity);
  const texture = useLoader(TextureLoader, image? `https://${image}`: Image);
  const screenWidth = window.innerWidth * 0.7;
  const screenHeight = window.innerHeight * 0.7;
  const aspectRatio = texture.image.width / texture.image.height;
  const [fixedWidth, fixedHeight] = useMemo(()=>{
    if(texture.image.height > screenHeight){
      return [screenHeight * aspectRatio, screenHeight]
    }
    else if(texture.image.width > screenWidth){
      return [screenWidth, screenWidth / aspectRatio]
    }else{
      return [texture.image.width, texture.image.height]
    }
  },[screenHeight,screenWidth,aspectRatio])
  
  const memoImage = useMemo(()=>{
    return(
      <mesh position={[0, 0, -3]}>
      <planeGeometry args={[fixedWidth, fixedHeight]}  />
      <meshBasicMaterial map={texture}  transparent = {imageOpacity === 1 ? false: true} opacity={imageOpacity}/>
    </mesh>
    )
  },[image, imageOpacity])

  return (
    image? 
    <>
      {memoImage}
    </>
    : 
    null
  );
};



export default BackgroundImage;
