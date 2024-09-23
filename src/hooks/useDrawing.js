import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import convert from "convert-units";
import { Vector2, Vector3 } from "three";
import {
  setRoomSelectors,
  setLineBreakState,
  setUpperPoint,
  setLowerPoint,
  setSnapPoint,
  setLinePlacementMode,
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
  setShowSetScalePopup,
  setFirstLinePoints,
  setHelpVideo,
} from "../Actions/ApplicationStateAction.js";
import {
  setContextualMenuStatus,
  setCurrentMousePosition,
  setCurrentStrightMousePosition,
  setDistance,
  setDragMode,
  setEnablePolygonSelection,
  setMergeLine,
  setNewLine,
  setRedoStack,
  setRoomRedoStack,
  setRoomUndoStack,
  setShowPopup,
  setShowSnapLine,
  setSnappingPoint,
  setStop,
  setTypeId,
  setUndoStack,
  updateTemoraryPolygon,
} from "../Actions/DrawingActions.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-hot-toast";
import useModes from "./useModes.js";
import usePoints from "./usePoints.js";
import { dividePolygon } from "../utils/polygon.js";

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
    userLength,
    userWidth,
    snapPoint,
    linePlacementMode,
  } = useSelector((state) => state.drawing);
  const {
    typeId,
    actionHistory,
    roomActionHistory,
    stop,
    newLine,
    showSnapLine,
    snappingPoint,
    dragMode,
    mergeLine,
    shiftPressed,
    temporaryPolygon,
    enablePolygonSelection
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
    img
  } = useSelector((state) => state.ApplicationState);

  const { toggleSelectionSplitMode } = useModes();
  const { screenToNDC, isPointInsidePolygon, arePointsSimilar } = usePoints();

  const [breakPoint, setBreakPoint] = useState([]);
  const [dimensions, setDimensions] = useState({ l: 50, w: 10, h: 50 });
  const [selectId, setId] = useState(null);
  const [lineClick, setLineClick] = useState(false);

  const setSelectedLines = (data) => {
    dispatch(setSelectedLinesState(data));
  };

  const addPoint = (newPoint, startPoint, fact = factor, length = userLength, width = userWidth) => {
    if(storeLines.length===0 && length === 0 && width === 0 && !img){
      dispatch(setShowSetScalePopup(true))
      dispatch(setContextualMenuStatus(false))
      dispatch(setFirstLinePoints([newPoint, startPoint]));
      return;
    }
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
      length: convert(startPoint.distanceTo(newPoint) * fact[0])
        .from(measured)
        .to("mm"),
      // width: (1/factor[0]) * userWidth,
      width: convert(INITIAL_BREADTH / fact[1])
        .from(measured)
        .to("mm"),
      height: convert(INITIAL_HEIGHT / fact[2])
        .from(measured)
        .to("mm"),
      widthchangetype: "between",
      widthchange: 0,
      type,
      typeId: typeId,
      locked: false,
      isCustomised: null,
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
        newPoint,
        snapActive
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
        splitNewLine.points[0].distanceTo(splitNewLine.points[1]) * fact[0]
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
      const finalNewLineSegment = {
        ...newLine,
        id: uniqueId(),
        points: [currentStartPoint, newPoint],
      };
      finalNewLineSegment.length = convert(
        finalNewLineSegment.points[0].distanceTo(
          finalNewLineSegment.points[1]
        ) * fact[0]
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
        splitLine1.points[0].distanceTo(splitLine1.points[1]) * fact[0]
      )
        .from(measured)
        .to("mm");
      splitLine2.length = convert(
        splitLine2.points[0].distanceTo(splitLine2.points[1]) * fact[0]
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

  // useEffect(() => {
  //   const { pointUpper, pointLower } = calculateUpperAndLowerPoints(
  //     storeLines,
  //     factor,
  //     measured
  //   );
  //   // console.log("hello this is working");
  //   // console.log(pointUpper);

  //   // Dispatch the calculated points to the store
  //   dispatch(setUpperPoint(pointUpper));
  //   dispatch(setLowerPoint(pointLower));
  // }, [storeLines, factor, measured, dispatch]);

  const deleteSelectedRoom = () => {
    if (activeRoomIndex !== -1) {
      const rooms = [...roomSelectors];
      rooms.splice(activeRoomIndex, 1);
      dispatch(setRoomSelectors(rooms));
      setSelectedLines([]);
      const history = [...roomActionHistory];
      history.push({
        type: "updateRoom",
        oldRooms: [...roomSelectors],
        newRooms: rooms,
      });
      dispatch(setRoomUndoStack(history));
      dispatch(setRoomRedoStack([]));
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


  const addRoom = (roomName, roomType) => {
    const room = {
      roomId: uniqueId(),
      polygon: temporaryPolygon,
      roomName: roomName,
      roomType: roomType,
      wallIds: [...selectedLines],
    };
    let history = [...roomActionHistory];
    history = history.filter(
      (action) => action.type !== "addPoint"
    ); // clearing temporary polygon's points from undo stack
    history.push({
      type: "updateRoom",
      oldRooms: [...roomSelectors],
      newRooms: [...roomSelectors, room],
    });
    dispatch(setRoomUndoStack(history));
    dispatch(setRoomRedoStack([]));
    dispatch(setRoomSelectors([...roomSelectors, room]));
    setSelectedLines([]);
    dispatch(updateTemoraryPolygon([]))
  };

  const handleClick = (event) => {
    dispatch(setHelpVideo(false))
    if (selectionMode && !lineClick && !enablePolygonSelection && activeRoomButton !== "divide") {
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

    let point = screenToNDC(event.clientX, event.clientY);

    if(designStep ===3 && enablePolygonSelection && activeRoomButton !== "divide"){
      const polygon = [...temporaryPolygon];
      const history = [...roomActionHistory];
      if(showSnapLine){
        polygon.push(snappingPoint[0]);
        history.push({
          type: "addPoint",
          oldPolygon: [...temporaryPolygon],
          newPolygon: [...polygon],
        });
      }else{
        let cuuPoint = point;
        roomSelectors.forEach((room) => {
          const points = room.polygon;
          for (let i = 0; i < points.length; i++) {
            const currPoint = new Vector3(points[i].x, points[i].y, 0);
            if (point.distanceTo(currPoint) < 10) {
              cuuPoint = points[i];
              break;
            }
          }
        });
        polygon.push(cuuPoint);
        history.push({
          type: "addPoint",
          oldPolygon: [...temporaryPolygon],
          newPolygon: [...polygon],
        });
      }
      dispatch(setRoomUndoStack(history));
      dispatch(setRoomRedoStack([]));
      dispatch(updateTemoraryPolygon(polygon));
      const newLine = [...selectedLines];
      storeLines.map((line) => {
        const midpoint = new Vector3()
          .addVectors(line.points[0], line.points[1])
          .multiplyScalar(0.5);
        const tolerance = 10;
        const maxX = midpoint.x + tolerance;
        const minX = midpoint.x - tolerance;
        const maxY = midpoint.y + tolerance;
        const minY = midpoint.y - tolerance;
        if (
          isPointInsidePolygon(polygon, { x: maxX, y: midpoint.y }) ||
          isPointInsidePolygon(polygon, { x: minX, y: midpoint.y }) ||
          isPointInsidePolygon(polygon, { x: midpoint.x, y: maxY }) ||
          isPointInsidePolygon(polygon, { x: midpoint.x, y: minY })
        ) {
          newLine.push(line.id);
        }
      });
      dispatch(setSelectedLinesState(newLine));
      return
    }
    if(designStep === 3 && activeRoomButton === "divide"){
      const line = [...temporaryPolygon];
      line.push(point);
      if(line.length === 1){
        dispatch(updateTemoraryPolygon(line));
      }
      if(line.length === 2){
        const history = [...roomActionHistory];
        const polygon = roomSelectors[activeRoomIndex].polygon;
        const newPolygon = dividePolygon(polygon, line);
        if (newPolygon.length > 1) {
          const newRooms = roomSelectors.filter(
            (room, index) => index !== activeRoomIndex
          );
          newPolygon.forEach((polygon, index) => {
            const newLine = [];
            storeLines.map((line) => {
              const midpoint = new Vector3()
                .addVectors(line.points[0], line.points[1])
                .multiplyScalar(0.5);
              const tolerance = 10;
              const maxX = midpoint.x + tolerance;
              const minX = midpoint.x - tolerance;
              const maxY = midpoint.y + tolerance;
              const minY = midpoint.y - tolerance;
              if (isPointInsidePolygon(polygon, {x: maxX, y: midpoint.y}) || isPointInsidePolygon(polygon, {x: minX, y: midpoint.y}) || isPointInsidePolygon(polygon, {x: midpoint.x, y: maxY}) || isPointInsidePolygon(polygon, {x: midpoint.x, y: minY})) {
                newLine.push(line.id);
              }
            });
            const newRoom = {
              roomId: uniqueId(),
              polygon: polygon,
              roomName: `New Room ${roomSelectors.length + index + 1}`,
              roomType: "",
              wallIds: [...newLine],
            };
            newRooms.push(newRoom);
          });
          history.push({
            type: "updateRoom",
            oldRooms: [...roomSelectors],
            newRooms: [...newRooms],
          });
          dispatch(setRoomUndoStack(history));
          dispatch(setRoomRedoStack([]));
          dispatch(setRoomSelectors(newRooms));
          dispatch(setEnablePolygonSelection(false));
          dispatch(setActiveRoomButton(""));
          dispatch(setActiveRoomIndex(-1));
        } else {
          toast.error("Invalid Division, kindly draw to divide the room", {
            style: {
              color: "#000",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
            },
          });
        }
        dispatch(updateTemoraryPolygon([]));
        
      }
      return
    }
    if (selectionMode || merge || designStep === 1) return; // Prevent drawing new lines in selection mode
    //if (dragMode) return;
    


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

      point = snapToPoint(point, points, storeLines, snapActive,factor,measured,snapPoint,linePlacementMode);
      
      

      const newPoint = [...points, point];
      const breaking = [...breakPoint, point];
      setBreakPoint(breaking);
      dispatch(setPoints(newPoint));
      return;
    }

    if (perpendicularLine && points.length > 0) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }
    if (!perpendicularLine && points.length > 0) {
      const lastPoint = points[points.length - 1];
      const position = calculateAlignedPoint(lastPoint, point);
      const V1 = new Vector3().subVectors(position, lastPoint); 
      const V2 = new Vector3().subVectors(point, lastPoint); 
      const angleInRadians = V1.angleTo(V2);
      const angleInDegrees = angleInRadians * (180 / Math.PI);
      if(angleInDegrees < 3){
        point = position;
      }
    }

    point = snapToPoint(point, points, storeLines, snapActive,factor,measured,snapPoint,linePlacementMode); //snapping
    
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
    if(designStep === 3){
      if(expandRoomPopup){
        if(enablePolygonSelection){
          return
        }
      }else{
        return
      }
    }
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
    addPoint,
    dimensions,
    handleClick,
    handleLineClick,
    setDimensions,
    deleteSelectedLines,
    deleteSelectedRoom,
    handleMergeClick,
    addRoom,
  };
};
