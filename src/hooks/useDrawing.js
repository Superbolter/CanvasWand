import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import convert from "convert-units";
import { Vector3 } from "three";
import {
  setPoints,
  setStoreLines,
  setPerpendicularLine,
  setFactor,
  setInformation,
  
} from "../features/drawing/drwingSlice.js";
import {
  uniqueId,
  calculateAlignedPoint,
  replaceValue,
} from "../utils/uniqueId";
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
  const [doorWindowMode, setDoorWindowMode] = useState(false);
  const [hoveredLine, setHoveredLine] = useState([]);
  const [addOn, setaddOn] = useState(null);
  const [isDraggingDoor, setIsDraggingDoor] = useState(false);
  const [doorPosition, setDoorPosition] = useState([]);
  const [dimensions, setDimensions] = useState({ l: 50, w: 10, h: 50 });

  const [doorPoint, setdoorPoint] = useState([]);

  const handlePointerDown = useCallback(
    (event, right, left, mesh) => {
      setIsDraggingDoor(true);
      setDoorWindowMode(true);
      event.stopPropagation();
    },
    [selectionMode, dragMode]
  );

  const handlePointerUp = useCallback(
    (event, line, right, left) => {
      

      const startPoint = new Vector3(
        left.current.position.x,
        left.current.position.y,
        0
      );
      const endPoint = new Vector3(
        right.current.position.x,
        right.current.position.y,
        0
      );

      
      let index = null;

      points.forEach((ele, i) => {
        if (ele === line.points[0] && points[i + 1] === line.points[1]) {
          index = i;
        }
      });
      let updatedPoint = [...points];
      
      if (index != null) {
        if (
          endPoint.distanceTo(line.points[0]) <
          endPoint.distanceTo(line.points[1])
        ) {
          updatedPoint.splice(index+1, 0, endPoint, startPoint);
        } else {
          updatedPoint.splice(index+1, 0, startPoint, endPoint);
          
        }
        dispatch(setPoints(updatedPoint));
      }
     

      const idx = storeLines.findIndex((ele) => ele.id === line.id);

      const line1 = {
        id: uniqueId(),
        points: [line.points[0], startPoint],
        length: convert(line.points[0].distanceTo(startPoint) * factor[0])
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
        type: "wall",
      };
      const line2 = {
        id: uniqueId(),
        points: [endPoint, line.points[1]],
        length: convert(endPoint.distanceTo(line.points[1]) * factor[0])
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
        type: "wall",
      };
      const line3 = {
        id: uniqueId(),
        points: [startPoint, endPoint],
        length: convert(startPoint.distanceTo(endPoint) * factor[0])
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
        type: "door",
      };
      
      const updatedLine = [...storeLines];
      
      updatedLine.splice(idx, 1, line1, line3, line2);
      

      dispatch(setStoreLines(updatedLine));
      setIsDraggingDoor(false);


      setSelectionMode(false);
      setDragMode(false);
      setTimeout(() => {
        setDoorWindowMode(false);
      }, 1000);


      
      event.stopPropagation();
      setaddOn(false);
    },
    [selectionMode, dragMode, storeLines, factor, measured, dispatch]
  );

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
      type: "wall",
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
    if (selectionMode || dragMode || doorWindowMode) return; // Prevent drawing new lines in selection mode
    //if (dragMode) return;

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

      let newLine = {
        id: uniqueId(),
        points: [newPoints[newPoints.length - 2], point],
        length: convert(
          newPoints[newPoints.length - 2].distanceTo(point) * lfactor
        )
          .from(measured)
          .to("mm"),
        width: convert(INITIAL_BREADTH / wfactor)
          .from(measured)
          .to("mm"),
        height: convert(INITIAL_HEIGHT / hfactor)
          .from(measured)
          .to("mm"),
        widthchangetype: "between",
        widthchange: 0,
        type: "wall",
      };
      dispatch(setStoreLines([newLine]));
    }
    setCurrentMousePosition(null); // Clear the temporary line on click
    setDistance(0); // Reset distance display
  };

  const handleMouseMove = (event) => {
    if ((points.length === 0 || stop || newLine || doorWindowMode) && !dragMode)
      return; // No point to start from or not in perpendicular mode

    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    let point = new Vector3(posX, posY, 0);

    if (perpendicularLine && draggingPointIndex === null) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }

    setCurrentMousePosition(point);

    const lastPoint = points[points.length - 1];
    const currentDistance = lastPoint.distanceTo(point);
    setDistance(currentDistance * factor[0]);

    if (draggingPointIndex !== null) {
      let beforeUpdation = points[draggingPointIndex];
      

      let prevPoint = points[draggingPointIndex - 1];
      
      let nextPoint = points[draggingPointIndex + 1];
      if(perpendicularLine){
        if (prevPoint && nextPoint) {
          // Check if all coordinates are different
         
          if (point.x !== prevPoint.x && point.y !== prevPoint.y && point.x !== nextPoint.x && point.y !== nextPoint.y) {
            // Calculate the direction vector of the line (prevPoint to nextPoint)
            const dx = nextPoint.x - prevPoint.x;
            const dy = nextPoint.y - prevPoint.y;
        
            // Normalize the direction vector
            const length = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / length;
            const dirY = dy / length;
        
            // Calculate the vector from prevPoint to point
            const px = point.x - prevPoint.x;
            const py = point.y - prevPoint.y;
        
            // Project the point onto the line
            const dotProduct = px * dirX + py * dirY;
            point.x = prevPoint.x + dotProduct * dirX;
            point.y = prevPoint.y + dotProduct * dirY;
           } else {
            // Align with the previous point
            if (Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)) {
              point.y = prevPoint.y; // Align horizontally
            } else {
              point.x = prevPoint.x; // Align vertically
            }
          }
        }
         else if (prevPoint) {
          if (Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)) {
            
            point.y = prevPoint.y; // Align horizontally
          } else {
            
            point.x = prevPoint.x; // Align vertically
          }
         } else if (nextPoint) {
          // Align with the next point if there's no previous point
          if (Math.abs(point.x - nextPoint.x) > Math.abs(point.y - nextPoint.y)) {
            point.y = nextPoint.y; // Align horizontally
          } else {
            point.x = nextPoint.x; // Align vertically
          }
        }
      }


      let updatedPoints = [...points];
      const updated = replaceValue(updatedPoints, beforeUpdation, point);
      dispatch(setPoints(updated));

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
    

    const pointIndex = points.findIndex((p) => p.distanceTo(point) < 10); 
    if (pointIndex !== -1) {
     
      setDraggingPointIndex(pointIndex);
    }
  };

  const handleMouseUp = () => {
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
    // if(type ==='door'){
    //   setaddOn(!addOn);
    //   setdoorPoint(...points);
    //   const midpoint = new Vector3().addVectors(points[0],points[1]).multiplyScalar(0.5);
    //   const length = points[0].distanceTo(points[1]);
    //   setDoorPosition(midpoint);
    //   setDimensions({l:length,W:10,h:50});

    //dispatch(setIdSelection([...selectedLines]));
  };

  const handleInformtion = () => {
    setSelectionMode(!selectionMode);
    dispatch(setInformation(!information));
  };

  const toggleDragMode = () => {
    setDragMode(!dragMode);
  };

  const toggleDoorWindowMode = (mode) => {
    setaddOn("door");
    setIsDraggingDoor(true);
    setSelectionMode(false);
    setDragMode(false);
    setDoorWindowMode(!doorWindowMode);
  };

  return {
    doorWindowMode,
    newLine,
    doorPoint,
    selectionMode,
    selectedLines,
    addOn,
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
    doorPosition,
    isDraggingDoor,
    dimensions,

    handleClick,
    handleMouseMove,
    handleLineClick,
    setNewLine,
    setdoorPoint,
    handleInformtion,
    deleteLastPoint,
    setSelectedLines,
    setSelectionMode,
    toggleDragMode,
    handleMouseDown,
    handleMouseUp,
    toggleSelectionMode,
    perpendicularHandler,
    toggleDoorWindowMode,
    setDoorPosition,
    setIsDraggingDoor, // New state setter
    handlePointerDown,
    handlePointerUp,
    setDimensions,
  };
};
