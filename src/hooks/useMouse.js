import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePoints from "./usePoints";
import { Vector3 } from "three";
import { setHiglightPoint, setShowSnapLine, setSnappingPoint } from "../Actions/DrawingActions";
import { findLineForPoint } from "../utils/coolinear.js";
import convert from "convert-units";
import { calculateAlignedPoint } from "../utils/uniqueId";
import {
  setPoints,
  setSelectedLinesState,
  setStoreLines,
} from "../Actions/ApplicationStateAction.js";

const useMouse = () => {
  const dispatch = useDispatch();
  const { screenToNDC } = usePoints();
  const {
    perpendicularLine,
    measured,
    roomSelectors,
    lineBreak,
    merge,
    snapActive,
    userLength,
    userWidth,
  } = useSelector((state) => state.drawing);
  const {
    typeId,
    actionHistory,
    stop,
    newLine,
    showSnapLine,
    snappingPoint,
    dragMode,
    mergeLine,
    shiftPressed,
    temporaryPolygon,
    enablePolygonSelection,
  } = useSelector((state) => state.Drawing);
  const {
    storeLines,
    points,
    factor,
    storeBoxes,
    selectionMode,
    selectedLines,
    expandRoomPopup,
    roomEditingMode,
    activeRoomIndex,
    designStep,
    activeRoomButton,
    img,
  } = useSelector((state) => state.ApplicationState);

  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [nearPoint, setNearPoint] = useState(false);
  const [nearVal, setNearVal] = useState();
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);
  const [draggingLineIndex, setDraggingLineIndex] = useState([]);
  const [draggingLine, setDraggingLine] = useState(null);
  const [currentLinePostion, setCurrentLinePostion] = useState(null);
  const [currentMousePosition, setCurrentMousePosition] = useState(null);
  const [currentStrightMousePosition, setCurrentStrightMousePosition] =
    useState(null);
  const [distance, setDistance] = useState(null);

  const xMap = new Map();
  const yMap = new Map();

  points.forEach((point) => {
    const xKey = point.x;
    const yKey = point.y;

    // Store x and y points
    xMap.set(xKey, point);
    yMap.set(yKey, point);
  });

  const handleMouseMove = (event) => {
    let point = screenToNDC(event.clientX, event.clientY);
    if (designStep === 3 && activeRoomButton === "divide") {
      setCurrentMousePosition(point);
      return;
    }
    if (designStep === 3 && enablePolygonSelection) {
      setCurrentMousePosition(point);
      let cuuPoint = point;
      let newarr = [];
      // Check for snapping
      let snapFound = false;
      roomSelectors.forEach((room) => {
        const points = room.polygon;
        for (let i = 0; i < points.length; i++) {
          if (
            Math.abs(points[i].x - point.x) < 2 &&
            // points[points.length - 1].y !== points[i].y &&
            // points[points.length - 1].x !== points[i].x &&
            enablePolygonSelection
          ) {
            cuuPoint.x = points[i].x;
            newarr = [cuuPoint, new Vector3(points[i].x, points[i].y, 0)];
            snapFound = true;
            break;
          } else if (
            Math.abs(points[i].y - point.y) < 2 &&
            // points[points.length - 1].y !== points[i].y &&
            // points[points.length - 1].x !== points[i].x &&
            enablePolygonSelection
          ) {
            cuuPoint.y = points[i].y;
            newarr = [cuuPoint, new Vector3(points[i].x, points[i].y, 0)];
            snapFound = true;
            break;
          }
        }
      });

      if (!snapFound) {
        dispatch(setSnappingPoint([]));
      } else {
        dispatch(setSnappingPoint(newarr));
      }

      dispatch(setShowSnapLine(snapFound));

      if (!isSelecting) return;
      const end = point;
      setEndPoint(end);
    }
    if (points.length === 0 || designStep === 1 || selectionMode) return;

    if (designStep === 3) return;

    if (lineBreak) {
      if (findLineForPoint(point, storeLines, snapActive)) {
        let { closestPointOnLine, line } = findLineForPoint(
          point,
          storeLines,
          snapActive
        );
        if (closestPointOnLine) {
          setNearPoint(true);
          setNearVal({ line: line, point: closestPointOnLine });
        } else {
          setNearPoint(false);
          setNearVal(null);
        }
      }
    }

    const highlightPoint = points.find((pt) => pt.distanceTo(point) < 5);
    if(highlightPoint){
        dispatch(setHiglightPoint(highlightPoint))
    }else{
        dispatch(setHiglightPoint(null))
    }
    let cuuPoint = point; // Copy the point
    const lastPoint = points[points.length - 1];
    if (cuuPoint.x !== lastPoint.x && cuuPoint.y !== lastPoint.y) {
      const snapX = xMap.get(cuuPoint.x);
      const snapY = yMap.get(cuuPoint.y);

      // Snap to the found x or y if they exist
      if (snapX) cuuPoint.x = snapX.x;
      if (snapY) cuuPoint.y = snapY.y;

      // Dispatch snapping actions
      if (snapX || snapY) {
        // console.log(snapX, snapY);
        dispatch(setSnappingPoint([cuuPoint, snapX || snapY]));
        dispatch(setShowSnapLine(true));
      } else {
        dispatch(setSnappingPoint([]));
        dispatch(setShowSnapLine(false));
      }
    }

    if (
      perpendicularLine &&
      draggingPointIndex === null &&
      points.length > 0 &&
      designStep !== 3
    ) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }
    if (
      !perpendicularLine &&
      draggingPointIndex === null &&
      points.length > 0
    ) {
      const position = calculateAlignedPoint(points[points.length - 1], point);
      dispatch(setCurrentStrightMousePosition(position));
      const lastPoint = points[points.length - 1];
      const currentDistance = lastPoint.distanceTo(position);
      dispatch(setDistance(currentDistance * factor[0]));
    }

    setCurrentMousePosition(point);
  };

  const handleMouseDown = (event) => {
    // if (designStep === 3 && expandRoomPopup) {
    //   setIsSelecting(false);
    //   const start = screenToNDC(event.clientX, event.clientY);
    //   setStartPoint(start);
    // }
    if (!dragMode) return;

    if (designStep === 2) {
      const point = screenToNDC(event.clientX, event.clientY);
      const pointIndex = points.findIndex((p) => p.distanceTo(point) < 6.5);
      if (pointIndex !== -1) {
        setDraggingPointIndex(pointIndex);
        const beforeUpdation = points[pointIndex];
        let updatedDraggingLineIndex = [];
        storeLines.map((line, index) => {
          let updatedLine = { ...line };
          if (updatedLine.points[0].equals(beforeUpdation)) {
            const data = {
              index: index,
              type: "start",
            };
            updatedDraggingLineIndex.push(data);
          }
          if (updatedLine.points[1].equals(beforeUpdation)) {
            const data = {
              index: index,
              type: "end",
            };
            updatedDraggingLineIndex.push(data);
          }
        });
        setCurrentMousePosition(point);
        setDraggingLineIndex(updatedDraggingLineIndex);
      } else if (selectedLines.length > 0) {
        const lineIndex = storeLines.findIndex(
          (line) => line.id === selectedLines[0]
        );
        if (lineIndex !== -1) {
          const line = storeLines[lineIndex];
          let val = false;
          if (
            Math.abs(line.points[0].x - line.points[1].x) >
            Math.abs(line.points[0].y - line.points[1].y)
          ) {
            val =
              Math.abs(line.points[0].y - point.y) < 10 ||
              Math.abs(line.points[1].y - point.y) < 10;
          } else {
            val =
              Math.abs(line.points[0].x - point.x) < 10 ||
              Math.abs(line.points[1].x - point.x) < 10;
          }
          if (val) {
            setDraggingLine(lineIndex);
          }
        }
      }
    }
  };

  const handleMouseUp = (event) => {
    if (draggingPointIndex !== null && designStep === 2) {
      const point = screenToNDC(event.clientX, event.clientY);
      let beforeUpdation = points[draggingPointIndex];
      let updatedPoints = points.map((p) => {
        if (p.equals(beforeUpdation)) {
          return point;
        }
        return p;
      });
      dispatch(setPoints(updatedPoints));

      const updatedLines = storeLines.map((line) => {
        let updatedLine = { ...line }; // Shallow copy of the line object
        if (updatedLine.points[0].equals(beforeUpdation)) {
          updatedLine = {
            ...updatedLine,
            points: [point, updatedLine.points[1]],
            length: convert(point.distanceTo(updatedLine.points[1]) * factor[0])
              .from(measured)
              .to("mm"),
          };
        }

        if (updatedLine.points[1].equals(beforeUpdation)) {
          updatedLine = {
            ...updatedLine,
            points: [updatedLine.points[0], point],
            length: convert(updatedLine.points[0].distanceTo(point) * factor[0])
              .from(measured)
              .to("mm"),
          };
        }
        return updatedLine;
      });

      dispatch(setStoreLines(updatedLines));
    }
    if (draggingLine !== null && designStep === 2 && currentLinePostion) {
      let pts = [];
      storeLines.map((line) => {
        const startPoint = line.points[0];
        const endPoint = line.points[1];
        if (
          startPoint &&
          pts.find(
            (pt) =>
              pt.x === startPoint.x &&
              pt.y === startPoint.y &&
              pt.z === startPoint.z
          ) === undefined
        ) {
          pts.push(startPoint);
        }
        if (
          endPoint &&
          pts.find(
            (pt) =>
              pt.x === endPoint.x && pt.y === endPoint.y && pt.z === endPoint.z
          ) === undefined
        ) {
          pts.push(endPoint);
        }
      });
      var startPoint = currentLinePostion[0];
      var endPoint = currentLinePostion[1];
      pts.map((pt) => {
        if (currentLinePostion[0].distanceTo(pt) < 15) {
          startPoint = pt;
        } else if (currentLinePostion[1].distanceTo(pt) < 15) {
          endPoint = pt;
        }
      });
      const updatedLines = storeLines.map((line, index) => {
        let updatedLine = { ...line }; // Shallow copy of the line object
        if (index === draggingLine) {
          const beforeUpdation1 = line.points[0];
          const beforeUpdation2 = line.points[1];
          let updatedPoints = points.map((p) => {
            if (p.equals(beforeUpdation1)) {
              return startPoint;
            } else if (p.equals(beforeUpdation2)) {
              return endPoint;
            }
            return p;
          });
          dispatch(setPoints(updatedPoints));
          updatedLine = {
            ...updatedLine,
            points: [startPoint, endPoint],
            length: convert(startPoint.distanceTo(endPoint) * factor[0])
              .from(measured)
              .to("mm"),
          };
        }
        return updatedLine;
      });
      dispatch(setStoreLines(updatedLines));
    }
    setDraggingPointIndex(null);
    setDraggingLineIndex([]);
    setCurrentLinePostion(null);
    setDraggingLine(null);

    if (designStep === 3 && expandRoomPopup) {
      if (!isSelecting) return;
      const selectedIds = [];
      if (startPoint && endPoint) {
        const minX = Math.min(startPoint.x, endPoint.x);
        const maxX = Math.max(startPoint.x, endPoint.x);
        const minY = Math.min(startPoint.y, endPoint.y);
        const maxY = Math.max(startPoint.y, endPoint.y);

        storeLines.forEach((line) => {
          const startPos = line.points[0];

          const endPos = line.points[1];

          if (
            startPos.x >= minX &&
            startPos.x <= maxX &&
            startPos.y >= minY &&
            startPos.y <= maxY &&
            endPos.x >= minX &&
            endPos.x <= maxX &&
            endPos.y >= minY &&
            endPos.y <= maxY
          ) {
            selectedIds.push(line.id);
          }
        });

        dispatch(setSelectedLinesState(selectedIds));
      }

      setIsSelecting(false);
      setStartPoint(null);
      setEndPoint(null);
    }
  };
  return {
    handleMouseMove,
    handleMouseUp,
    handleMouseDown,
    isSelecting,
    startPoint,
    endPoint,
    nearPoint,
    nearVal,
    draggingLineIndex,
    draggingLine,
    currentLinePostion,
    setCurrentLinePostion,
    currentMousePosition,
    currentStrightMousePosition,
    distance,
  };
};

export default useMouse;
