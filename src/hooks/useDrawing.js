import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import convert from "convert-units";
import { Vector3 } from "three";
import {
  setPoints,
  setStoreLines,
  setPerpendicularLine,
  setFactor,
  setInformation,
  setIdSelection,
} from "../features/drawing/drwingSlice.js";
import { uniqueId, calculateAlignedPoint,replaceValue } from "../utils/uniqueId";
import { snapToPoint } from "../utils/snapping.js";
import { getLineIntersection } from "../utils/intersect.js";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant.js";

export const useDrawing = () => {
  const dispatch = useDispatch();
  const {
    points,
    storeLines,
    idSelection,
    perpendicularLine,
    factor,
    measured,
    information,
  } = useSelector((state) => state.drawing);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedLines, setSelectedLines] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [newLine, setNewLine] = useState(false);
  const [currentMousePosition, setCurrentMousePosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [stop, setStop] = useState(false);
  const [breakPoint, setBreakPoint] = useState([]);
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);
  const [dragMode, setDragMode] = useState(false);

  const addPoint = (newPoint, startPoint) => {
    
    let newLine = {
      id: uniqueId(),
      points: [startPoint, newPoint],
      length: convert(startPoint.distanceTo(newPoint) * factor[0])
        .from(measured)
        .to("mm"),
      width: convert(INITIAL_BREADTH / factor[1])
        .from(measured)
        .to("mm"),
      height: convert(INITIAL_HEIGHT / factor[2])
        .from(measured)
        .to("mm"),
      widthchangetype: "between",
      widthchange: 0,
    };

    let updatedStoreLines = [...storeLines];
    let intersections = [];
    let newPoints = [...points];

    // Collect all intersections
    storeLines.forEach((line) => {
      const intersection = getLineIntersection(
        line.points[0],
        line.points[1],
        startPoint,
        newPoint
      );
      if (intersection) {
        intersections.push({ line, intersection });
      }
    });

    console.log("intersection points", intersections);

    // Sort intersections based on their distance from startPoint along the new line
    intersections.sort(
      (a, b) =>
        startPoint.distanceTo(a.intersection) -
        startPoint.distanceTo(b.intersection)
    );

    let currentStartPoint = startPoint;

    // Store new segments of the new line
    intersections.forEach(({ intersection }) => {
      const splitNewLine = {
        ...newLine,
        id: uniqueId(),
        points: [currentStartPoint, intersection],
      };
      splitNewLine.length = convert(
        splitNewLine.points[0].distanceTo(splitNewLine.points[1]) * factor[0]
      )
        .from(measured)
        .to("mm");

      updatedStoreLines.push(splitNewLine);

      // Update the currentStartPoint for the next segment
      currentStartPoint = intersection;
      newPoints.push(currentStartPoint);
    });

    // Add the final segment of the new line
    const finalNewLineSegment = {
      ...newLine,
      id: uniqueId(),
      points: [currentStartPoint, newPoint],
    };
    finalNewLineSegment.length = convert(
      finalNewLineSegment.points[0].distanceTo(finalNewLineSegment.points[1]) *
        factor[0]
    )
      .from(measured)
      .to("mm");

    updatedStoreLines.push(finalNewLineSegment);
    newPoints.push(newPoint);

    // Also handle splitting the existing lines at the intersection points
    intersections.forEach(({ line, intersection }) => {
      const splitLine1 = {
        ...line,
        id: uniqueId(),
        points: [line.points[0], intersection],
      };
      const splitLine2 = {
        ...line,
        id: uniqueId(),
        points: [intersection, line.points[1]],
      };

      // Calculate lengths for new segments
      splitLine1.length = convert(
        splitLine1.points[0].distanceTo(splitLine1.points[1]) * factor[0]
      )
        .from(measured)
        .to("mm");
      splitLine2.length = convert(
        splitLine2.points[0].distanceTo(splitLine2.points[1]) * factor[0]
      )
        .from(measured)
        .to("mm");

      // Replace the old line with the new segments
      const lineIndex = updatedStoreLines.findIndex((l) => l.id === line.id);
      updatedStoreLines.splice(lineIndex, 1, splitLine1, splitLine2);

      // Insert the intersection point into the points array
      const startIdx = newPoints.findIndex((point) =>
        point.equals(line.points[0])
      );
      const endIdx = newPoints.findIndex((point) =>
        point.equals(line.points[1])
      );
      if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
        newPoints.splice(startIdx + 1, 0, intersection);
      }
    });
    dispatch(setPoints(newPoints));

    dispatch(setStoreLines(updatedStoreLines));
  };

  const deleteLastPoint = () => {
    const updatedLines = storeLines.slice(0, -1);
    let updatedPoints = points.slice(0, -1);
    const lastPoint = updatedPoints[updatedPoints.length - 1];

    const hasBreakPoint = breakPoint.includes(lastPoint);
    if (hasBreakPoint) {
      console.log("deleted");
      updatedPoints = updatedPoints.slice(0, -1);
    }
    if (updatedPoints.length === 1) {
      updatedPoints = updatedPoints.slice(0, -1);
    }
    dispatch(setStoreLines(updatedLines));
    dispatch(setPoints(updatedPoints));
  };

  const deleteSelectedLines = () => {
    const updatedLines = storeLines.filter(
      (line) => !selectedLines.includes(line.id)
    );
    const pointsToKeep = [];

    updatedLines.forEach((line) => {
      pointsToKeep.push(line.points[0], line.points[1]);
    });

    const updatedPoints = points.filter((point) =>
      pointsToKeep.some((p) => p.equals(point))
    );

    dispatch(setStoreLines(updatedLines));
    dispatch(setPoints(updatedPoints));
    setSelectedLines([]);
  };

  const perpendicularHandler = () => {
    dispatch(setPerpendicularLine(!perpendicularLine));
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedLines([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "x" || event.key === "X") {
      deleteLastPoint();
    }
    if (event.key === "s" || event.key === "S") {
      setStop(!stop);
    }
    if (selectionMode && (event.key === "Delete" || event.keyCode === 46)) {
      deleteSelectedLines();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storeLines, selectionMode, selectedLines, points, stop]);

  const handleClick = (event) => {
    if (selectionMode) return; // Prevent drawing new lines in selection mode
    if (dragMode) return;

    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    let point = new Vector3(posX, posY, 0);
    if (newLine) {
      setNewLine(false);
      const newPoint = [...points, point];
      const breaking = [...breakPoint, point];
      setBreakPoint(breaking);
      console.log("BreakPoints", breaking);
      dispatch(setPoints(newPoint));
      return;
    }

    if (perpendicularLine && points.length > 0) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }
    point = snapToPoint(point, points, storeLines); //snapping
    const newPoints = [...points, point];
    dispatch(setPoints(newPoints));

    if (newPoints.length >= 2) {
      addPoint(point, newPoints[newPoints.length - 2]);
    }

    if (newPoints.length === 2 && firstTime) {
      setFirstTime(false);
      const userHeight = parseFloat(
        prompt("Enter the height of the first line:")
      );
      const userLength = parseFloat(
        prompt("Enter the length of the first line:")
      );
      const userWidth = parseFloat(
        prompt("Enter the thickness of the first line:")
      );
      const lfactor =
        userLength / point.distanceTo(newPoints[newPoints.length - 2]);
      const wfactor = INITIAL_BREADTH / userWidth;
      const hfactor = INITIAL_HEIGHT / userHeight;
      dispatch(setFactor([lfactor, wfactor, hfactor]));

      dispatch(setPoints([]));
      dispatch(setStoreLines([]));
    }
    setCurrentMousePosition(null); // Clear the temporary line on click
    setDistance(0); // Reset distance display
  };

  const handleMouseMove = (event) => {
    if ((points.length === 0 || stop || newLine)&& !dragMode) return; // No point to start from or not in perpendicular mode

    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    let point = new Vector3(posX, posY, 0);

    if (perpendicularLine) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }

    setCurrentMousePosition(point);

    const lastPoint = points[points.length - 1];
    const currentDistance = lastPoint.distanceTo(point);
    setDistance(currentDistance * factor[0]);


    if(draggingPointIndex!==null){
      let beforeUpdation = points[draggingPointIndex];
      console.log("before Point",beforeUpdation);
      let updatedPoints = [...points]; 
      const updated = replaceValue(updatedPoints,beforeUpdation,point);
      //updatedPoints[draggingPointIndex] = point;
      console.log(updated);
      dispatch(setPoints(updated));

      // checked above
      

      const updatedLines = storeLines.map((line)=>{
        let updatedLine = { ...line }; // Shallow copy of the line object
        console.log("updatedLine", updatedLine);
        console.log(beforeUpdation);
        if(updatedLine.points[0].equals(beforeUpdation)){
          console.log('FIRST UPDATE');
          updatedLine ={
            ...updatedLine,
            points:[point,updatedLine.points[1]],
            length:convert(point.distanceTo(updatedLine.points[1]) * factor[0])
            .from(measured)
            .to("mm")
          };
        }
          
        if(updatedLine.points[1].equals(beforeUpdation)){
          console.log('SECOND UPDATE');
          console.log(updatedLine.points[1]);
          console.log(point);
          updatedLine ={
            ...updatedLine,
            points:[updatedLine.points[0],point],
            length:convert(updatedLine.points[0].distanceTo(point) * factor[0])
            .from(measured)
            .to("mm")
          };

        }
        return updatedLine;
      });

      console.log(" Hello updatedline:",updatedLines);

      dispatch(setStoreLines(updatedLines));

    }
  };


  const handleMouseDown = (event) => {
    if (!dragMode) return;

    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    const point = new Vector3(posX, posY, 0);

    const pointIndex = points.findIndex((p) => p.distanceTo(point) < 10); // Adjust threshold as necessary
    if (pointIndex !== -1) {
      console.log("hello i am here ",pointIndex);
      setDraggingPointIndex(pointIndex);
    }
  };

  const handleMouseUp = () => {
    console.log("completed");
    setDraggingPointIndex(null);
  };

  const handleLineClick = (id) => {
    if (selectionMode) {
      setSelectedLines((prev) =>
        prev.includes(id)
          ? prev.filter((lineId) => lineId !== id)
          : [...prev, id]
      );
    }
    //dispatch(setIdSelection([...selectedLines]));
  };

  const handleInformtion = () => {
    setSelectionMode(!selectionMode);
    dispatch(setInformation(!information));
  };


  const toggleDragMode = () => {
    setDragMode(!dragMode);
  };

  return {
    handleClick,
    handleMouseMove,
    handleLineClick,
    handleInformtion,
    deleteLastPoint,
    handleMouseDown,
    handleMouseUp,
    toggleSelectionMode,
    perpendicularHandler,
    newLine,
    setNewLine,
    selectionMode,
    selectedLines,
    setSelectedLines,
    setSelectionMode,
    toggleDragMode,
    dragMode,
    currentMousePosition,
    distance,
    stop,
    points,
    storeLines,
    perpendicularLine,
    measured,
    information,
    idSelection,
  };
};
