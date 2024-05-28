import React, { useRef, useState, useEffect, useCallback } from 'react';

import { SNAP_THRESHOLD } from '../Constant/SnapThreshold';


const DrawCanvas = ({ handleCanvasClick, lines, backgroundImage, points, currentLine, activeSnap, rectangleDrawing, rectPoints }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
    const [hoveredLineIndex, setHoveredLineIndex] = useState(null);

    const prepareCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            context.lineCap = 'square';
            context.strokeStyle = 'black';
            context.lineWidth = 5;
            context.setLineDash([1, 1]);
            contextRef.current = context;

            const image = new Image();
            image.src = backgroundImage;
            image.onload = () => {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
        }
    }, [backgroundImage]);

    useEffect(() => {
        prepareCanvas();
    }, [prepareCanvas]);

    useEffect(() => {
        const context = contextRef.current;
        if (context) {
            const image = new Image();
            image.src = backgroundImage;
            image.onload = () => {
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);

                lines.forEach((line, index) => {
                    context.beginPath();
                    context.moveTo(line.startX, line.startY);
                    context.lineTo(line.endX, line.endY);
                    if (activeSnap && hoveredLineIndex === index) {
                        context.strokeStyle = 'blue'; // Highlight the line if it's hovered
                    } else {
                        context.strokeStyle = 'black';
                    }
                    context.stroke();
                });

                points.forEach((point, index) => {
                    context.beginPath();
                    context.arc(point.x, point.y, 5, 0, 2 * Math.PI);

                    // Change point color if within snap threshold and snap is active
                    if (activeSnap && hoveredPointIndex === index) {
                        context.fillStyle = 'blue';
                    } else {
                        context.fillStyle = 'red';
                    }
                    context.fill();
                });

                if (currentLine) {
                    context.beginPath();
                    context.moveTo(currentLine.startX, currentLine.startY);
                    context.lineTo(currentLine.endX, currentLine.endY);
                    context.stroke();
                }
            };
        }
    }, [lines, backgroundImage, points, currentLine, activeSnap, hoveredPointIndex, hoveredLineIndex, rectangleDrawing, rectPoints]);

    const handleMouseDown = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        if (activeSnap && hoveredLineIndex !== null) {
            const line = lines[hoveredLineIndex];
            const { startX, startY, endX, endY } = line;
            const slope = (endY - startY) / (endX - startX);
            const intercept = startY - slope * startX;
            const snappedY = slope * offsetX + intercept;
            handleCanvasClick(offsetX, snappedY);
        } else {
            handleCanvasClick(offsetX, offsetY);
        }
    };

    const handleMouseMove = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        let hoveredPoint = null;
        let hoveredLine = null;

        // Find the index of the nearest point within the snap threshold
        points.forEach((point, index) => {
            const distance = Math.sqrt((point.x - offsetX) ** 2 + (point.y - offsetY) ** 2);
            if (distance < SNAP_THRESHOLD) {
                hoveredPoint = index;
            }
        });

        // Find the index of the nearest line within the snap threshold
        lines.forEach((line, index) => {
            const [startX, startY, endX, endY] = [line.startX, line.startY, line.endX, line.endY];
            const distance = Math.abs((endY - startY) * offsetX - (endX - startX) * offsetY + endX * startY - endY * startX) / Math.sqrt((endY - startY) ** 2 + (endX - startX) ** 2);
            if (distance < SNAP_THRESHOLD) {
                hoveredLine = index;
            }
        });

        if (!rectangleDrawing) {
            setHoveredPointIndex(hoveredPoint);
            setHoveredLineIndex(hoveredLine);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            width={600}
            height={400}
            style={{ border: '1px solid black', position: 'absolute', zIndex: 1 }}
            id="draw-canvas"
        />
    );
};

export default DrawCanvas;
