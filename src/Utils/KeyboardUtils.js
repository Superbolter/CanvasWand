import { BREADTH_STEP } from "../Constant/SnapThreshold";
import { isPointConnected } from "./IsPointConnected";

export const handleKeyDown = (
  event,
  {
    dispatch,
    points,
    lines,
    setPoints,
    setLines,
    setCurrentLine,
    setFreedome,
    setNewLines,
    setActiveSnap,
    setRectangleDrawing,
    freedome,
    activeSnap,
    keyPressed,
    setKeyPressed,
    selectedLineIndex,
    setSelectedLineIndex,
    factor,
  }
) => {
  if (event.key === "x") {
    if (keyPressed) {
      const updatedPoints = [...points];
      const updatedLines = [...lines];

      // Remove selected lines from updatedLines
      const remainingLines = updatedLines.filter(
        (_, index) => !selectedLineIndex.includes(index)
      );

      // Identify points to be removed
      const pointsToRemove = updatedPoints.filter(
        (point) => !isPointConnected(point, remainingLines)
      );

      // Remove points that are no longer connected to any lines
      const finalPoints = updatedPoints.filter(
        (point) =>
          !pointsToRemove.some((pt) => pt.x === point.x && pt.y === point.y)
      );

      dispatch(setLines(remainingLines));
      dispatch(setPoints(finalPoints));
      setCurrentLine(null);
      dispatch(setSelectedLineIndex([]));
    } else {
      if (points.length > 0) {
        const updatedPoints = [...points];
        const updatedLines = [...lines];
        let point = updatedPoints[updatedPoints.length - 1];
        if (!isPointConnected(point, updatedLines)) {
          updatedPoints.pop();
          dispatch(setPoints(updatedPoints));
        } else {
          updatedPoints.pop(); // Remove the last point
          updatedLines.pop(); // Remove the last line
          dispatch(setPoints(updatedPoints));
          dispatch(setLines(updatedLines));
        }
        if (updatedPoints.length > 1) {
          const lastPoint = updatedPoints[updatedPoints.length - 1];
          setCurrentLine({
            startX: lastPoint.x,
            startY: lastPoint.y,
            endX: lastPoint.x,
            endY: lastPoint.y,
          });
        } else {
          setCurrentLine(null);
        }
      }
    }
  } else if (event.key === "q") {
    dispatch(setKeyPressed(!keyPressed));
  } else if (event.key === "a") {
    dispatch(setFreedome(!freedome));
  } else if (event.key === "Escape") {
    dispatch(setNewLines(true));
  } else if (event.key === "s") {
    dispatch(setActiveSnap(!activeSnap));
  } else if (event.key === "r") {
    dispatch(setRectangleDrawing(true));
  } else if (event.key === "+" && keyPressed) {
    console.log("Hii +event");
    console.log(selectedLineIndex);

    if (selectedLineIndex.length > 0) {
      const factorStep = BREADTH_STEP * factor[0];
      const selectedIndexSet = new Set(selectedLineIndex);

      const updatedLines = lines.map((line, index) => {
        if (selectedIndexSet.has(index)) {
          return { ...line, breadth: Math.min(9, line.breadth + factorStep) };
        }
        return line;
      });

      dispatch(setLines(updatedLines));
      // setSelectedLineIndex([]);
    }
  } else if (event.key === "-" && keyPressed) {
    console.log("Hii +event");
    console.log(selectedLineIndex);
    if (selectedLineIndex.length > 0) {
      const updatedLines = lines.map((line, index) => {
        if (selectedLineIndex.includes(index)) {
          return {
            ...line,
            breadth: Math.max(4, line.breadth - BREADTH_STEP * factor[0]),
          };
        }
        return line;
      });

      dispatch(setLines(updatedLines));
      // setSelectedLineIndex([]);
    }
  }
};

export const handleKeyUp = (event, { dispatch, setNewLines }) => {
  if (event.key === "Escape") {
    dispatch(setNewLines(false));
  }
};
