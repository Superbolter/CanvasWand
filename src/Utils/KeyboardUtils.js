import{ BREADTH_STEP } from "../Constant/SnapThreshold";
import { isPointConnected } from "./IsPointConnected";

export const handleKeyDown = (event, { points, lines, setPoints, setLines, setCurrentLine, setFreedome, setNewLines, setActiveSnap, setRectangleDrawing, freedome, activeSnap, hoveredLineIndex,keyPressed,setKeyPressed, setHoveredLineIndex,selectedLineIndex,setSelectedLineIndex }) => {
    if (event.key === 'x') {
       if(keyPressed){
        const updatedPoints = [...points];
        const updatedLines = [...lines];

        // Remove selected lines from updatedLines
        const remainingLines = updatedLines.filter((_, index) => !selectedLineIndex.includes(index));

        // Identify points to be removed
        const pointsToRemove = updatedPoints.filter(point => 
            !isPointConnected(point, remainingLines)
        );

        // Remove points that are no longer connected to any lines
        const finalPoints = updatedPoints.filter(point => 
            !pointsToRemove.some(pt => pt.x === point.x && pt.y === point.y)
        );

        setLines(remainingLines);
        setPoints(finalPoints);
        setCurrentLine(null);
        setSelectedLineIndex([]);


       }else{
        if (points.length > 0) {
            const updatedPoints = [...points];
            const updatedLines = [...lines];
            let point = updatedPoints[updatedPoints.length -1]
           if(!isPointConnected(point,updatedLines)){
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
            //setSelectedLineIndex([]);
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
            //setSelectedLineIndex([]);
        }
    }
};

export const handleKeyUp = (event, { setNewLines }) => {
    if (event.key === 'Escape') {
        setNewLines(false);
    }
};
