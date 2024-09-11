import React from "react";
import { Shape, ShapeGeometry, MeshBasicMaterial, Vector3, Box3 } from "three";
import { Line } from "@react-three/drei";

const createShape = (points) => {
  const shape = new Shape();
  shape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }
  shape.lineTo(points[0].x, points[0].y); // Close the shape by going back to the first point
  return shape;
};

const TemporaryFiller = ({ polygon }) => {
  const shape = createShape(polygon);
  const material = new MeshBasicMaterial({
    color: "#4B73EC",
    transparent: true,
    opacity: 0.1,
  });
  return (
    <>
      <mesh>
        <shapeGeometry attach="geometry" args={[shape]} />
        <meshBasicMaterial attach="material" args={[material]} />
      </mesh>
      {polygon.map((point, index) => (
        <>
          <mesh position={point}>
            <sphereGeometry args={[6, 6, 32]} />
            <meshBasicMaterial color="#4B73EC" />
          </mesh>
          {index < polygon.length - 1 ? (
            <Line
              points={[
                [point.x, point.y, 0],
                [polygon[index + 1].x, polygon[index + 1].y, 0],
              ]}
              color="blue"
              lineWidth={2}
            />
          ) : null}
          {index === polygon.length - 1 ? (
            <Line
              points={[
                [point.x, point.y, 0],
                [polygon[0].x, polygon[0].y, 0],
              ]}
              color="blue"
              lineWidth={2}
            />
          ) : null}
        </>
      ))}
    </>
  );
};

export default TemporaryFiller;
