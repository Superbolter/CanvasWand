import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePoints from "./usePoints";
import { Vector3, QuadraticBezierCurve3 } from "three";
import {
  setHiglightPoint,
  setRedoStack,
  setShowSnapLine,
  setSnappingPoint,
  setUndoStack,
} from "../Actions/DrawingActions";
import { findLineForPoint } from "../utils/coolinear.js";
import convert from "convert-units";
import { calculateAlignedPoint } from "../utils/uniqueId";
import {
  setPoints,
  setSelectedLinesState,
  setStoreLines,
} from "../Actions/ApplicationStateAction.js";
import _ from 'lodash';

const useMouse = () => {
  const dispatch = useDispatch();
  const { screenToNDC } = usePoints();
  const { perpendicularLine, measured, roomSelectors, lineBreak, snapActive , merge } =
    useSelector((state) => state.drawing);
  const { dragMode, enablePolygonSelection, actionHistory } = useSelector(
    (state) => state.Drawing
  );
  const {
    storeLines,
    points,
    factor,
    selectionMode,
    selectedLines,
    expandRoomPopup,
    designStep,
    activeRoomButton,
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
  const [curvePoints, setCurvePoints] = useState(null);
  const [curveAngle, setCurveAngle] = useState(0);
  const [curveAnglePosition, setCurveAnglePosition] = useState(null);
  const [lineAngle, setLineAngle] = useState(null);

  const xMap = new Map();
  const yMap = new Map();

  points.forEach((point) => {
    const xKey = point.x;
    const yKey = point.y;

    // Store x and y points
    xMap.set(xKey, point);
    yMap.set(yKey, point);
  });

  const findInMap = (map, callback) => {
    let found;
    map.forEach((value, key) => {
      if (callback(value, key)) {
        found = { key, value };
      }
    });
    return found;
  };

  const snapToPoint = _.debounce((cuuPoint, lastPoint) => {
    let snapX = xMap.get(cuuPoint.x);
      let snapY = yMap.get(cuuPoint.y);
      const findX = findInMap(xMap, (value, key) => Math.abs(cuuPoint.x - key) < 5 && lastPoint !== value)
      const findY = findInMap(yMap, (value, key) => Math.abs(cuuPoint.x - key) < 5 && lastPoint !== value)
      if(findX){
        snapX = findX.value;
      }
      if(findY){
        snapY = findY.value;
      }
      // Snap to the found x or y if they exist
      if (snapX && snapX.x !== lastPoint.x) cuuPoint.x = snapX.x;
      if (snapY && snapY.y !== lastPoint.y) cuuPoint.y = snapY.y;

      // Dispatch snapping actions
      if (snapX || snapY) {
        dispatch(setSnappingPoint([cuuPoint, snapX || snapY]));
        dispatch(setShowSnapLine(true));
      } else {
        dispatch(setSnappingPoint([]));
        dispatch(setShowSnapLine(false));
      }
  },100)

  const controlPoint = (point1, point2, angle = 0) => {
    let x = (point1?.x + point2?.x) / 2;
    let y= (point1?.y + point2?.y) / 2;
    if(Math.abs(point1?.x - point2?.x) < Math.abs(point1?.y - point2?.y)){
      if(points[points.length-1].x > point2?.x){
        x = x - (angle * 0.67);
        setCurveAnglePosition(new Vector3(x - 20,y,0));
      } else {
        x = x + (angle * 0.67);
        setCurveAnglePosition(new Vector3(x + 20,y,0));
      }
    } else {
      if(points[points.length-1].y > point2?.y){
        y = y - (angle * 0.67);
        setCurveAnglePosition(new Vector3(x,y - 20,0));
      } else {
        y = y + (angle * 0.67);
        setCurveAnglePosition(new Vector3(x,y + 20,0));
      }
    }
    return new Vector3(x,y,0);
  }

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
    if (selectionMode && designStep === 2) {
      setCurrentMousePosition(point);
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

    // const highlightPoint = points.find((pt) => pt.distanceTo(point) < 5);
    // if(highlightPoint){
    //     dispatch(setHiglightPoint(highlightPoint))
    // }else{
    //     dispatch(setHiglightPoint(null))
    // }

    let cuuPoint = point; // Copy the point
    const lastPoint = points[points.length - 1];
    if (cuuPoint.x !== lastPoint.x && cuuPoint.y !== lastPoint.y) {
      snapToPoint(cuuPoint, lastPoint)
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
      const lastPoint = points[points.length - 1];
      const position = calculateAlignedPoint(lastPoint, point);
      const V1 = new Vector3().subVectors(position, lastPoint); 
      const V2 = new Vector3().subVectors(point, lastPoint); 
      const angleInRadians = V1.angleTo(V2);
      const angleInDegrees = angleInRadians * (180 / Math.PI);
      if(angleInDegrees < 3){
        point = position;
        setCurveAngle(0);
      }else{
        setCurveAngle(angleInDegrees);
      }
      const angle = Math.atan2(position.y - lastPoint.y, position.x - lastPoint.x);
      setLineAngle(angle)
      const curve = new QuadraticBezierCurve3(
        new Vector3(position?.x, position?.y, 0), // Start point (last point) 
        controlPoint(position, point, angleInDegrees),                            // Control point
        new Vector3(point?.x, point?.y, 0) // End point (mouse position)
      );
      const curvePoints = curve.getPoints(100);
      setCurvePoints(curvePoints);
      setCurrentStrightMousePosition(position);
      const currentDistance = lastPoint.distanceTo(position);
      setDistance(currentDistance * factor[0]);
    }

    setCurrentMousePosition(point);
  };

  const handleMouseDown = (event) => {
    // if (designStep === 3 && expandRoomPopup) {
    //   setIsSelecting(false);
    //   const start = screenToNDC(event.clientX, event.clientY);
    //   setStartPoint(start);
    // }
    if (!dragMode || merge || lineBreak) return;
    
    if (designStep === 2) {
      const point = screenToNDC(event.clientX, event.clientY);
      const pointIndex = points.findIndex((p) => p.distanceTo(point) < 6.5);
      if (pointIndex !== -1) {
        setDraggingPointIndex(pointIndex);
        const beforeUpdation = points[pointIndex];
        // dispatch(setHiglightPoint(beforeUpdation));
        let updatedDraggingLineIndex = [];
        storeLines.map((line, index) => {
          if (line.points[0].equals(beforeUpdation)) {
            const data = {
              index: index,
              type: "start",
            };
            updatedDraggingLineIndex.push(data);
          }
          if (line.points[1].equals(beforeUpdation)) {
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
    if (
      (draggingPointIndex !== null || draggingLine !== null) &&
      designStep === 2
    ) {
      const history = [...actionHistory];
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

      if (draggingPointIndex !== null && designStep === 2) {
        let point = screenToNDC(event.clientX, event.clientY);
        let beforeUpdation = points[draggingPointIndex];
        pts.map((pt) => {
          if (point.distanceTo(pt) < 15 && pt.x !== beforeUpdation.x && pt.y !== beforeUpdation.y) {
            point = pt;
          } 
        });
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
              length: convert(
                point.distanceTo(updatedLine.points[1]) * factor[0]
              )
                .from(measured)
                .to("mm"),
            };
          }

          if (updatedLine.points[1].equals(beforeUpdation)) {
            updatedLine = {
              ...updatedLine,
              points: [updatedLine.points[0], point],
              length: convert(
                updatedLine.points[0].distanceTo(point) * factor[0]
              )
                .from(measured)
                .to("mm"),
            };
          }
          return updatedLine;
        });

        dispatch(setStoreLines(updatedLines));
        history.push({
          type: "pointLineDrag",
          prevPoints: points,
          prevLines: storeLines,
          updatedPoints,
          updatedLines
        });
        dispatch(setUndoStack(history))
        dispatch(setRedoStack([]))
      }
      if (draggingLine !== null && designStep === 2 && currentLinePostion) {
        var startPoint = currentLinePostion[0];
        var endPoint = currentLinePostion[1];
        pts.map((pt) => {
          if (currentLinePostion[0].distanceTo(pt) < 15) {
            startPoint = pt;
          } else if (currentLinePostion[1].distanceTo(pt) < 15) {
            endPoint = pt;
          }
        });
        let updatedPoints = [];
        const updatedLines = storeLines.map((line, index) => {
          let updatedLine = { ...line }; // Shallow copy of the line object
          if (index === draggingLine) {
            const beforeUpdation1 = line.points[0];
            const beforeUpdation2 = line.points[1];
            updatedPoints = points.map((p) => {
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
        history.push({
          type: "pointLineDrag",
          prevPoints: points,
          prevLines: storeLines,
          updatedPoints,
          updatedLines
        });
        dispatch(setUndoStack(history))
        dispatch(setRedoStack([]))
      }
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
    curvePoints,
    curveAngle,
    curveAnglePosition,
    lineAngle
  };
};

export default useMouse;
