import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

extend({ OrbitControls });

const SNAP_THRESHOLD = 30; // Adjust this value to increase/decrease the snap sensitivity

const TexturedPlane = ({ texture }) => {
    return (
        <>
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[12, 8]} />
                <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
            <gridHelper args={[window.innerHeight, window.innerWidth, 'white', 'gray']} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </>
    );
};

const DrawCanvas = ({ handleCanvasClick, lines, backgroundImage, points, currentLine, activeSnap,rectangleDrawing }) => {
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
    }, [lines, backgroundImage, points, currentLine, activeSnap, hoveredPointIndex, hoveredLineIndex]);

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

        setHoveredPointIndex(hoveredPoint);
        setHoveredLineIndex(hoveredLine);
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

const Wall3D = ({ start, end }) => {
    const width = Math.abs(end[0] - start[0]);
    const height = Math.abs(end[1] - start[1]);
    const depth = 1; // Set depth to represent walls

    const position = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        depth / 2
    ];

    return (
        <mesh position={position}>
            <boxGeometry args={[width, height, depth]} />
            <meshBasicMaterial color="#eb3434" />
        </mesh>
    );
};

const AxesHelper = () => {
    const { scene } = useThree();

    useEffect(() => {
        const axesHelper = new THREE.AxesHelper(window.innerHeight); // Length of the axes
        const redMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 10 });
        const greenMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 10 });
        const blueMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 10 });

        if (axesHelper.children.length >= 3) {
            axesHelper.children[0].material = redMaterial; // X-axis material
            axesHelper.children[1].material = greenMaterial; // Y-axis material
            axesHelper.children[2].material = blueMaterial; // Z-axis material
        } else {
            console.warn('AxesHelper does not have the expected number of children.');
        }

        scene.add(axesHelper);

        return () => {
            scene.remove(axesHelper);
        };
    }, [scene]);

    return null;
};

const CameraControls = () => {
    const { camera, gl } = useThree();
    const controls = useRef();

    useFrame(() => {
        controls.current.update();
    });

    useEffect(() => {
        camera.position.set(0, -10, 10); // Adjust the camera position
        camera.lookAt(0, 0, 0); // Ensure the camera looks at the origin
    }, [camera]);

    return (
        <orbitControls
            ref={controls}
            args={[camera, gl.domElement]}
            enableDamping
            dampingFactor={0.2}
            rotateSpeed={0.5}
        />
    );
};

const App = () => {
    const [lines, setLines] = useState([]);
    const [points, setPoints] = useState([]);
    const [escapePoints, setEscapePoints] = useState([]);
    const [walls3D, setWalls3D] = useState([]);
    const [is3D, setIs3D] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState('./img.jpg');
    const [texture, setTexture] = useState(null);
    const [currentLine, setCurrentLine] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [freedome, setFreedome] = useState(false);
    const [newLines, setNewLines] = useState(false);
    const [activeSnap, setActiveSnap] = useState(true);
    const [rectangleDrawing, setRectangleDrawing] = useState(false); // New state for rectangle drawing mode
    const [helper,setHelper] = useState(false);
    const [rectPoints, setRectPoints] = useState([]);

    useEffect(() => {
        const loadTexture = async () => {
            const loadedTexture = await new THREE.TextureLoader().load(backgroundImage);
            setTexture(loadedTexture);
        };
        loadTexture();
    }, [backgroundImage]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'x') {
                if (points.length > 0) {
                    const updatedPoints = [...points];
                    const updatedLines = [...lines];
                    if(escapePoints.some((point)=>point.x===updatedPoints[updatedPoints.length-1].x && point.y===updatedPoints[updatedPoints.length-1].y)) {
                      updatedPoints.pop();
                      setPoints(updatedPoints);
                    }else{
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
            } else if (event.key === 'a') { //handle freedom in draw line 
                setFreedome(!freedome);
            } else if (event.key === 'Escape') {
                setNewLines(true);
            } else if (event.key === 's') { //activating and deactivating
                setActiveSnap(!activeSnap);
            } else if (event.key === 'r') { //activate rectangle drawing mode
              setRectangleDrawing(true);
          }
        };

        const handleKeyUp = (event) => {
            if (event.key === 'Escape') {
                setNewLines(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [points, lines]);//

    const findNearestPoint = (x, y) => {
        let nearestPoint = null;
        let minDistance = SNAP_THRESHOLD;

        points.forEach(point => {
            const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = point;
            }
        });

        return nearestPoint;
    };

    const findNearestLine = (x, y) => {
        let nearestLine = null;
        let minDistance = SNAP_THRESHOLD;

        lines.forEach((line, index) => {
            const [startX, startY, endX, endY] = [line.startX, line.startY, line.endX, line.endY];
            const distance = Math.abs((endY - startY) * x - (endX - startX) * y + endX * startY - endY * startX) / Math.sqrt((endY - startY) ** 2 + (endX - startX) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                nearestLine = index;
            }
        });

        return nearestLine;
    };

    const handleCanvasClick = (x, y) => {
        if (!isDrawing) return;
        let newPoint;
        console.log('hii:',{x,y});

        if (activeSnap) {
            const nearestPoint = findNearestPoint(x, y);
            newPoint = nearestPoint ? { x: nearestPoint.x, y: nearestPoint.y } : { x, y };
        } else {
            newPoint = { x, y };
        }
        if(newLines){//set point where o click escape button
          setEscapePoints([...escapePoints, { x, y }]);

        }

        if (points.length > 0 && (!helper)) {
            const lastPoint = points[points.length - 1];
            let newLine;

            if (freedome) {
                newLine = { startX: lastPoint.x, startY: lastPoint.y, endX: newPoint.x, endY: newPoint.y };
            } else if (newLines) {
                setCurrentLine({ startX: newPoint.x, startY: newPoint.y, endX: newPoint.x, endY: newPoint.y });
            } else {
                if(!helper){
                  const nearestLineIndex = findNearestLine(x, y);
                  if (nearestLineIndex !== null) {
                      const nearestLine = lines[nearestLineIndex];
                      const { startX, startY, endX, endY } = nearestLine;
                      const slope = (endY - startY) / (endX - startX);
                      const intercept = startY - slope * startX;
                      const snappedY = slope * x + intercept;
                      newPoint.y = snappedY;
                  }
  
                  if (Math.abs(lastPoint.x - newPoint.x) > Math.abs(lastPoint.y - newPoint.y)) {
                      // Horizontal line
                      newLine = { startX: lastPoint.x, startY: lastPoint.y, endX: newPoint.x, endY: lastPoint.y };
                      newPoint.y = lastPoint.y;
                  } else {
                      // Vertical line
                      newLine = { startX: lastPoint.x, startY: lastPoint.y, endX: lastPoint.x, endY: newPoint.y };
                      newPoint.x = lastPoint.x;
                  }
                }
            }

            if (!newLines) {
                setLines([...lines, newLine]);
            }
        } else {
            setCurrentLine({ startX: newPoint.x, startY: newPoint.y, endX: newPoint.x, endY: newPoint.y });
        }
        if (rectangleDrawing) { // Check if rectangle drawing mode is active
          if (rectPoints.length % 2 === 1) { // Check if it's the second point
              const startPoint = rectPoints[0];
              console.log(startPoint.x, startPoint.y);//check
              const newLine1 = { startX: startPoint.x, startY: startPoint.y, endX: x, endY: startPoint.y };
              const newLine2 = { startX: x, startY: startPoint.y, endX: x, endY: y };
              const newLine3 = { startX: x, startY: y, endX: startPoint.x, endY: y };
              const newLine4 = { startX: startPoint.x, startY: y, endX: startPoint.x, endY: startPoint.y };

              const point3={x,y};
              const point2={x: startPoint.x, y: y};
              const point4={x: x, y: startPoint.y};


                setLines([...lines, newLine1, newLine2, newLine3, newLine4]);
                setPoints([...points,point2,point3,point4]);
                rectPoints.pop();
                console.log("hii i am here");
                console.log(rectPoints);
                setCurrentLine(null);
                setRectangleDrawing(false); // Deactivate rectangle drawing mode after drawing
            } else if(rectPoints.length %2 === 0) {
                console.log('Rectangle point :',{x,y});
                setRectPoints([...points,newPoint]);
                setPoints([...points, newPoint]);
            }
        } else {
            setPoints([...points, newPoint]);
        }

        //setPoints([...points, newPoint]);
    };

    const handleToggleMode = () => {
        setIs3D((prevMode) => !prevMode);
    };


    const convertLinesTo3D = () => {
        const scaleFactor = 0.02; // Scale down the size of the lines
        const canvasHeight = 400; // Height of the canvas, should be consistent with the canvas height
        const walls3DConverted = lines.map((line) => {
            // Flip the y-coordinates correctly
            const start = [(line.startX - 300) * scaleFactor, -(line.startY - canvasHeight / 2) * scaleFactor, 0];
            const end = [(line.endX - 300) * scaleFactor, -(line.endY - canvasHeight / 2) * scaleFactor, 0];
            return { start, end };
        });
        setWalls3D(walls3DConverted);
        setIs3D(true);
    };

    const startDrawing = () => {
        setIsDrawing(true);
    };
    const handleRectangle = () => {
      setIsDrawing(true);
      setRectangleDrawing(true);
      setHelper(true);
    

    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
            {!is3D && (
                <DrawCanvas
                    handleCanvasClick={handleCanvasClick}
                    lines={lines}
                    backgroundImage={backgroundImage}
                    points={points}
                    currentLine={currentLine}
                    activeSnap={activeSnap}
                    rectangleDrawing={rectangleDrawing}
                />
            )}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 2 }}>
                {!is3D ? (
                    <>
                        <button onClick={startDrawing}>Start Drawing</button>
                        <button onClick={stopDrawing}>Stop Drawing</button>
                        <button onClick={handleRectangle}>Rectangle</button> 
                        <button onClick={convertLinesTo3D}>Convert to 3D</button>
                    </>
                ) : (
                    <button onClick={handleToggleMode}>{is3D ? '2D Mode' : '3D Mode'}</button>
                )}
            </div>
            {is3D && (
                <Canvas style={{ width: '100vw', height: '100vh', position: 'absolute', zIndex: 0 }} >
                    <ambientLight intensity={1} />
                    {texture && <TexturedPlane texture={texture} />}
                    <AxesHelper />
                    <CameraControls />
                    {walls3D.map((wall, index) => (
                        <Wall3D key={index} start={wall.start} end={wall.end} />
                    ))}
                </Canvas>
            )}
        </div>
    );
};

export default App;