import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import convert from "convert-units";
import { Vector2, Vector3 } from "three";
import {
  setRoomSelectors,
  setLineBreakState,
  setUpperPoint,
  setLowerPoint,
} from "../features/drawing/drwingSlice.js";
import {
  uniqueId,
  calculateAlignedPoint,
  replaceValue,
} from "../utils/uniqueId";
import { snapToPoint } from "../utils/snapping.js";
import { getLineIntersection } from "../utils/intersect.js";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant.js";
import { findLineForPoint } from "../utils/coolinear.js";
import { calculateUpperAndLowerPoints } from "../utils/upperlowerpoint.js";
import {
  setPoints,
  setStoreLines,
  setStoreBoxes,
  setSelectionMode,
  setSelectedLinesState,
  setExpandRoomNamePopup,
  setRoomDetails,
  setRoomEditingMode,
  setRoomName,
  setActiveRoomButton,
  setActiveRoomIndex,
} from "../Actions/ApplicationStateAction.js";
import {
  setContextualMenuStatus,
  setDragMode,
  setMergeLine,
  setNewLine,
  setRedoStack,
  setShowPopup,
  setShowSnapLine,
  setSnappingPoint,
  setStop,
  setTypeId,
  setUndoStack,
} from "../Actions/DrawingActions.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-hot-toast";
import useModes from "./useModes.js";
import usePoints from "./usePoints.js";

const MySwal = withReactContent(Swal);

export const useDrawing = () => {
  const dispatch = useDispatch();
  const {
    perpendicularLine,
    measured,
    roomSelectors,
    lineBreak,
    merge,
    snapActive,
    userWidth
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
    designStep
  } = useSelector((state) => state.ApplicationState);

  const { toggleSelectionSplitMode } = useModes();
  const { screenToNDC } = usePoints();

  const [currentMousePosition, setCurrentMousePosition] = useState(null);
  const [currentLinePostion, setCurrentLinePostion] = useState(null);
  const [currentStrightMousePosition, setCurrentStrightMousePosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [breakPoint, setBreakPoint] = useState([]);
  const [draggingPointIndex, setDraggingPointIndex] = useState(null);
  const [draggingLineIndex, setDraggingLineIndex] = useState([]);
  const [draggingLine, setDraggingLine] = useState(null);
  const [dimensions, setDimensions] = useState({ l: 50, w: 10, h: 50 });
  const [selectId, setId] = useState(null);
  const [lineClick, setLineClick] = useState(false);
  const [nearPoint, setNearPoint] = useState(false);
  const [nearVal, setNearVal] = useState();
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const setSelectedLines = (data) => {
    dispatch(setSelectedLinesState(data));
  };

  function arePointsSimilar(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y;
  }

  const addPoint = (newPoint, startPoint) => {
    const previousLines = [...storeLines];
    const previousPoints = [...points];
    const previousBoxes = [...storeBoxes];
    let type =
      typeId === 1
        ? "wall"
        : typeId === 2
        ? "door"
        : typeId === 3
        ? "window"
        : typeId === 4
        ? "railing"
        : typeId === 5
        ? "imaginary"
        : "";
    let newLine = {
      id: uniqueId(),
      points: [startPoint, newPoint],
      length: convert(startPoint.distanceTo(newPoint) * factor[0])
        .from(measured)
        .to("mm"),
      // width: (1/factor[0]) * userWidth,
      width: convert(INITIAL_BREADTH / factor[1])
        .from(measured)
        .to("mm"),
      height: convert(INITIAL_HEIGHT / factor[2])
        .from(measured)
        .to("mm"),
      widthchangetype: "between",
      widthchange: 0,
      type,
      typeId: typeId,
      locked: false,
      isCustomised: null,
    };
    console.log(newLine)

    let updatedStoreLines = [...storeLines];
    let intersections = [];
    let newPoints = [...points];

    // Collect all intersections
    storeLines.forEach((line) => {
      const intersection = getLineIntersection(
        line.points[0],
        line.points[1],
        startPoint,
        newPoint,
        snapActive
      );
      if (intersection) {
        intersections.push({ line, intersection });
      }
    });

    console.log("intersect: ", intersections);

    // Sort intersections based on their distance from startPoint along the new line
    intersections.sort(
      (a, b) =>
        startPoint.distanceTo(a.intersection) -
        startPoint.distanceTo(b.intersection)
    );

    console.log("intersections: ", intersections);

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
    if (!arePointsSimilar(currentStartPoint, newPoint)) {
      console.log("hello", currentStartPoint, newPoint);
      const finalNewLineSegment = {
        ...newLine,
        id: uniqueId(),
        points: [currentStartPoint, newPoint],
      };
      finalNewLineSegment.length = convert(
        finalNewLineSegment.points[0].distanceTo(
          finalNewLineSegment.points[1]
        ) * factor[0]
      )
        .from(measured)
        .to("mm");

      updatedStoreLines.push(finalNewLineSegment);
      newPoints.push(newPoint);
    }

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

    const finalLines = updatedStoreLines.filter((line) => {
      return line.length !== 0;
    });

    dispatch(setStoreLines(finalLines));
    const history = [...actionHistory];
    history.push({
      type: "addPoint",
      previousLines,
      previousPoints,
      previousBoxes,
      newLines: updatedStoreLines,
      newPoints,
      newBoxes: [...storeBoxes],
    });
    dispatch(setUndoStack(history));
    dispatch(setRedoStack([]));
  };

  // Function to compare two Vector3 objects
  function arePointsEqual(pointA, pointB) {
    return (
      pointA?.x === pointB?.x &&
      pointA?.y === pointB?.y &&
      pointA?.z === pointB?.z
    );
  }

  // Function to check if deleteLine points match any points in a box
  function shouldRemoveBox(boxPoints, deleteLinePoints) {
    return boxPoints.some((boxPoint) =>
      deleteLinePoints.some((deletePoint) =>
        arePointsEqual(boxPoint, deletePoint)
      )
    );
  }

  useEffect(() => {
    const { pointUpper, pointLower } = calculateUpperAndLowerPoints(
      storeLines,
      factor,
      measured
    );
    // console.log("hello this is working");
    // console.log(pointUpper);

    // Dispatch the calculated points to the store
    dispatch(setUpperPoint(pointUpper));
    dispatch(setLowerPoint(pointLower));
  }, [storeLines, factor, measured, dispatch]);

  const deleteSelectedRoom = () => {
    if (activeRoomIndex !== -1) {
      const rooms = [...roomSelectors];
      rooms.splice(activeRoomIndex, 1);
      dispatch(setRoomSelectors(rooms));
      setSelectedLines([]);
      const history = [...actionHistory];
      history.push({
        type: "deleteRoom",
        oldRooms: [...roomSelectors],
        newRooms: rooms,
      });
      dispatch(setUndoStack(history));
      dispatch(setRedoStack([]));
      dispatch(setExpandRoomNamePopup(false));
      dispatch(setRoomDetails(""));
      dispatch(setRoomName(""));
      dispatch(setRoomEditingMode(false));
      dispatch(setActiveRoomButton(""));
      dispatch(setActiveRoomIndex(-1));
    }
  };

  const deleteSelectedLines = () => {
    let lockedCount = 0;

    const roomupdate = roomSelectors
      .map((room) => {
        // Filter out the walls that are in the selectedLines array and not locked
        const updatedWallIds = room.wallIds.filter((lineId) => {
          const line = storeLines.find((line) => line.id === lineId);
          if (selectedLines.includes(lineId) && line?.locked) {
            return true; // Keep the locked line
          }
          return !selectedLines.includes(lineId); // Remove if in selectedLines
        });

        // Return null if the room has no walls left
        if (updatedWallIds.length === 1) {
          return null;
        }

        // Otherwise, return the room with the updated walls
        return {
          ...room,
          wallIds: updatedWallIds,
        };
      })
      .filter((room) => room !== null);

    dispatch(setRoomSelectors(roomupdate));
    const deletedLines = [];
    const updatedLines = storeLines.filter((line) => {
      if (selectedLines.includes(line.id)) {
        if (line.locked) {
          lockedCount += 1; // Increment locked count for locked lines
          return true; // Keep the locked line
        }
        deletedLines.push(line);
        return false; // Remove if not locked
      }
      return true; // Keep lines not in selectedLines
    });
    const deletedPoints = [];
    let boxes = new Set();
    deletedLines.forEach((line) => {
      const deleteLinePoints = line.points;
      // Iterate over storeBoxes and remove the ones that match
      const deletedBoxes = storeBoxes.filter((box) =>
        shouldRemoveBox([box.p1, box.p2, box.p3, box.p4], deleteLinePoints)
      );
      deletedBoxes.forEach((box) => boxes.add(box));
      deletedPoints.push(line.points[0], line.points[1]);
    });
    dispatch(setStoreBoxes(storeBoxes.filter((box) => !boxes.has(box))));

    const history = [...actionHistory];
    history.push({
      type: "delete",
      deletedLines,
      deletedPoints,
      deletedBoxes: Array.from(boxes),
    });
    dispatch(setUndoStack(history));
    dispatch(setRedoStack([]));

    const pointsToKeep = [];

    if (updatedLines.length > 0) {
      updatedLines.forEach((line) => {
        pointsToKeep.push(line.points[0], line.points[1]);
      });

      const updatedPoints = points.filter((point) =>
        pointsToKeep.some((p) => p.equals(point))
      );

      dispatch(setStoreLines(updatedLines));
      dispatch(setPoints(updatedPoints));
    } else {
      dispatch(setStoreLines([]));
      dispatch(setPoints([]));
    }
    setSelectedLines([]);
    dispatch(setContextualMenuStatus(false));

    // Show hot-toast with the count of locked lines
    if (lockedCount > 1) {
      toast(`${lockedCount} structures were locked and were not deleted.`, {
        icon: "⚠️",
        style: {
          fontFamily: "'DM Sans', sans-serif",
          color: "#000",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
        },
      });
    } else if (lockedCount === 1) {
      toast(`${lockedCount} structure was locked and was not deleted.`, {
        icon: "⚠️",
        style: {
          color: "#000",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
        },
      });
    }
  };

  const handleMouseMove = (event) => {
    if (designStep === 3 && expandRoomPopup) {
      if (!isSelecting) return;
      const end = screenToNDC(event.clientX, event.clientY);
      setEndPoint(end);
    }
    if (
      (points.length === 0 || stop || newLine || designStep === 1) &&
      !dragMode
    )
      return; // No point to start from or not in perpendicular mode
    // if(roomSelectorMode) return;
    if(designStep === 3) return;

    let point = screenToNDC(event.clientX, event.clientY);

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
    // if(draggingLine){
    //   dispatch(setContextualMenuStatus(false));
    //   const line = storeLines[draggingLine];
    //   const linePoints = line.points;
    //   const lineLength = linePoints[1].distanceTo(linePoints[0]);
    //   if(Math.abs(linePoints[0].x - linePoints[1].x) > Math.abs(linePoints[0].y - linePoints[1].y)){
    //     const newStart = new Vector3(point.x - lineLength/2, point.y, 0);
    //     const newEnd = new Vector3(point.x + lineLength/2, point.y, 0);
    //     setCurrentLinePostion([newStart, newEnd]);
    //   } else {
    //     const newStart = new Vector3(point.x , point.y - lineLength/2, 0);
    //     const newEnd = new Vector3(point.x, point.y + lineLength/2, 0);
    //     setCurrentLinePostion([newStart, newEnd]);
    //   }
    // }

    if (perpendicularLine && draggingPointIndex === null && points.length > 0) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }
    if (!perpendicularLine && draggingPointIndex === null && points.length > 0) {
      const position = calculateAlignedPoint(points[points.length - 1], point);
      setCurrentStrightMousePosition(position);
      const lastPoint = points[points.length - 1];
      const currentDistance = lastPoint.distanceTo(position);
      setDistance(currentDistance * factor[0]);
    }


    setCurrentMousePosition(point);

    let cuuPoint = point;
    // Check for snapping
    let snapFound = false;
    for (let i = 0; i < points.length; i++) {
      if (
        Math.abs(points[i].x - point.x) < 2 &&
        points[points.length - 1].y !== points[i].y &&
        points[points.length - 1].x !== points[i].x &&
        !selectionMode
      ) {
        cuuPoint.x = points[i].x;
        let newarr = [cuuPoint, points[i]];
        dispatch(setSnappingPoint([...newarr]));
        snapFound = true;
        break;
      } else if (
        Math.abs(points[i].y - point.y) < 2 &&
        points[points.length - 1].y !== points[i].y &&
        points[points.length - 1].x !== points[i].x &&
        !selectionMode
      ) {
        cuuPoint.y = points[i].y;
        let newarr = [cuuPoint, points[i]];
        dispatch(setSnappingPoint([...newarr]));
        snapFound = true;
        break;
      }
    }

    if (!snapFound) {
      dispatch(setSnappingPoint([]));
    }

    dispatch(setShowSnapLine(snapFound));
    //setCurrentMousePosition(point);

    // if (draggingPointIndex !== null && !roomSelectorMode) {
    //   let beforeUpdation = points[draggingPointIndex];

    //   let prevPoint = points[draggingPointIndex - 1];

    //   let nextPoint = points[draggingPointIndex + 1];
    //   if (perpendicularLine) {
    //     if (prevPoint && nextPoint) {
    //       // Check if all coordinates are different

    //       if (
    //         point.x !== prevPoint.x &&
    //         point.y !== prevPoint.y &&
    //         point.x !== nextPoint.x &&
    //         point.y !== nextPoint.y
    //       ) {
    //         // Calculate the direction vector of the line (prevPoint to nextPoint)
    //         const dx = nextPoint.x - prevPoint.x;
    //         const dy = nextPoint.y - prevPoint.y;

    //         // Normalize the direction vector
    //         const length = Math.sqrt(dx * dx + dy * dy);
    //         const dirX = dx / length;
    //         const dirY = dy / length;

    //         // Calculate the vector from prevPoint to point
    //         const px = point.x - prevPoint.x;
    //         const py = point.y - prevPoint.y;

    //         // Project the point onto the line
    //         const dotProduct = px * dirX + py * dirY;
    //         point.x = prevPoint.x + dotProduct * dirX;
    //         point.y = prevPoint.y + dotProduct * dirY;
    //       } else {
    //         // Align with the previous point
    //         if (
    //           Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)
    //         ) {
    //           point.y = prevPoint.y; // Align horizontally
    //         } else {
    //           point.x = prevPoint.x; // Align vertically
    //         }
    //       }
    //     } else if (prevPoint) {
    //       if (
    //         Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)
    //       ) {
    //         point.y = prevPoint.y; // Align horizontally
    //       } else {
    //         point.x = prevPoint.x; // Align vertically
    //       }
    //     } else if (nextPoint) {
    //       // Align with the next point if there's no previous point
    //       if (
    //         Math.abs(point.x - nextPoint.x) > Math.abs(point.y - nextPoint.y)
    //       ) {
    //         point.y = nextPoint.y; // Align horizontally
    //       } else {
    //         point.x = nextPoint.x; // Align vertically
    //       }
    //     }
    //   }

    //   let updatedPoints = [...points];
    //   const updated = replaceValue(updatedPoints, beforeUpdation, point);
    //   dispatch(setPoints(updated));

    //   const updatedLines = storeLines.map((line) => {
    //     let updatedLine = { ...line }; // Shallow copy of the line object
    //     if (updatedLine.points[0].equals(beforeUpdation)) {
    //       updatedLine = {
    //         ...updatedLine,
    //         points: [point, updatedLine.points[1]],
    //         length: convert(point.distanceTo(updatedLine.points[1]) * factor[0])
    //           .from(measured)
    //           .to("mm"),
    //       };
    //     }

    //     if (updatedLine.points[1].equals(beforeUpdation)) {
    //       updatedLine = {
    //         ...updatedLine,
    //         points: [updatedLine.points[0], point],
    //         length: convert(updatedLine.points[0].distanceTo(point) * factor[0])
    //           .from(measured)
    //           .to("mm"),
    //       };
    //     }
    //     return updatedLine;
    //   });

    //   dispatch(setStoreLines(updatedLines));
    // }
  };

  const handleMouseDown = (event) => {
    if (designStep === 3 && expandRoomPopup) {
      setIsSelecting(true);
      const start = screenToNDC(event.clientX, event.clientY);
      setStartPoint(start);
    }
    if (!dragMode) return;

    if (designStep === 2) {
      const point = screenToNDC(event.clientX, event.clientY);
      const pointIndex = points.findIndex((p) => p.distanceTo(point) < 10);
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
      }else if(selectedLines.length > 0){
          const lineIndex = storeLines.findIndex((line) => line.id === selectedLines[0]);
          if(lineIndex !== -1){
            const line = storeLines[lineIndex];
            let val = false;
            if(Math.abs(line.points[0].x - line.points[1].x) > Math.abs(line.points[0].y - line.points[1].y)){
              val = Math.abs(line.points[0].y - point.y) < 10 || Math.abs(line.points[1].y - point.y) < 10;
            }else{
              val = Math.abs(line.points[0].x - point.x) < 10 || Math.abs(line.points[1].x - point.x) < 10;
            }
            if(val){
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
    if(draggingLine !== null && designStep === 2){
      let pts = [];
      storeLines.map((line) => {
        const startPoint = line.points[0];
        const endPoint = line.points[1];
        if (startPoint && pts.find((pt) =>pt.x === startPoint.x && pt.y === startPoint.y && pt.z === startPoint.z) === undefined){
          pts.push(startPoint);
        }
        if (endPoint && pts.find((pt) =>pt.x === endPoint.x && pt.y === endPoint.y && pt.z === endPoint.z) === undefined) {
          pts.push(endPoint);
        }
      });
      var startPoint = currentLinePostion[0]; 
      var endPoint = currentLinePostion[1];
      pts.map((pt) => {
        if(currentLinePostion[0].distanceTo(pt) < 15){
          startPoint=pt;
        }else if(currentLinePostion[1].distanceTo(pt) < 15){
          endPoint=pt;
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
            }else if(p.equals(beforeUpdation2)){
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

  const addRoom = (roomName, roomType) => {
    const room = {
      roomId: uniqueId(),
      roomName: roomName,
      roomType: roomType,
      wallIds: [...selectedLines],
    };
    dispatch(setRoomSelectors([...roomSelectors, room]));
    setSelectedLines([]);
  };

  const handleClick = (event) => {
    if (selectionMode && !lineClick && !expandRoomPopup) {
      setSelectedLines([]);
      dispatch(setContextualMenuStatus(false));
      dispatch(setShowPopup(false));
      if (designStep === 3) {
        dispatch(setExpandRoomNamePopup(false));
        dispatch(setRoomDetails(""));
        dispatch(setRoomName(""));
        dispatch(setRoomEditingMode(false));
        dispatch(setActiveRoomButton(""));
        dispatch(setActiveRoomIndex(-1));
        
      }
      return;
    }
    if (selectionMode || merge || designStep === 1) return; // Prevent drawing new lines in selection mode
    //if (dragMode) return;
    

    let point = screenToNDC(event.clientX, event.clientY);

    if (lineBreak) {
      if (findLineForPoint(point, storeLines, snapActive)) {
        let { closestPointOnLine } = findLineForPoint(
          point,
          storeLines,
          snapActive
        );
        breakingLine(closestPointOnLine);
      } else {
        dispatch(setLineBreakState(false));
        if (!selectionMode) {
          toggleSelectionSplitMode();
        }
      }
      return;
    }

    if (newLine) {
      dispatch(setStop(!stop));
      if (designStep === 2) {
        const pointToSend = [point?.x + 40, point?.y + 100, point?.z];
        dispatch(setContextualMenuStatus(true, pointToSend, "neutral"));
      }
      dispatch(setNewLine(false));

      point = snapToPoint(point, points, storeLines, snapActive);

      const newPoint = [...points, point];
      const breaking = [...breakPoint, point];
      setBreakPoint(breaking);
      dispatch(setPoints(newPoint));
      return;
    }

    if (perpendicularLine && points.length > 0) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }

    point = snapToPoint(point, points, storeLines, snapActive); //snapping
    const newPoints = [...points, point];
    dispatch(setPoints(newPoints));

    if (showSnapLine) {
      addPoint(snappingPoint[0], newPoints[newPoints.length - 2]);
    }

    if (points.length >= 1) {
      if (designStep === 2) {
        const pointToSend = [point?.x + 40, point?.y + 100, point?.z];
        dispatch(setContextualMenuStatus(true, pointToSend, "neutral"));
      }
      addPoint(point, newPoints[newPoints.length - 2]);
    }

    // if (newPoints.length === 2 && firstTime) {
    //   setFirstTime(false);
    //   const userHeight = parseFloat(
    //     prompt("Enter the height of the first line:")
    //   );
    //   const userLength = parseFloat(
    //     prompt("Enter the length of the first line:")
    //   );
    //   const userWidth = parseFloat(
    //     prompt("Enter the thickness of the first line:")
    //   );
    //   const lfactor =
    //     userLength / point.distanceTo(newPoints[newPoints.length - 2]);
    //   const wfactor = INITIAL_BREADTH / userWidth;
    //   const hfactor = INITIAL_HEIGHT / userHeight;
    //   dispatch(setFactor([lfactor, wfactor, hfactor]));

    //   let newLine = {
    //     id: uniqueId(),
    //     points: [newPoints[newPoints.length - 2], point],
    //     length: convert(
    //       newPoints[newPoints.length - 2].distanceTo(point) * lfactor
    //     )
    //       .from(measured)
    //       .to("mm"),
    //     width: convert(INITIAL_BREADTH / wfactor)
    //       .from(measured)
    //       .to("mm"),
    //     height: convert(INITIAL_HEIGHT / hfactor)
    //       .from(measured)
    //       .to("mm"),
    //     widthchangetype: "between",
    //     widthchange: 0,
    //     type: "wall",
    //   };
    //   dispatch(setStoreLines([newLine]));
    // }
    setCurrentMousePosition(null); // Clear the temporary line on click
    setCurrentStrightMousePosition(null); // Clear the temporary line on click
    setDistance(0); // Reset distance display
  };

  const handleMergeClick = () => {
    if (selectedLines.length === 0) {
      return;
    } else {
      let newMergeLines = [];
      selectedLines.forEach((line) => {
        newMergeLines.push(line);
      });
      dispatch(setMergeLine(newMergeLines));
      if (selectedLines.length > 1) {
        handleMerge(newMergeLines);
      }
    }
  };

  const handleMerge = (storeid) => {
    let updatedLine = [...storeLines];
    let merged = false;
    let lockedCount = 0;

    // Sort storeids based on their indices in storeLines to maintain order
    storeid.sort(
      (a, b) =>
        storeLines.findIndex((line) => line.id === a) -
        storeLines.findIndex((line) => line.id === b)
    );
    const history = [...actionHistory];

    let i = 0;
    while (i < storeid.length - 1) {
      let idx1 = updatedLine.findIndex((line) => line.id === storeid[i]);
      let idx2 = updatedLine.findIndex((line) => line.id === storeid[i + 1]);

      const line1 = updatedLine[idx1];
      const line2 = updatedLine[idx2];

      // Check if either line is locked
      if (line1?.locked || line2?.locked) {
        lockedCount += line1.locked ? 1 : 0;
        lockedCount += line2.locked ? 1 : 0;
        i++;
        continue; // Skip merging if any line is locked
      }

      if (
        Math.abs(idx1 - idx2) === 1 &&
        line1.points[1].equals(line2.points[0])
      ) {
        if (
          line1.points[0].x === line2.points[1].x ||
          line1.points[0].y === line2.points[1].y
        ) {
          if (line1.typeId === 1 && line2.typeId === 1) {
            const newline = {
              ...line1,
              points: [line1.points[0], line2.points[1]],
              length: convert(
                line1.points[0].distanceTo(line2.points[1]) * factor[0]
              )
                .from(measured)
                .to("mm"),
            };

            // Replace the two merged lines with the new line
            updatedLine.splice(idx1, 2, newline);
            storeid.splice(i, 2, newline.id); // Update storeid with the new line's ID
            merged = true;
            history.push({
              type: "merge",
              originalLines: [line1, line2],
              mergedLine: newline,
            });
            i = Math.max(0, i - 1); // Re-check from the previous line for further merging
          } else {
            i++;
            toast(
              `Some lines were not wall and could not be merged with a wall.`,
              {
                icon: "⚠️",
                style: {
                  color: "#000",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
                  borderRadius: "8px",
                  fontFamily: "'DM Sans', sans-serif",
                },
              }
            );
          }
        } else {
          i++;
        }
      } else {
        i++;
      }
    }

    if (merged) {
      dispatch(setStoreLines(updatedLine));
      dispatch(setMergeLine([]));
      dispatch(setUndoStack(history));
      dispatch(setRedoStack([]));
    }
    setSelectedLines([]);
    dispatch(setContextualMenuStatus(false));

    // Show a hot-toast notification if any lines were locked
    if (lockedCount > 0) {
      toast(`Some lines were locked and not merged.`, {
        icon: "⚠️",
        style: {
          color: "#000",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
          borderRadius: "8px",
          fontFamily: "'DM Sans', sans-serif",
        },
      });
    }
    return merged;
  };

  useEffect(() => {
    if (lineClick) {
      setTimeout(() => {
        setLineClick(false);
      }, 100);
    }
  }, [lineClick]);

  const handleLineClick = (event, id) => {
    setLineClick(true);
    let storeid = [];
    if (merge) {
      if (!mergeLine.find((line) => line === id)) {
        storeid = [...mergeLine, id];
        dispatch(setMergeLine([...mergeLine, id]));
      }
    }

    if (!lineBreak && !merge && designStep === 2) {
      const line = storeLines.find((line) => line.id === id);
      let pointToSend = [0, 0, 0];
      let idx = 0;
      let position = "neutral";
      if (line?.points[0]?.x > line?.points[1]?.x) {
        idx = 1;
      }
      if (line?.points[1]?.y > line?.points[0]?.y) {
        idx = 1;
      }
      if (
        Math.abs(line?.points[0]?.x - line?.points[1]?.x) <
        Math.abs(line?.points[0]?.y - line?.points[1]?.y)
      ) {
        pointToSend = [
          line?.points[idx]?.x + 40,
          line?.points[idx]?.y - 20,
          line?.points[idx]?.z,
        ];
        position = "right";
      } else {
        pointToSend = [
          line?.points[idx]?.x + 20,
          line?.points[idx]?.y - 40,
          line?.points[idx]?.z,
        ];
        position = "bottom";
      }
      dispatch(setContextualMenuStatus(true, pointToSend, position));
    }

    if (lineBreak) {
      setId(id);
    }
    let merged = false;
    if (merge && storeid.length >= 2) {
      merged = handleMerge(storeid);
    }

    const selectedLine = storeLines.find((line) => line.id === id);

    if (selectionMode && !merged) {
      const selected = selectedLines.includes(id)
        ? selectedLines.filter((lineId) => lineId !== id)
        : merge || expandRoomPopup || shiftPressed
        ? [...selectedLines, id]
        : [id];
      setSelectedLines(selected);
      if (designStep === 3 && roomEditingMode && activeRoomIndex >= 0) {
        let newRooms = [...roomSelectors];
        newRooms[activeRoomIndex] = {
          ...newRooms[activeRoomIndex],
          wallIds: selected,
        };
        dispatch(setRoomSelectors(newRooms));
      }
      if (!selectedLines.includes(id)) {
        dispatch(setShowPopup(true));
        // dispatch(updateLineTypeId(selectedLine.id,selectedLine.typeId || 1))
        dispatch(setTypeId(selectedLine.typeId || 1));
      } else {
        dispatch(setShowPopup(false));
        dispatch(setContextualMenuStatus(false));
        dispatch(setTypeId(1));
      }
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

  const breakingLine = (point) => {
    const idx = storeLines.findIndex((line) => line.id === selectId);
    const line = storeLines.filter((line) => line.id === selectId);
    if (line[0] && line[0]?.locked) {
      toast("Line is locked and cannot be split.", {
        icon: "⚠️",
        style: {
          fontFamily: "'DM Sans', sans-serif",
          color: "#000",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
        },
      });
      return;
    }
    if (storeLines[idx].typeId !== 1) return;
    if (idx === -1) return; // Line not found
    let updatedLine = storeLines[idx];

    let store = [...storeLines];
    let pointsVal = [...points];

    // Create the first split line
    const splitNewLine = {
      ...updatedLine,
      id: uniqueId(),
      points: [updatedLine.points[0], point],
    };
    splitNewLine.length = convert(
      splitNewLine.points[0].distanceTo(splitNewLine.points[1]) * factor[0]
    )
      .from(measured)
      .to("mm");

    // Create the second split line
    const splitNewLine1 = {
      ...updatedLine,
      id: uniqueId(),
      points: [point, updatedLine.points[1]],
    };
    splitNewLine1.length = convert(
      splitNewLine1.points[0].distanceTo(splitNewLine1.points[1]) * factor[0]
    )
      .from(measured)
      .to("mm");

    // Replace the original line with the two new split lines
    store.splice(idx, 1, splitNewLine, splitNewLine1);

    // Update the points list by inserting the break point
    const startindex = points.findIndex((p) => p.equals(updatedLine.points[0]));
    const endIndex = points.findIndex((p) => p.equals(updatedLine.points[1]));

    if (startindex !== -1 && endIndex !== -1 && startindex < endIndex) {
      pointsVal.splice(startindex + 1, 0, point);
    }

    // Dispatch the updated store and points
    dispatch(setStoreLines(store));
    dispatch(setPoints(pointsVal));
    const history = [...actionHistory];
    history.push({
      type: "split",
      originalLine: updatedLine,
      splitLines: [splitNewLine, splitNewLine1],
      newPoint: point, // store the breakpoint location
    });
    dispatch(setUndoStack(history));
    dispatch(setRedoStack([]));
  };

  return {
    currentMousePosition,
    currentLinePostion,
    draggingLine,
    currentStrightMousePosition,
    distance,
    dimensions,
    nearPoint,
    nearVal,
    handleClick,
    handleMouseMove,
    handleLineClick,
    handleMouseDown,
    handleMouseUp,
    setDimensions,
    deleteSelectedLines,
    deleteSelectedRoom,
    handleMergeClick,
    addRoom,
    isSelecting,
    startPoint,
    endPoint,
    setDraggingPointIndex,
    draggingLineIndex,
    setCurrentLinePostion
  };
};
