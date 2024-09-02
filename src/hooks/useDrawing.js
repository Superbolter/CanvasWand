import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import convert from "convert-units";
import { Vector3 } from "three";
import {
  setPerpendicularLine,
  setInformation,
  setRoomSelect,
  setRoomSelectors,
  setType,
  setScale,
  setSelectedButton,
  setLeftPosState,
  setRightPosState,
  setUserLength,
  setLineBreakState,
  setMergeState,
  setUserHeight,
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
import {
  setPoints,
  setStoreLines,
  setFactor,
  showRoomNamePopup,
  updateDrawData,
  setStoreBoxes,
  updateLineTypeId,
  setRoomSelectorMode,
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
  setRedoState,
  setShowPopup,
  setTypeId,
  setUndoStack,
} from "../Actions/DrawingActions.js";
import { handleDownload } from "../component/ConvertToJson.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from 'react-hot-toast';
import { fetchWrapper } from "../app/RomeDataManager.js";
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MySwal = withReactContent(Swal);

export const useDrawing = () => {
  const dispatch = useDispatch();
  const {
    idSelection,
    perpendicularLine,
    measured,
    scale,
    information,
    roomSelect,
    roomSelectors,
    leftPos,
    rightPos,
    userLength,
    userWidth,
    userHeight,
    lineBreak,
    merge,
  } = useSelector((state) => state.drawing);
  const { typeId, contextualMenuStatus, actionHistory, redoStack} = useSelector(
    (state) => state.Drawing
  );
  const {
    storeLines,
    points,
    factor,
    floorplanId,
    storeBoxes,
    roomSelectorMode,
    selectionMode,
    selectedLines,
    expandRoomPopup,
    roomEditingMode,
    activeRoomIndex,
  } = useSelector((state) => state.ApplicationState);

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
  const [redoLines, setRedoLines] = useState([]); // Holds the lines that have been undone and can be redone
  const [redoPoints, setRedoPoints] = useState([]); // Holds the points that have been undone and can be redone
  const [isDraggingDoor, setIsDraggingDoor] = useState(false);
  const [doorPosition, setDoorPosition] = useState([]);
  const [dimensions, setDimensions] = useState({ l: 50, w: 10, h: 50 });
  const [check, setCheck] = useState(true);
  const [breakPointLocation, setBreakPointLocation] = useState(null);
  const [selectId, setId] = useState(null);
  const [mergeLine, setMergeLine] = useState([]);
  const [lineClick, setLineClick] = useState(false);
  const [doorPoint, setdoorPoint] = useState([]);

  const [snappingPoint, setSnappingPoint] = useState([]);
  const [showSnapLine, setShowSnapLine] = useState(false);
  // const [actionHistory, setActionHistory] = useState([]);
  // const [redoStack, setRedoStack] = useState([]);
  // const [leftPos, setLeftPosState] = useState(new Vector3(-5, 0, 0));
  // const [rightPos, setRightPosState] = useState(new Vector3(5, 0, 0));
  const [nearPoint, setNearPoint] = useState(false);
  const [nearVal, setNearVal]= useState();
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const setActionHistory = (data) =>{
    dispatch(setUndoStack(data))
  }

  const setRedoStack = (data) =>{
    dispatch(setRedoState(data))
  }

  const setSelectedLines = (data) => {
    dispatch(setSelectedLinesState(data));
  };

  const setMerge = (data) => {
    dispatch(setMergeState(data));
  };

  const setLineBreak = (data) => {
    dispatch(setLineBreakState(data));
  };

  const setLeftPos = (data) => {
    dispatch(setLeftPosState(data));
  };

  const setRightPos = (data) => {
    dispatch(setRightPosState(data));
  };

  const handlePointerDown = useCallback(
    (event, right, left, mesh) => {
      setIsDraggingDoor(true);
      setDoorWindowMode(true);
      event.stopPropagation();
    },
    [selectionMode, dragMode]
  );

  function arePointsSimilar(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y;
  }

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
          updatedPoint.splice(index + 1, 0, endPoint, startPoint);
        } else {
          updatedPoint.splice(index + 1, 0, startPoint, endPoint);
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
        typeId: 1,
        locked: false
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
        typeId: 1,
        locked: false
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
        typeId: 2,
        locked: false
      };

      const updatedLine = [...storeLines];

      updatedLine.splice(idx, 1, line1, line3, line2);

      dispatch(setStoreLines(updatedLine));
      setIsDraggingDoor(false);

      dispatch(setSelectionMode(false));
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
    const previousLines = [...storeLines];
    const previousPoints = [...points];
    const previousBoxes = [...storeBoxes];
    let type = typeId === 1 ? "wall" : typeId===2? "door": typeId === 3 ? "window" : typeId === 4? "railing": typeId === 5? "imaginary": ""
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
      type,
      typeId: typeId,
      locked: false,
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
    const history = [...actionHistory]
    history.push({
      type: 'addPoint',
      previousLines,
      previousPoints,
      previousBoxes,
      newLines: updatedStoreLines,
      newPoints,
      newBoxes: [...storeBoxes],
    });
    setActionHistory(history);
    setRedoStack([]);
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

  const deleteLastPoint = () => {
    const deleteLine = storeLines[storeLines.length - 1];
    const updatedLines = storeLines.slice(0, -1);
    let updatedPoints = points.slice(0, -1);
    const lastPoint = updatedPoints[updatedPoints.length - 1];
    const deleteLinePoints = deleteLine.points;

    // Iterate over storeBoxes and remove the ones that match
    const result = storeBoxes.filter(
      (box) =>
        !shouldRemoveBox([box.p1, box.p2, box.p3, box.p4], deleteLinePoints)
    );
    dispatch(setStoreBoxes(result));

    const roomupdate = roomSelectors
      .map((room) => {
        // Filter out the walls that are in the selectedLines array
        const updatedWallIds = room.wallIds.filter((lineId) =>  !selectedLines.includes(lineId) ); // Remove if in selectedLines
        // Return null if the room has no walls left
        if (updatedWallIds.length < 2) {
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

    const hasBreakPoint = breakPoint.includes(lastPoint);
    if (hasBreakPoint) {
      updatedPoints = updatedPoints.slice(0, -1);
    }
    if (updatedPoints.length === 1) {
      updatedPoints = updatedPoints.slice(0, -1);
    }
    // Store the undone line and point in the redo stacks
    const redoLine = deleteLine;
    const redoPoint = points[points.length - 1];

    setRedoLines((prevRedoLines) => [...prevRedoLines, redoLine]);
    setRedoPoints((prevRedoPoints) => [...prevRedoPoints, redoPoint]);

    // Update the state with the new lines and points
    dispatch(setStoreLines(updatedLines));
    dispatch(setPoints(updatedPoints));
  };

  const undo = () => {
    const newStack = [...actionHistory];
    const lastAction = newStack.pop();
    if (!lastAction) return; // No action to undo

    const redoStackCopy = [...redoStack, lastAction];
    setRedoStack(redoStackCopy);
  
    switch (lastAction.type) {
      case 'delete':
        // Undo deletion by adding back the deleted lines
        dispatch(setStoreLines([...storeLines, ...lastAction.deletedLines]));
        dispatch(setPoints([...points, ...lastAction.deletedPoints]));
        dispatch(setStoreBoxes([...storeBoxes, ...lastAction.deletedBoxes]));
        break;
  
      case 'merge':
        // Undo merge by removing the merged line and adding back the original lines
        const filteredLines = storeLines.filter(
          (line) => line.id !== lastAction.mergedLine.id
        );
        dispatch(setStoreLines([...filteredLines, ...lastAction.originalLines]));
        break;
  
      case 'split':
        // Undo split by removing the split lines and adding back the original line
        const linesAfterSplitUndo = storeLines.filter(
          (line) =>
            !lastAction.splitLines.some((splitLine) => splitLine.id === line.id)
        );
        dispatch(setStoreLines([...linesAfterSplitUndo, lastAction.originalLine]));
        
        // Optionally remove the break point if necessary
        const pointsAfterSplitUndo = points.filter(
          (p) => !p.equals(lastAction.newPoint)
        );
        dispatch(setPoints(pointsAfterSplitUndo));
        break;
      
      case 'addPoint':
         // Undo addPoint by restoring the previous state
        dispatch(setStoreLines([...lastAction.previousLines]));
        dispatch(setPoints([...lastAction.previousPoints]));
        dispatch(setStoreBoxes([...lastAction.previousBoxes]));
        break;
      
      case 'replace':
        dispatch(setStoreLines([...lastAction.previousLines]));
        break;

      default:
        break;
      }
      setActionHistory(newStack);
      // setActionHistory([...actionHistory]);
  };
  

  const redo = () => {
    const newStack = [...redoStack];
    const lastRedoAction = newStack.pop();
    if (!lastRedoAction) return; // No action to redo

    // Push the redone action back to the undo stack
    const updatedHistory = [...actionHistory, lastRedoAction];
    setActionHistory(updatedHistory);

    switch (lastRedoAction.type) {
      case "delete":
        // Redo deletion by removing the deleted lines again
        const updatedLines = storeLines.filter(
          (line) => !lastRedoAction.deletedLines.some((dl) => dl.id === line.id)
        );
        dispatch(setStoreLines(updatedLines));
        const updatedPoints = points.filter(
          (p) => !lastRedoAction.deletedPoints.some((dp) => dp.equals(p))
        );
        dispatch(setPoints(updatedPoints));
        dispatch(
          setStoreBoxes(
            storeBoxes.filter(
              (box) =>
                !lastRedoAction.deletedBoxes.some((db) => db.id === box.id)
            )
          )
        );
        break;

      case "merge":
        // Redo merge by removing the original lines and adding the merged line
        const mergedLines = storeLines.filter(
          (line) =>
            !lastRedoAction.originalLines.some((ol) => ol.id === line.id)
        );
        dispatch(setStoreLines([...mergedLines, lastRedoAction.mergedLine]));
        break;

      case "split":
        // Redo split by removing the original line and adding the split lines
        const splitLines = storeLines.filter(
          (line) => line.id !== lastRedoAction.originalLine.id
        );
        dispatch(setStoreLines([...splitLines, ...lastRedoAction.splitLines]));

        // Optionally add the break point if necessary
        dispatch(setPoints([...points, lastRedoAction.newPoint]));
        break;

      case "addPoint":
        // Redo addPoint by restoring the state after the point was added
        dispatch(setStoreLines([...lastRedoAction.newLines]));
        dispatch(setPoints([...lastRedoAction.newPoints]));
        dispatch(setStoreBoxes([...lastRedoAction.newBoxes]));
        break;
      
      case 'replace':
        dispatch(setStoreLines([...lastRedoAction.currentLines]));
        break;

      default:
        break;
    }
    setRedoStack(newStack);
    // setRedoStack([...redoStack]); // Update the redo stack
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
    deletedLines.forEach((line)=>{
      const deleteLinePoints = line.points;
      // Iterate over storeBoxes and remove the ones that match
      const deletedBoxes = storeBoxes.filter(
        (box) =>
          shouldRemoveBox([box.p1, box.p2, box.p3, box.p4], deleteLinePoints)
      );
      deletedBoxes.forEach((box) => boxes.add(box));
      deletedPoints.push(line.points[0], line.points[1]);
    })
    dispatch(setStoreBoxes(storeBoxes.filter((box) => !boxes.has(box))));


    const history = [...actionHistory];
    history.push({
      type: 'delete',
      deletedLines,
      deletedPoints,
      deletedBoxes: Array.from(boxes),
    });
    setActionHistory(history);
    setRedoStack([]);
  
    const pointsToKeep = [];
  
    if(updatedLines.length>0){
      updatedLines.forEach((line) => {
        pointsToKeep.push(line.points[0], line.points[1]);
      });
    
      const updatedPoints = points.filter((point) =>
        pointsToKeep.some((p) => p.equals(point))
      );
    
      dispatch(setStoreLines(updatedLines));
      dispatch(setPoints(updatedPoints));
    }else{
      dispatch(setStoreLines([]));
      dispatch(setPoints([]));
    }
    setSelectedLines([]);
    dispatch(setContextualMenuStatus(false));
  
    // Show hot-toast with the count of locked lines
    if (lockedCount > 1) {
      toast(`${lockedCount} structures were locked and were not deleted.`, {
        icon: '⚠️',
        style: {
          fontFamily: "'DM Sans', sans-serif",
          color: '#000',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)'
        },
      });
    }else if(lockedCount === 1){
      toast(`${lockedCount} structure was locked and was not deleted.`, {
        icon: '⚠️',
        style: {
          color: '#000',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)'
        },
      });
    }
  };
  

  const perpendicularHandler = () => {
    dispatch(setPerpendicularLine(!perpendicularLine));
    setNewLine(true);
    setShowSnapLine(false);
    setStop(true);
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      setSelectedLines([]);
      setNewLine(true);
      dispatch(setContextualMenuStatus(false));
      setShowSnapLine(false);
      setStop(true);
      setDragMode(false);
    } else {
      setNewLine(true);
      setShowSnapLine(false);
      dispatch(setContextualMenuStatus(false));
      setStop(true);
      setDragMode(true);
      dispatch(setSelectedButton([]));
    }
    dispatch(setSelectionMode(!selectionMode));
  };

  const escape = () => {
    setNewLine(!newLine);
    setShowSnapLine(false);
    dispatch(setContextualMenuStatus(false));
    setStop(!stop);
  };

  const handleDoubleClick = async () => {
    let height = userHeight;
    switch (measured){
      case "in":
        height = "120";
        break;
      case "cm":
        height = "304.8";
        break;
      case "ft":
        height = "10";
        break;
      case "m":
        height = "3.05";
        break;
      case "mm":
        height = "3048";
        break;
      default:
        break;
    }
    dispatch(setUserHeight(height))
    dispatch(setUserLength(userLength));
    const lfactor = userLength / leftPos.distanceTo(rightPos);
    const wfactor = INITIAL_BREADTH / userWidth;
    const hfactor = INITIAL_HEIGHT / height;
    dispatch(setFactor([lfactor, wfactor, hfactor]));
    dispatch(setScale(false));
    handleApiCall(height)
  };


  const screenToNDC = (clientX, clientY) => {
    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((clientY - rect.top) / rect.height) * 2 + 1;
    const cameraWidth = rect.width;
    const cameraHeight = rect.height;
    const ndcX = x * (cameraWidth / 2);
    const ndcY = y * (cameraHeight / 2);
    return new Vector3(ndcX, ndcY);
  };

  const handleMouseMove = (event) => {
    if(roomSelectorMode && expandRoomPopup){
      if (!isSelecting) return;
      const end = screenToNDC(event.clientX, event.clientY);
      setEndPoint(end);
    }
    if (
      (points.length === 0 || stop || newLine || doorWindowMode || scale) &&
      !dragMode
    )
      return; // No point to start from or not in perpendicular mode
    // if(roomSelectorMode) return;

    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const cameraWidth = rect.width;
    const cameraHeight = rect.height;

    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);

    let point = new Vector3(posX, posY, 0);
    if(lineBreak){
      if (findLineForPoint(point, storeLines)) {
        let { closestPointOnLine,line } = findLineForPoint(point, storeLines);
        if(closestPointOnLine){
          setNearPoint(true);
          setNearVal({line: line, point: closestPointOnLine})
        }else{
          setNearPoint(false);
          setNearVal(null);
        }
      } 
    }

    if (perpendicularLine && draggingPointIndex === null) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }

    setCurrentMousePosition(point);
    
    let cuuPoint = point;
    // Check for snapping
    let snapFound = false;
    for (let i = 0; i < points.length; i++) {
      if (
        Math.abs(points[i].x - point.x) < 2 &&
        points[points.length - 1].y !== points[i].y &&
        points[points.length - 1].x !== points[i].x && !selectionMode
      ) {
        cuuPoint.x = points[i].x;
        let newarr = [cuuPoint, points[i]];
        setSnappingPoint([...newarr]);
        snapFound = true;
        break;
      } else if (
        Math.abs(points[i].y - point.y) < 2 &&
        points[points.length - 1].y !== points[i].y &&
        points[points.length - 1].x !== points[i].x && !selectionMode
      ) {
        cuuPoint.y = points[i].y;
        let newarr = [cuuPoint, points[i]];
        setSnappingPoint([...newarr]);
        snapFound = true;
        break;
      }
    }

    if (!snapFound) {
      setSnappingPoint([]);
    }

    setShowSnapLine(snapFound);
    //setCurrentMousePosition(point);

    const lastPoint = points[points.length - 1];
    const currentDistance = lastPoint.distanceTo(point);
    setDistance(currentDistance * factor[0]);

    if (draggingPointIndex !== null && !roomSelectorMode) {
      let beforeUpdation = points[draggingPointIndex];

      let prevPoint = points[draggingPointIndex - 1];

      let nextPoint = points[draggingPointIndex + 1];
      if (perpendicularLine) {
        if (prevPoint && nextPoint) {
          // Check if all coordinates are different

          if (
            point.x !== prevPoint.x &&
            point.y !== prevPoint.y &&
            point.x !== nextPoint.x &&
            point.y !== nextPoint.y
          ) {
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
            if (
              Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)
            ) {
              point.y = prevPoint.y; // Align horizontally
            } else {
              point.x = prevPoint.x; // Align vertically
            }
          }
        } else if (prevPoint) {
          if (
            Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)
          ) {
            point.y = prevPoint.y; // Align horizontally
          } else {
            point.x = prevPoint.x; // Align vertically
          }
        } else if (nextPoint) {
          // Align with the next point if there's no previous point
          if (
            Math.abs(point.x - nextPoint.x) > Math.abs(point.y - nextPoint.y)
          ) {
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
    if(roomSelectorMode && expandRoomPopup){
      setIsSelecting(true);
      const start = screenToNDC(event.clientX, event.clientY);
      setStartPoint(start);
    }
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
    if(roomSelectorMode && expandRoomPopup){
      if (!isSelecting) return;
    const selectedIds = [];
    if (startPoint && endPoint) {
      const minX = Math.min(startPoint.x, endPoint.x);
      const maxX = Math.max(startPoint.x, endPoint.x);
      const minY = Math.min(startPoint.y, endPoint.y);
      const maxY = Math.max(startPoint.y, endPoint.y);

      storeLines.forEach(line => {
        const startPos = line.points[0]

        const endPos = line.points[1]

        if (
          startPos.x >= minX && startPos.x <= maxX &&
          startPos.y >= minY && startPos.y <= maxY &&
          endPos.x >= minX && endPos.x <= maxX &&
          endPos.y >= minY && endPos.y <= maxY
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
  

  const room = () => {
    MySwal.fire({
      title: "Enter the room name",
      input: "text",
      inputPlaceholder: "Enter the name here...",
      showCancelButton: true,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("You need to enter a name!");
        }
      },
      customClass: {
        title: "swal2-title-custom",
        htmlContainer: "swal2-text-custom",
        input: "swal2-input-custom",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const roomName = result.value;
        const room = {
          roomId: uniqueId(),
          roomName: roomName,
          wallIds: [...selectedLines],
        };
        dispatch(setRoomSelectors([...roomSelectors, room]));
        setSelectedLines([]);
        dispatch(setRoomSelect(false));
      }
    });
    // const roomName = prompt("Enter the room Name:");

    // const room = {
    //   roomId: uniqueId(),
    //   roomName: roomName,
    //   wallIds: [...selectedLines],
    // }

    // dispatch(setRoomSelectors([...roomSelectors,room]));
    // setSelectedLines([]);
    // dispatch(setRoomSelect(false));
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
  }

  const toggleSelectionSplitMode = () => {
    if (selectionMode) {
      setSelectedLines([]);
      setNewLine(false);
      dispatch(setContextualMenuStatus(false));
      setShowSnapLine(false);
      setStop(true);
    } else {
      setNewLine(true);
      setShowSnapLine(false);
      dispatch(setContextualMenuStatus(false));
      setStop(true);
      dispatch(setSelectedButton([]));
    }
    dispatch(setSelectionMode(!selectionMode));
  };

  const handleClick = (event) => {
    if (selectionMode && !lineClick && !expandRoomPopup) {
      setSelectedLines([]);
      dispatch(setContextualMenuStatus(false));
      dispatch(setShowPopup(false));
      if(roomSelectorMode){
        dispatch(setExpandRoomNamePopup(false));
        dispatch(setRoomDetails(""))
        dispatch(setRoomName(""))
        dispatch(setRoomEditingMode(false))
        dispatch(setActiveRoomButton(""))
        dispatch(setActiveRoomIndex(-1))
      }
      return;
    }
    if (selectionMode || doorWindowMode || merge || scale) return; // Prevent drawing new lines in selection mode
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
    if (lineBreak) {
      if (findLineForPoint(point, storeLines)) {
        let { closestPointOnLine } = findLineForPoint(point, storeLines);
        breakingLine(closestPointOnLine);
      } else {
        setLineBreak(false);
        if (!selectionMode) {
          toggleSelectionSplitMode();
        }
      }
      return;
    }

    if (newLine) {
      setStop(!stop);
      if(!roomSelectorMode){
        const pointToSend = [point?.x + 40, point?.y + 100 , point?.z];
        dispatch(setContextualMenuStatus(true,pointToSend,"neutral"));
      }
      setNewLine(false);
      point = snapToPoint(point, points, storeLines);

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

    if (showSnapLine) {
      addPoint(snappingPoint[0], newPoints[newPoints.length - 2]);
    }

    if (points.length >= 1) {
      if(!roomSelectorMode){
        const pointToSend = [point?.x + 40, point?.y + 100 , point?.z];
        dispatch(setContextualMenuStatus(true,pointToSend,"neutral"));
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
    setDistance(0); // Reset distance display
  };

  const handleMergeClick = () => {
    if (selectedLines.length === 0) {
      return;
    } else {
      let newMergeLines= []
      selectedLines.forEach((line)=>{
        newMergeLines.push(line)
      })
      setMergeLine(newMergeLines)
      handleMerge(newMergeLines);
    }
  };

  const handleMerge = (storeid) => {
    let updatedLine = [...storeLines];
    let merged = false;
    let lockedCount = 0;
  
    // Sort storeids based on their indices in storeLines to maintain order
    storeid.sort((a, b) => storeLines.findIndex(line => line.id === a) - storeLines.findIndex(line => line.id === b));
    const history = [...actionHistory]
    
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
        if(line1.typeId=== 1 && line2.typeId=== 1){
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
            type: 'merge',
            originalLines: [line1, line2],
            mergedLine: newline,
          });
          i = Math.max(0, i - 1); // Re-check from the previous line for further merging
        } else {
          i++;
          toast(`Some lines were not wall and could not be merged with a wall.`, {
            icon: '⚠️',
            style: {
              color: '#000',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            },
          });
        }}else{
          i++;
        }
      } else {
        i++;
      }
    }
  
    if (merged) {
      dispatch(setStoreLines(updatedLine));
      setMergeLine([]);
      setActionHistory(history);
      setRedoStack([]);
    }
    setSelectedLines([]);
    dispatch(setContextualMenuStatus(false));

    // Show a hot-toast notification if any lines were locked
    if (lockedCount > 0) {
      toast(`Some lines were locked and not merged.`, {
        icon: '⚠️',
        style: {
          color: '#000',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)',
          borderRadius: '8px',
          fontFamily: "'DM Sans', sans-serif",
        },
      });
    }
    return merged
  }

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
      if(!mergeLine.find(line => line === id)){
        storeid = [...mergeLine, id];
        setMergeLine([...mergeLine, id]);
      }
    }

    if (!lineBreak && !merge && !roomSelectorMode) {
      const line = storeLines.find((line) => line.id === id);
      let pointToSend = [0,0,0];
      let idx = 0; 
      let position = "neutral";
      if(line?.points[0]?.x > line?.points[1]?.x){
        idx = 1;
      }
      if(line?.points[1]?.y > line?.points[0]?.y){
        idx = 1;
      }
      if(Math.abs(line?.points[0]?.x - line?.points[1]?.x)< Math.abs(line?.points[0]?.y - line?.points[1]?.y)){
        pointToSend = [line?.points[idx]?.x + 40, line?.points[idx]?.y - 20  , line?.points[idx]?.z];
        position = "right";
      }else{
        pointToSend = [line?.points[idx]?.x + 20, line?.points[idx]?.y - 40, line?.points[idx]?.z];
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

    if (selectionMode &&!merged) {
      const selected = selectedLines.includes(id)
        ? selectedLines.filter((lineId) => lineId !== id)
        : !merge && !expandRoomPopup? [id] :[...selectedLines, id];
      setSelectedLines(selected);
      if(roomSelectorMode && roomEditingMode && activeRoomIndex >= 0){
        let newRooms = [...roomSelectors];
        newRooms[activeRoomIndex] = { ...newRooms[activeRoomIndex], wallIds: selected };
        dispatch(setRoomSelectors(newRooms));
      }
      if (!selectedLines.includes(id)) {
        dispatch(setShowPopup(true));
        // dispatch(updateLineTypeId(selectedLine.id,selectedLine.typeId || 1))
        dispatch(setTypeId(selectedLine.typeId || 1));
      } else {
        dispatch(setShowPopup(false));
        dispatch(setContextualMenuStatus(false))
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

  const handleInformtion = () => {
    dispatch(setSelectionMode(!selectionMode));
    dispatch(setInformation(!information));
  };

  const toggleDragMode = () => {
    setDragMode(!dragMode);
  };

  const toggleDoorWindowMode = (mode) => {
    setaddOn("door");
    setIsDraggingDoor(true);
    dispatch(setSelectionMode(false));
    setDragMode(false);
    setDoorWindowMode(!doorWindowMode);
  };

  const handlemode = () => {
    setCheck(!check);
    if (check) {
      dispatch(setType("imaginary"));
    } else {
      dispatch(setType("wall"));
    }
  };

  const breakingLine = (point) => {
    const idx = storeLines.findIndex((line) => line.id === selectId);
    const line = storeLines.filter((line) => line.id === selectId);
    if( line[0] && line[0]?.locked){
      toast("Line is locked and cannot be split.", {
        icon: '⚠️',
        style: {
          fontFamily: "'DM Sans', sans-serif",
          color: '#000',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)'
        },
      });
      return;
    }
    if(storeLines[idx].typeId !==1) return;
    if (idx === -1) return; // Line not found
    setBreakPointLocation(point);
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
    const history = [...actionHistory]
    history.push({
      type: 'split',
      originalLine: updatedLine,
      splitLines: [splitNewLine, splitNewLine1],
      newPoint: point, // store the breakpoint location
    });
    setActionHistory(history);
    setRedoStack([]);
  };

  const handleResetRooms = () => {
    const rooms = [];
    dispatch(setRoomSelectors(rooms));
    handleApiCall(userHeight,rooms);
    dispatch(setExpandRoomNamePopup(false));
    dispatch(setRoomDetails(""))
    dispatch(setRoomName(""))
    dispatch(setRoomEditingMode(false))
    dispatch(setActiveRoomButton(""))
    dispatch(setActiveRoomIndex(-1))
    dispatch(setSelectedLinesState([]))
  };

  const handleApiCall = (height = userHeight, rooms = roomSelectors) => {
    const lines = storeLines;
    const distance = Math.sqrt(
      (rightPos.x - leftPos.x) ** 2 + (rightPos.y - leftPos.y) ** 2
    );
    const scaleData = {
      leftPos,
      rightPos,
      distance: distance,
      unitLength: userLength,
      userWidth: userWidth,
      userHeight: height,
      unitType: measured,
    };
    const data = handleDownload(lines, points, rooms, storeBoxes);
    const finalData = {
      floorplan_id: floorplanId,
      draw_data: data,
      scale: scaleData,
    };
    dispatch(updateDrawData(finalData, floorplanId));
  };

  const handleSaveClick = () => {
    if (!roomSelectorMode) {
      handleApiCall();
      if (!selectionMode) {
        toggleSelectionMode();
      }
      dispatch(setRoomSelectorMode(true));
      dispatch(showRoomNamePopup(true));
      dispatch(setShowPopup(false))
      dispatch(setContextualMenuStatus(false))  
      // dispatch(setPerpendicularLine(false));
      // MySwal.fire({
      //   title: "Room Selector Instructions",
      //   html: `
      //     <p style="text-align: left;">
      //       1. <strong>Select all the walls</strong> of a single room.<br><br>
      //       2. Once all walls are selected, <strong>press the "R" key</strong> on your keyboard to assign the room.<br><br>
      //       3. <strong>Repeat this process</strong> for each additional room you wish to assign.
      //     </p>
      //   `,
      //   icon: "info",
      //   confirmButtonText: "Got it!",
      //   customClass: {
      //     title: "swal2-title-custom",
      //     htmlContainer: "swal2-html-custom",
      //     confirmButton: "swal2-confirm-button-custom",
      //   },
      //   width: "600px",
      //   padding: "20px",
      //   backdrop: true,
      // });
    } else {
      toast("Saving, Please Wait ...", {
        icon: '✔️',
        style: {
          fontFamily: "'DM Sans', sans-serif",
          color: '#000',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)'
        },
      })
      handleApiCall();
      setTimeout(() => {
        fetchWrapper.post(`/floorplans/process_draw_data/${floorplanId}`).then((res)=>{
          window.open(`https://sbst-beta.getsuperbolt.com/3d-home/floorplans/${floorplanId}`, '_blank');
        })
      }, 1000);
    }
  };

  const handleReset = () => {
    if (selectionMode) {
      toggleSelectionMode();
    }
    if (lineBreak) {
      setLineBreak(false);
    }
    if (merge) {
      setMerge(false);
    }
  };

  return {
    doorWindowMode,
    newLine,
    doorPoint,
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
    roomSelect,
    roomSelectors,

    snappingPoint,
    showSnapLine,
    lineBreak,
    merge,
    nearPoint, 
    nearVal, 
    setNearVal,
    setNearPoint,
    setMerge,
    setLineBreak,
    setShowSnapLine,
    setSnappingPoint,
    setStop,

    handleClick,
    handleMouseMove,
    handleLineClick,
    setNewLine,
    setdoorPoint,
    handleInformtion,
    deleteLastPoint,
    undo,
    redo,
    setSelectedLines,
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
    toggleSelectionSplitMode,
    handlemode,
    room,
    escape,
    handleDoubleClick,
    setLeftPos,
    setRightPos,
    deleteSelectedLines,
    showRoomNamePopup,
    handleSaveClick,
    handleApiCall,
    handleReset,
    handleMergeClick,
    addRoom,
    isSelecting,
    startPoint,
    endPoint,
    setDraggingPointIndex,
    setIsSelecting,
    setStartPoint,
    setEndPoint,
    handleResetRooms
  };
};
