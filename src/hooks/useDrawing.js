import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import convert from "convert-units";
import { Vector3 } from "three";
import {

 
  setPerpendicularLine,
 
  setInformation,
  setRoomSelect,setRoomSelectors,
  setType,
  
} from "../features/drawing/drwingSlice.js";
import {
  uniqueId,
  calculateAlignedPoint,
  replaceValue,
} from "../utils/uniqueId";
import { snapToPoint } from "../utils/snapping.js";
import { getLineIntersection } from "../utils/intersect.js";
import { INITIAL_BREADTH, INITIAL_HEIGHT } from "../constant/constant.js";
import { setContextualMenuStatus, setLineId } from "../Actions/DrawingActions.js";
import { setStoreLines, setFactor,setPoints } from "../Actions/ApplicationStateAction.js";
export const useDrawing = () => {
  const dispatch = useDispatch();
  const {
  
    
    idSelection,
    perpendicularLine,
   
    measured,
    information,roomSelect,roomSelectors,
  } = useSelector((state) => state.drawing);
  const {typeId, contextualMenuStatus}=useSelector((state)=>state.Drawing)
  const {storeLines,points,factor}=useSelector((state)=>state.ApplicationState)
  const [selectionMode, setSelectionMode] = useState(true);
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
  const [redoLines, setRedoLines] = useState([]);   // Holds the lines that have been undone and can be redone
  const [redoPoints, setRedoPoints] = useState([]); // Holds the points that have been undone and can be redone
  const [isDraggingDoor, setIsDraggingDoor] = useState(false);
  const [doorPosition, setDoorPosition] = useState([]);
  const [dimensions, setDimensions] = useState({ l: 50, w: 10, h: 50 });
  const [check,setCheck]= useState(true);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [doorPoint, setdoorPoint] = useState([]);



const [snappingPoint, setSnappingPoint] = useState([]);
const [showSnapLine, setShowSnapLine] = useState(false);


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
        typeId:1,
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
        typeId:1,
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
        typeId:2,
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
      typeId:typeId,
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

    console.log("intersect: " ,intersections);
    if(storeLines.length){

      
    }
    // Sort intersections based on their distance from startPoint along the new line
    intersections.sort(
      (a, b) =>
        startPoint.distanceTo(a.intersection) -
        startPoint.distanceTo(b.intersection)
    );

    console.log("intersections: " ,intersections);

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
    console.log(storeLines)
  
  };

  const deleteLastPoint = () => {
    // Check if there are any lines or points to undo
    if (storeLines.length === 0 || points.length === 0) return;
  
    // Remove the last line and update the storeLines state
    const updatedLines = storeLines.slice(0, -1);
  
    // Remove the last point and update the points state
    let updatedPoints = points.slice(0, -1);
    const lastPoint = points[points.length - 1];
  
    // Check if the last point is a breakpoint
    const hasBreakPoint = breakPoint.includes(lastPoint);
    if (hasBreakPoint) {
      updatedPoints = updatedPoints.slice(0, -1);
    }
    
    // Ensure that the updatedPoints array does not end with a single point
    if (updatedPoints.length === 1) {
      updatedPoints = updatedPoints.slice(0, -1);
    }
  
    // Store the undone line and point in the redo stacks
    const redoLine = storeLines[storeLines.length - 1];
    const redoPoint = points[points.length - 1];
  
    setRedoLines((prevRedoLines) => [...prevRedoLines, redoLine]);
    setRedoPoints((prevRedoPoints) => [...prevRedoPoints, redoPoint]);
  
    // Update the state with the new lines and points
    dispatch(setStoreLines(updatedLines));
    dispatch(setPoints(updatedPoints));
  };
  const redo = () => {
    // Check if there are any lines or points to redo
    if (redoLines.length === 0 || redoPoints.length === 0) return;
  
    // Get the last undone line and point
    const lastRedoLine = redoLines[redoLines.length - 1];
    const lastRedoPoint = redoPoints[redoPoints.length - 1];
  
    // Remove these elements from the redo stacks
    const updatedRedoLines = redoLines.slice(0, -1);
    const updatedRedoPoints = redoPoints.slice(0, -1);
  
    // Update the redo stacks with the new values
    setRedoLines(updatedRedoLines);
    setRedoPoints(updatedRedoPoints);
  
    const updatedStoreLines = storeLines;
  const updatedPoints = points;

  updatedStoreLines.push(lastRedoLine);
  updatedPoints.push(lastRedoPoint);

  // Set the updated state
  setStoreLines(updatedStoreLines);
  setPoints(updatedPoints);
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
    if(event.key === "r" || event.key === "R"){
      room();

    }
    if (selectionMode && (event.key === "Delete" || event.keyCode === 46)) {
      deleteSelectedLines();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    console.log(storeLines);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storeLines, selectionMode, selectedLines, points, stop]);

  const handleClick = (event) => {
    if ( dragMode || doorWindowMode) return; // Prevent drawing new lines in selection mode
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
      dispatch(setContextualMenuStatus(true))
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


    if(showSnapLine){
      addPoint(snappingPoint[0],newPoints[newPoints.length - 2]);
    }


    if (newPoints.length >= 2) {
      dispatch(setContextualMenuStatus(true))
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
      console.log([lfactor, wfactor, hfactor]);
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
        typeId:1,
      };
      dispatch(setStoreLines([newLine]));
    }
    setCurrentMousePosition(null); // Clear the temporary line on click
    setDistance(0); // Reset distance display
  };

  const handleMouseMove = (event) => {
    if ((points.length === 0 || stop || newLine || doorWindowMode) && !dragMode) return; // No point to start from or not in perpendicular mode
  
    const canvasContainer = document.querySelector(".canvas-container");
    const rect = canvasContainer.getBoundingClientRect();
  
    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
    const cameraWidth = rect.width;
    const cameraHeight = rect.height;
  
    const posX = x * (cameraWidth / 2);
    const posY = y * (cameraHeight / 2);
  
    let point = new Vector3(posX, posY, 0);
    if (perpendicularLine && points.length > 0 && draggingPointIndex === null) {
      point = calculateAlignedPoint(points[points.length - 1], point);
    }
    
    setCurrentMousePosition(point);
    let cuuPoint = point;
    
    
    // Check for snapping
    let snapFound = false;
    for (let i = 0; i < points.length; i++) {
      if (Math.abs(points[i].x - point.x) < 10 && (points[points.length - 1].y !== points[i].y && points[points.length - 1].x !== points[i].x)) {
        cuuPoint.x = points[i].x;
        let newarr = [cuuPoint, points[i]];
        setSnappingPoint([...newarr]);
        snapFound = true;
        break;
      } else if (Math.abs(points[i].y - point.y) < 10 && (points[points.length - 1].y !== points[i].y && points[points.length - 1].x !== points[i].x)) {
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
  
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      const currentDistance = lastPoint.distanceTo(point);
      setDistance(currentDistance * factor[0]);
    }
  
    if (draggingPointIndex !== null) {
      if (draggingPointIndex >= 0 && draggingPointIndex < points.length) {
        let beforeUpdation = points[draggingPointIndex];
        let prevPoint = points[draggingPointIndex - 1];
        let nextPoint = points[draggingPointIndex + 1];
  
        if (perpendicularLine) {
          if (prevPoint && nextPoint) {
            if (point.x !== prevPoint.x && point.y !== prevPoint.y && point.x !== nextPoint.x && point.y !== nextPoint.y) {
              const dx = nextPoint.x - prevPoint.x;
              const dy = nextPoint.y - prevPoint.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const dirX = dx / length;
              const dirY = dy / length;
              const px = point.x - prevPoint.x;
              const py = point.y - prevPoint.y;
              const dotProduct = px * dirX + py * dirY;
              point.x = prevPoint.x + dotProduct * dirX;
              point.y = prevPoint.y + dotProduct * dirY;
            } else {
              if (Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)) {
                point.y = prevPoint.y;
              } else {
                point.x = prevPoint.x;
              }
            }
          } else if (prevPoint) {
            if (Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y)) {
              point.y = prevPoint.y;
            } else {
              point.x = prevPoint.x;
            }
          } else if (nextPoint) {
            if (Math.abs(point.x - nextPoint.x) > Math.abs(point.y - nextPoint.y)) {
              point.y = nextPoint.y;
            } else {
              point.x = nextPoint.x;
            }
          }
        }
  
        let updatedPoints = [...points];
        const updated = replaceValue(updatedPoints, beforeUpdation, point);
        dispatch(setPoints(updated));
  
        const updatedLines = storeLines.map((line) => {
          let updatedLine = { ...line };
          if (updatedLine.points[0].equals(beforeUpdation)) {
            updatedLine = {
              ...updatedLine,
              points: [point, updatedLine.points[1]],
              length: convert(point.distanceTo(updatedLine.points[1]) * factor[0]).from(measured).to("mm"),
            };
          }
  
          if (updatedLine.points[1].equals(beforeUpdation)) {
            updatedLine = {
              ...updatedLine,
              points: [updatedLine.points[0], point],
              length: convert(updatedLine.points[0].distanceTo(point) * factor[0]).from(measured).to("mm"),
            };
          }
          return updatedLine;
        });
  
        dispatch(setStoreLines(updatedLines));
      }
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











  const room =()=>{
    const roomName = prompt("Enter the room Name:");
    
    const room = {
      roomId: uniqueId(),
      roomName: roomName,
      wallIds: [...selectedLines],
    }


    dispatch(setRoomSelectors([...roomSelectors,room]));
    setSelectedLines([]);
    dispatch(setRoomSelect(false));

  }


  const toggleSelectionroomMood= () => {
    setSelectionMode(!selectionMode);
    dispatch(setRoomSelect(true));
    setSelectedLines([]);
  };










  

  const handleLineClick = (id) => {
    


    if(selectionMode && roomSelect){


      
      setSelectedLines((prev) =>
        prev.includes(id)
          ? prev.filter((lineId) => lineId !== id)
          : [...prev, id]);


    }
    else if (selectionMode) {
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



  const handlemode=() => {
    setCheck(!check);
    if(check){
      dispatch(setType("imaginary"));
    }else{
      dispatch(setType("wall"));
    }
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
    setShowSnapLine,
    setSnappingPoint,

    handleClick,
    handleMouseMove,
    handleLineClick,
    setNewLine,
    setdoorPoint,
    handleInformtion,
    deleteLastPoint,
    redo,
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
    toggleSelectionroomMood,
    handlemode,
    
  };
};
