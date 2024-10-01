import React, { useMemo } from "react";
import { TextureLoader } from "three";
import Window from "../assets/Window.png";
import Door from "../assets/Door.png";
import Railing from "../assets/Railing.png";
import New from "../assets/New.png";
import Wall from "../assets/Walll.png";
import HiddenWall from "../assets/hiddenwall.png";
import Opening from "../assets/Opening.png";
import newWall from "../assets/newWall.png";
import newWall2 from "../assets/newWall2.png";

const useTexture = () => {
  const textureLoader = useMemo(() => new TextureLoader(), []);

  const windowTexture = useMemo(
    () => textureLoader.load(Window),
    [textureLoader]
  );

  const selectedTexture = useMemo(
    () => textureLoader.load(newWall2),
    [textureLoader]
  );

  const railingTexture = useMemo(
    () => textureLoader.load(Railing),
    [textureLoader]
  );

  const doorTexture = useMemo(() => textureLoader.load(Door), [textureLoader]);

  const wallTexture = useMemo(() => textureLoader.load(New), [textureLoader]);

  const hiddenWallTexture = useMemo(
    () => textureLoader.load(HiddenWall),
    [textureLoader]
  );

  const hoveredTexture = useMemo(
    () => textureLoader.load(Opening),
    [textureLoader]
  );

  return {
    windowTexture,
    selectedTexture,
    railingTexture,
    doorTexture,
    wallTexture,
    hiddenWallTexture,
    hoveredTexture,
  };
};

export default useTexture;
