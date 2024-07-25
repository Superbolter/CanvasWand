import React, { useMemo } from "react";
import { Vector3, TextureLoader } from "three";
import convert from "convert-units";
import { useSelector } from "react-redux";
import Window from "../assets/Window.png"
import Door from "../assets/Door.png"
import Railing from "../assets/Railing.png"
import New from "../assets/New.png"
import Wall from "../assets/Walll.png"
const BoxGeometry = ({
  start,
  end,
  dimension,
  widthchange,
  widthchangetype,
  isSelected,
  typeId,
  isChoose,
  onClick,
  currentPoint,
  newPointMode,
  opacity = 0.5,
}) => {
  const { measured, roomSelect } = useSelector((state) => state.drawing);
  const { factor } = useSelector((state) => state.ApplicationState);

  const textureLoader = useMemo(() => new TextureLoader(), []);
  const windowTexture = useMemo(
    () => textureLoader.load(Window), // Replace with the path to your window image
    [textureLoader]
  );
  const wallTexture = useMemo(
    () => textureLoader.load(Wall), // Replace with the path to your window image
    [textureLoader]
  );
  const railingTexture = useMemo(
    () => textureLoader.load(Railing), // Replace with the path to your window image
    [textureLoader]
  );
  const doorTexture = useMemo(
    () => textureLoader.load(Door), // Replace with the path to your window image
    [textureLoader]
  );
  const newTexture = useMemo(
    () => textureLoader.load(New), // Replace with the path to your window image
    [textureLoader]
  );

  if (!start || !end) return null;

  const length = start.distanceTo(end);
  const width = convert(dimension.width * factor[1]).from("mm").to(measured);
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  if (end.y === start.y) {
    if (widthchangetype === "inside") {
      // Adjust the width to inside (keeping the horizontal level unchanged)
      midpoint.y += widthchange;
    } else if (widthchangetype === "outside") {
      // Adjust the width to outside (keeping the horizontal level unchanged)
      midpoint.y -= widthchange;
    }
  } else {
    if (widthchangetype === "inside") {
      // Adjust the width to inside (keeping the vertical level unchanged)
      midpoint.x -= widthchange;
    } else if (widthchangetype === "outside") {
      // Adjust the width to outside (keeping the vertical level unchanged)
      midpoint.x += widthchange;
    }
  }

  // Determine the rotation angle for the box
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  return (
    <>
      <mesh position={midpoint} rotation={[0, 0, angle]} onClick={onClick}>
        <boxGeometry args={[length, width, 0]} />
        <meshBasicMaterial
          // map={typeId === 3 ? windowTexture : null} // Apply the texture for windows
          map={
            typeId === 1
              ? wallTexture
              : typeId === 2
              ? doorTexture
              : typeId === 3
              ? windowTexture
              : typeId === 4
              ? railingTexture
              : newTexture
          }
          width={typeId===4?"10px":"20px"}
          transparent={true}
        />
      </mesh>
      <mesh position={start}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial
          color={
            typeId === 2
              ? "brown"
              : newPointMode && start.equals(currentPoint)
              ? "yellow"
              : "black"
          }
          transparent={true}
          opacity={opacity}
        />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={
            typeId === 2
              ? "brown"
              : newPointMode && end.equals(currentPoint)
              ? "yellow"
              : "black"
          }
          transparent={true}
          opacity={opacity}
        />
      </mesh>
    </>
  );
};

export default BoxGeometry;
