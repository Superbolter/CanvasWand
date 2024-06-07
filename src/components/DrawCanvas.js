import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  SNAP_THRESHOLD,
  INITIAL_BREADTH,
  INITIAL_HEIGHT,
} from "../Constant/SnapThreshold";
import { distanceBetweenPoints } from "../Utils/GeometryUtils";
import convert from "convert-units";
import {
  setLines,
  setHoveredLineIndex,
  setSelectedLineIndex,
  setFactor,
  setIdSelection,
  setFormVisible,
} from "../features/drawing/drwingSlice";
import { useSelector, useDispatch } from "react-redux";

const firstTwoPoint = [];

const DrawCanvas = ({
  backgroundImage,
  currentLine,
  rectangleDrawing,
  handleCanvasClick,
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [currentHoverPoint, setCurrentHoverPoint] = useState(null);

  const {
    lines,
    points,
    activeSnap,
    hoveredLineIndex,
    selectedLineIndex,
    keyPressed,
    rectPoints,
    factor,
    idSelection,
    formVisibles,
    measured,
  } = useSelector((state) => state.drawing);

  const dispatch = useDispatch();

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context.lineCap = "square";
      context.strokeStyle = "black";
      context.lineWidth = 5;
      context.setLineDash([1, 1]);
      contextRef.current = context;

      const image = new Image();
      image.src = backgroundImage;
      image.onload = () => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [backgroundImage]);

  useEffect(() => {
    prepareCanvas();
  }, [prepareCanvas]);

  useEffect(() => {
    const context = contextRef.current;
    if (context) {
      const image = new Image();
      image.src = backgroundImage;
      image.onload = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(
          image,
          0,
          0,
          context.canvas.width,
          context.canvas.height
        );

        lines.forEach((line, index) => {
          context.lineWidth =
            convert(line.breadth * factor[1])
              .from("mm")
              .to(measured) || INITIAL_BREADTH;
          context.beginPath();
          context.moveTo(line.startX, line.startY);
          context.lineTo(line.endX, line.endY);
          if (activeSnap && hoveredLineIndex === index) {
            context.strokeStyle = "blue";
          } else {
            context.strokeStyle = "black";
          }
          context.stroke();
        });

        points.forEach((point, index) => {
          context.beginPath();
          context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
          if (activeSnap && hoveredPointIndex === index) {
            context.fillStyle = "blue";
          } else {
            context.fillStyle = "red";
          }
          context.fill();
        });

        if (points.length > 0 && currentHoverPoint) {
          const point = points[points.length - 1];
          context.fillStyle = "black";
          context.font = "10px Arial";
          context.fillText(
            `${Math.ceil(
              distanceBetweenPoints(
                point.x,
                point.y,
                currentHoverPoint.x,
                currentHoverPoint.y
              ) * factor[0]
            ).toFixed(2)}`,
            currentHoverPoint.x - 10,
            currentHoverPoint.y - 10
          );
        }

        if (currentLine) {
          context.beginPath();
          context.moveTo(currentLine.startX, currentLine.startY);
          context.lineTo(currentLine.endX, currentLine.endY);
          context.stroke();
        }
      };
    }
  }, [
    lines,
    setLines,
    backgroundImage,
    points,
    currentLine,
    activeSnap,
    hoveredPointIndex,
    hoveredLineIndex,
    rectangleDrawing,
    rectPoints,
    currentHoverPoint,
    formVisibles,
  ]);

  const handleMouseDown = useCallback(
    (event) => {
      const { offsetX, offsetY, button } = event.nativeEvent;
      firstTwoPoint.push(offsetX);
      firstTwoPoint.push(offsetY);
      if (firstTwoPoint.length === 4) {
        const userHeight = parseFloat(
          prompt("Enter the height of the first line:")
        );
        const userLength = parseFloat(
          prompt("Enter the length of the first line:")
        );
        const userWidth = parseFloat(
          prompt("Enter the width of the first line:")
        );
        const lfactor =
          userLength /
          distanceBetweenPoints(
            firstTwoPoint[2],
            firstTwoPoint[3],
            firstTwoPoint[0],
            firstTwoPoint[1]
          );
        const wfactor = INITIAL_BREADTH / userWidth;
        const hfactor = INITIAL_HEIGHT / userHeight;
        dispatch(setFactor([lfactor, wfactor, hfactor]));
        return;
      }
      if (button === 0 && keyPressed) {
        if (hoveredLineIndex !== null) {
          dispatch(
            setSelectedLineIndex([...selectedLineIndex, hoveredLineIndex])
          );
        } else {
          dispatch(setSelectedLineIndex([]));
        }
      } else if (button === 2 && keyPressed) {
        if (hoveredLineIndex !== null) {
          const refrence = lines[hoveredLineIndex];
          const newSelection = { si: refrence.startId, ei: refrence.endId };
          dispatch(setIdSelection([...idSelection, newSelection]));
          dispatch(setFormVisible(true));
        } else {
          dispatch(setIdSelection([]));
        }
      } else {
        if (activeSnap && hoveredLineIndex !== null) {
          const line = lines[hoveredLineIndex];
          const { startX, startY, endX, endY } = line;
          const slope = (endY - startY) / (endX - startX);
          const intercept = startY - slope * startX;
          const snappedY = slope * offsetX + intercept;
          handleCanvasClick(offsetX, isNaN(snappedY) ? offsetY : snappedY);
        } else {
          handleCanvasClick(offsetX, offsetY);
        }
      }
    },
    [
      handleCanvasClick,
      hoveredLineIndex,
      keyPressed,
      activeSnap,
      lines,
      setSelectedLineIndex,
      idSelection,
    ]
  );

  const pointToSegmentDistance = useCallback((px, py, x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    const nearestX = x1 + t * dx;
    const nearestY = y1 + t * dy;
    return Math.sqrt((nearestX - px) ** 2 + (nearestY - py) ** 2);
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      const { offsetX, offsetY } = event.nativeEvent;
      setCurrentHoverPoint({ x: offsetX, y: offsetY });
      let hoveredPoint = null;
      let hoveredLine = null;

      // Find the index of the nearest point within the snap threshold
      points.forEach((point, index) => {
        const distance = Math.sqrt(
          (point.x - offsetX) ** 2 + (point.y - offsetY) ** 2
        );
        if (distance < SNAP_THRESHOLD) {
          hoveredPoint = index;
        }
      });

      // Find the index of the nearest line segment within the snap threshold
      lines.forEach((line, index) => {
        const { startX, startY, endX, endY } = line;
        const distance = pointToSegmentDistance(
          offsetX,
          offsetY,
          startX,
          startY,
          endX,
          endY
        );
        if (distance < SNAP_THRESHOLD) {
          hoveredLine = index;
        }
      });

      if (!rectangleDrawing) {
        setHoveredPointIndex(hoveredPoint);
        dispatch(setHoveredLineIndex(hoveredLine));
      }
    },
    [points, lines, pointToSegmentDistance, rectangleDrawing]
  );

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      width={600}
      height={400}
      style={{ border: "1px solid black", position: "absolute", zIndex: 1 }}
      id="draw-canvas"
    />
  );
};

export default DrawCanvas;
