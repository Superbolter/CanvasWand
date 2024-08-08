import React, { useMemo } from "react";
import { extend } from "@react-three/fiber";
import { Shape, ShapeGeometry, MeshBasicMaterial, Vector3, Box3 } from "three";
import { Text } from "@react-three/drei";
import { useDrawing } from "../hooks/useDrawing";

// Extend the R3F renderer with ShapeGeometry
extend({ ShapeGeometry });

const sortPointsClockwise = (points) => {
  const centroid = getCentroid(points);
  return points.sort((a, b) => {
    const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
    const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
    return angleA - angleB;
  });
};

const createShape = (points) => {
  const shape = new Shape();
  shape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }
  shape.lineTo(points[0].x, points[0].y); // Close the shape by going back to the first point
  return shape;
};

const getCentroid = (points) => {
  let centroid = new Vector3(0, 0, 0);
  points.forEach((point) => {
    centroid.add(new Vector3(point.x, point.y, point.z || 0));
  });
  centroid.divideScalar(points.length);
  return centroid;
};

const calculateBoundingBox = (points) => {
  const box = new Box3();
  points.forEach((point) => {
    box.expandByPoint(new Vector3(point.x, point.y, point.z || 0));
  });
  return box;
};

const RoomFiller = ({ roomName, wallIds }) => {
  const { storeLines, points } = useDrawing();

  const roomPoints = useMemo(() => {
    let pts = [];
    wallIds.forEach((id) => {
      const line = storeLines.find((line) => line.id === id);
      if (line) {
        const startPoint = line.points[0];
        const endPoint = line.points[1];
        if (startPoint) pts.push(startPoint);
        if (endPoint) pts.push(endPoint);
      }
    });
    return [...new Set(pts)];
  }, [wallIds, storeLines, points]);

  if (roomPoints.length < 3) {
    console.error("Not enough points to form a shape", roomPoints);
    return null;
  }

  const sortedPoints = sortPointsClockwise(roomPoints);
  const shape = createShape(sortedPoints);
  const geometry = new ShapeGeometry(shape);
  const material = new MeshBasicMaterial({ color: "#FFB6C1", transparent: true });

  const centroid = getCentroid(sortedPoints);
  const boundingBox = calculateBoundingBox(sortedPoints);
  const boxSize = new Vector3();
  boundingBox.getSize(boxSize);

  // Adjust font size based on bounding box dimensions
  const fontSize = Math.min(boxSize.x, boxSize.y) * 0.1;

  return (
    <>
      <mesh>
        <shapeGeometry attach="geometry" args={[shape]} />
        <meshBasicMaterial attach="material" args={[material]} />
      </mesh>
      <Text
        position={[centroid.x, centroid.y, centroid.z]}
        fontSize={fontSize}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {roomName}
      </Text>
    </>
  );
};

export default RoomFiller;
