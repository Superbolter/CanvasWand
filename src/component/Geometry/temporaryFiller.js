import React from "react";
import { Shape, ShapeGeometry, MeshBasicMaterial, Vector3, Box3 } from "three";
import { Line } from "@react-three/drei";
import DraggablePoint from "./DraggablePoints";
import { useDispatch, useSelector } from "react-redux";
import { updateTemoraryPolygon } from "../../Actions/DrawingActions";
import { setSelectedLinesState } from "../../Actions/ApplicationStateAction";
import usePoints from "../../hooks/usePoints";

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
  const {storeLines} = useSelector((state) => state.ApplicationState);
  const {isPointInsidePolygon} = usePoints();
  const dispatch = useDispatch();
  const material = new MeshBasicMaterial({
    color: "#4B73EC",
    transparent: true,
    opacity: 0.5,
  });
  const handleDragPoint = (newPosition, point) => {
    const index = polygon.findIndex((p) => p.x === point.x && p.y === point.y);
    const newPolygon = polygon.map((p, i) => {
      if (i === index) {
        return newPosition;
      }
      return p;
    });
    dispatch(updateTemoraryPolygon(newPolygon))
    const newLine = []
      storeLines.map((line) => {
        if(isPointInsidePolygon(polygon, line.points[0]) && isPointInsidePolygon(polygon, line.points[1])){
          newLine.push(line.id)
        }
      })
    dispatch(setSelectedLinesState(newLine));
  };
  return (
    <>
      <mesh>
        <shapeGeometry attach="geometry" args={[shape]} />
        <meshBasicMaterial attach="material" args={[material]} />
      </mesh>
      {polygon.map((point, index) => (
        <>
          <DraggablePoint
            key={index}
            index={index}
            point={new Vector3(point.x, point.y, 0)}
            onDrag={(newPosition) => handleDragPoint(newPosition, point)}
          />
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
