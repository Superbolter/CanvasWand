import React, { useEffect, useMemo, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import {
  Vector3,
  ShapeGeometry,
} from "three";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@react-three/drei";
import convert from "convert-units";
import usePoints from "../../hooks/usePoints";
import { setHiglightPoint } from "../../Actions/DrawingActions";
import { useDrawing } from "../../hooks/useDrawing";
import useTexture from "../../hooks/useTexture";
// Extend the R3F renderer with ShapeGeometry
// extend({ ShapeGeometry });

const BoxGeometry = ({
  start,
  end,
  dimension,
  isSelected,
  typeId,
  showDimension = false,
  opacity = 0.5,
  distance = null,
  lineId = null
}) => {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);

  const { measured, linePlacementMode } =
    useSelector((state) => state.drawing);

  const {
    factor,
    designStep,
    selectionMode,
    activeRoomIndex,
    activeRoomButton,
  } = useSelector((state) => state.ApplicationState);
  const { seeDimensions, higlightPoint } = useSelector(
    (state) => state.Drawing
  );

  const { handleLineClick } = useDrawing();

  const { decimalToFeetInches } = usePoints();

  const {
    wallTexture,
    doorTexture,
    windowTexture,
    railingTexture,
    hiddenWallTexture,
    selectedTexture,
    hoveredTexture,
  } = useTexture();

  const memoisedLine = useMemo(() => {
    const length = start.distanceTo(end);
    const width = convert(dimension.width * factor[1])
      .from("mm")
      .to(measured);
    // const width = isCustomised ? (1/factor[0]) * dimension.width :(1/factor[0]) * userWidth;

    const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    let direction = new Vector3().subVectors(end, start).normalize();

    // Calculate the perpendicular vector
    let perpVector = new Vector3(-direction.y, direction.x, 0).multiplyScalar(
      width / 2
    );

    // Calculate the four corners
    let upperLeft = new Vector3().addVectors(start, perpVector);
    let upperRight = new Vector3().addVectors(end, perpVector);

    // Calculate the text position slightly above the midpoint
    const textPosition = new Vector3(
      midpoint.x - 20 * Math.sin(angle),
      midpoint.y + 20 * Math.cos(angle),
      0.1 // Ensure it's above the box geometry
    );

    // Calculate the rotation angle for the text based on the line angle
    const textRotation = angle;

    // State to manage hover state

    // State to manage the current texture

    var feetLength = 0;
    if (measured === "ft") {
      feetLength = decimalToFeetInches(length * factor[0]);
    }
    
    const getTexture = () => {
      if (isSelected) return selectedTexture;
      if (hovered && selectionMode && designStep === 2) return hoveredTexture;
      if (
        hovered &&
        selectionMode &&
        designStep === 3 &&
        activeRoomIndex !== -1 &&
        activeRoomButton !== "divide"
      )
        return hoveredTexture;
      if (typeId === 1) return wallTexture;
      if (typeId === 2) return doorTexture;
      if (typeId === 3) return windowTexture;
      if (typeId === 4) return railingTexture;
      if (typeId === 5) return hiddenWallTexture;
      return "";
    };

    return (
      <>
        <mesh
          position={midpoint}
          rotation={[0, 0, angle]}
          onClick={(e) => handleLineClick(e, lineId)}
          onPointerOver={() => {
            // if (activeRoomIndex !== -1) {
            //   document.getElementsByClassName(
            //     "canvas-container"
            //   )[0].style.cursor = "pointer";
            // }
            setHovered(true);
          }} // Set hovered to true on mouse over
          onPointerOut={() => {
            // if (activeRoomIndex !== -1) {
            //   document.getElementsByClassName(
            //     "canvas-container"
            //   )[0].style.cursor = `url(${cursor}) 4 4, default`;
            // }
            setHovered(false);
          }} // Set hovered to false on mouse out
        >
          <boxGeometry args={[length, typeId === 4 ? width / 2 : width, 0.1]} />
          <meshBasicMaterial
            map={getTexture()}
            transparent={true}
            opacity={1}
          />
        </mesh>

        <mesh
          position={start}
          onPointerOver={() => {
            if (designStep === 2 && lineId) {
              dispatch(setHiglightPoint(start));
            }
          }}
          onPointerOut={() => {
            dispatch(setHiglightPoint(null));
          }}
        >
          <sphereGeometry args={[start === higlightPoint ? 10 : 4, 16, 16]} />
          <meshBasicMaterial
            color={
              start === higlightPoint
                ? "green"
                : typeId === 2
                  ? "brown"
                  : typeId === 3
                    ? "skyblue"
                    : typeId === 4
                      ? "violet"
                      : typeId === 4
                        ? "#E6AB4A"
                        : "black"
            }
            transparent={true}
            opacity={opacity}
          />
        </mesh>

        {(seeDimensions || showDimension) && typeId !== 5 && (
          <Text
            position={textPosition}
            rotation={[0, 0, textRotation < 3 ? textRotation : 0]}
            fontSize={9}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {distance
              ? `${length.toFixed(2)}`
              : measured === "ft"
                ? `${feetLength.feet}'${feetLength.inches} ${measured}`
                : `${(length * factor[0]).toFixed(2)} ${measured}`}
          </Text>
        )}

        <mesh
          position={end}
          onPointerOver={() => {
            if (designStep === 2 && lineId) {
              dispatch(setHiglightPoint(end));
            }
          }}
          onPointerOut={() => {
            dispatch(setHiglightPoint(null));
          }}
        >
          <sphereGeometry args={[end === higlightPoint ? 10 : 4, 16, 16]} />
          <meshBasicMaterial
            color={
              end === higlightPoint
                ? "green"
                : typeId === 2
                  ? "brown"
                  : typeId === 3
                    ? "skyblue"
                    : typeId === 4
                      ? "violet"
                      : typeId === 4
                        ? "#E6AB4A"
                        : "black"
            }
            transparent={true}
            opacity={opacity}
          />
        </mesh>
        {linePlacementMode !== "midpoint" && (
          <mesh position={upperLeft}>
            <sphereGeometry args={[4, 16, 16]} />
            <meshBasicMaterial
              color={
                typeId === 2
                  ? "brown"
                  : typeId === 3
                    ? "skyblue"
                    : typeId === 4
                      ? "violet"
                      : typeId === 4
                        ? "#E6AB4A"
                        : "black"
              }
              transparent={true}
              opacity={opacity}
            />
          </mesh>
        )}

        {linePlacementMode !== "midpoint" && (
          <mesh position={upperRight}>
            <sphereGeometry args={[4, 16, 16]} />
            <meshBasicMaterial
              color={
                typeId === 2
                  ? "brown"
                  : typeId === 3
                    ? "skyblue"
                    : typeId === 4
                      ? "violet"
                      : typeId === 4
                        ? "#E6AB4A"
                        : "black"
              }
              transparent={true}
              opacity={opacity}
            />
          </mesh>
        )}

      </>
    );
  }, [start, end, isSelected, hovered, activeRoomIndex, typeId, higlightPoint === start, higlightPoint === end, seeDimensions, showDimension, linePlacementMode, distance, measured, factor, opacity, designStep]);

  if (!start || !end) return null;

  return <>{memoisedLine}</>;
};

export default BoxGeometry;
