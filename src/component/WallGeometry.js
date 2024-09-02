// BoxGeometry.js
import { Vector3 } from "three";
import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { extend } from "@react-three/fiber";
import Brick1 from "../assets/Bricks1.jpg"; // Adjust the path to your texture
import Wall from "../assets/Wall.jpg";
import Door from "../assets/Door.jpg";
import window from "../assets/Window.jpg"
import Railing from "../assets/Railing.jpg"
import * as THREE from "three";
import { useSelector } from "react-redux";
import convert from "convert-units";

const WallGeometry = ({
  start,
  end,
  dimension,
  widthchange,
  widthchangetype,
  isSelected,
  onClick,
  //handlePointClick,
  currentPoint,
  newPointMode,
  opacity = 0.5,
  type,
  typeId
}) => {

  const textureLoader = useMemo(() => new TextureLoader(), []);

  const windowTexture = useMemo(
    () => textureLoader.load(window), 
    [textureLoader]
  );
  const texture = useMemo(
    () => textureLoader.load(Wall),
    [textureLoader]
  );
  const railingTexture = useMemo(
    () => textureLoader.load(Railing), 
    [textureLoader]
  );
  const invertedRailingTexture = useMemo(
    () => textureLoader.load(Railing),
    [textureLoader]
  )
  const doorTexture = useMemo(
    () => textureLoader.load(Door),
    [textureLoader]
  );
  const invertedDoorTexture = useMemo(
    () => textureLoader.load(Door),
    [textureLoader]
  )

  invertedDoorTexture.wrapS = THREE.RepeatWrapping;  // Repeat wrapping to enable flipping
  invertedDoorTexture.repeat.y = -1; // Flip texture horizontally
  invertedDoorTexture.offset.y = 1;

  invertedRailingTexture.wrapS = THREE.RepeatWrapping;  // Repeat wrapping to enable flipping
  invertedRailingTexture.repeat.y = -1; // Flip texture horizontally
  invertedRailingTexture.offset.y = 1;

  const { measured } = useSelector((state) => state.drawing);
  const {factor}=useSelector((state)=>state.ApplicationState)


  const length = start.distanceTo(end) * (2.084);
  const height = convert(dimension.height*factor[2]).from("mm").to(measured);
  const width = convert(dimension.width*factor[1]).from("mm").to(measured);
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(1);

  const adjustTextureScale = (texture, length, height) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(length / 100,1); // Adjust these divisors based on your scaling needs
  };

  if(end.y === start.y){
    if (widthchangetype === 'inside') {
      // Adjust the width to inside (keeping the horizontal level unchanged)
      midpoint.y += widthchange ;
    } else if (widthchangetype === 'outside') {
      // Adjust the width to outside (keeping the horizontal level unchanged)
      midpoint.y -= widthchange ;
     
    }
  }
  else{
    if (widthchangetype === 'inside') {
      // Adjust the width to inside (keeping the vertical level unchanged)
      midpoint.x -= widthchange ;
     
    } else if (widthchangetype === 'outside') {
      // Adjust the width to outside (keeping the vertical level unchanged)

      midpoint.x += widthchange ;
      
    }
  }

  // Determine the rotation angle for the box
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  const getTexture = (val) => {
    if (typeId === 1) return texture;
    if (typeId === 2){
      if(val === 4) return doorTexture;
      else return invertedDoorTexture;
    }
    if (typeId === 3) return windowTexture;
    if (typeId === 4) {
      if(val === 4) return railingTexture;
      else return invertedRailingTexture
    };
    return "";
  };
  

  useMemo(() => {
    adjustTextureScale(railingTexture, length, height);
  }, [railingTexture, length, height]);

  if (!start || !end) return null;


  return (
    <>
    { typeId !==5 && (<mesh
        position={[midpoint.x, midpoint.y,  typeId === 4 ? midpoint.z + height/ 6 :midpoint.z + height/2]}
        rotation={[0, 0, angle]}
      >
        <boxGeometry
          args={[
            length,
            typeId === 4 ? width / 2 : width,
            typeId === 4 ? height / 3 : height,
          ]}
        />
        <meshBasicMaterial attach="material-0" map={texture} />
        <meshBasicMaterial attach="material-1" map={texture} />
        <meshBasicMaterial attach="material-2" map={getTexture(3)} />
        <meshBasicMaterial attach="material-3" map={getTexture(4)} />
        <meshBasicMaterial attach="material-4" map={texture} />
        <meshBasicMaterial attach="material-5" map={texture} />
      </mesh>)}
    </>
  );
};

export default WallGeometry;

