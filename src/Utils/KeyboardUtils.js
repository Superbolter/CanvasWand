import{ BREADTH_STEP } from "../Constant/SnapThreshold";

export const handleKeyDown = (event, { points, lines, escapePoints, setPoints, setLines, setCurrentLine, setFreedome, setNewLines, setActiveSnap, setRectangleDrawing, freedome, activeSnap, hoveredLineIndex,keyPressed,setKeyPressed, setHoveredLineIndex,selectedLineIndex }) => {
    if (event.key === 'x') {
        if (points.length > 0) {
            const updatedPoints = [...points];
            const updatedLines = [...lines];
            if (escapePoints.some((point) => point.x === updatedPoints[updatedPoints.length - 1].x && point.y === updatedPoints[updatedPoints.length - 1].y)) {
                updatedPoints.pop();
                setPoints(updatedPoints);
            } else {
                updatedPoints.pop(); // Remove the last point
                updatedLines.pop(); // Remove the last line
                setPoints(updatedPoints);
                setLines(updatedLines);
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
    }else if(event.key ==='q'){
        setKeyPressed(!keyPressed);

    } else if (event.key === 'a') {
        setFreedome(!freedome);
    } else if (event.key === 'Escape') {
        setNewLines(true);
    } else if (event.key === 's') {
        setActiveSnap(!activeSnap);
    } else if (event.key === 'r') {
        setRectangleDrawing(true);
    } else if (event.key === '+' && keyPressed) {
        if (selectedLineIndex.length> 0) {
            const updatedLines = lines.map((line, index) => {
                if (selectedLineIndex.includes(index)) {
                    return { ...line, breadth: Math.min(9, line.breadth + BREADTH_STEP) };
                }
                return line;
            });
            setLines(updatedLines);
        }
    } else if (event.key === '-'&& keyPressed) {
        if (selectedLineIndex.length> 0) {
            const updatedLines = lines.map((line, index) => {
                if (selectedLineIndex.includes(index)) {
                    return { ...line, breadth: Math.max(4, line.breadth - BREADTH_STEP) };
                }
                return line;
            });
            setLines(updatedLines);
        }
    }
};

export const handleKeyUp = (event, { setNewLines }) => {
    if (event.key === 'Escape') {
        setNewLines(false);
    }
};
