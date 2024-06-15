import React, { useState, useEffect,useRef } from 'react';
import "./App.css"
import { Canvas } from '@react-three/fiber';
import { Grid, Line } from '@react-three/drei';
import { useDispatch, useSelector } from 'react-redux';
import { setLines,setStoreLines} from './features/drawing/drwingSlice';

export const App = () => {
  const dispatch = useDispatch();
  const { lines,storeLines} = useSelector((state) => state.drawing);


  const calculateLength = (point1, point2) => {
    const [x1, y1, z1] = point1||[0,0,0];
    const [x2, y2, z2] = point2;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
  };

  const addPoint = (lineIndex,newPoint,startPoint) => {
    console.log('hii :',startPoint);
    console.log("hee:",newPoint);
    console.log('hoo:',lineIndex);
    const newId = Date.now();
    const newLine = {
      id:newId,
      lineIndex:lineIndex,
      points:[startPoint,newPoint],
      length:calculateLength(startPoint||[0,0,0],newPoint)

    }
    dispatch(setStoreLines([...storeLines,newLine]));
    
    const updatedLines = lines.map((line, index) =>
      index === lineIndex ? { ...line, points: [...line.points, newPoint] } : line
    );
    dispatch(setLines(updatedLines));
  };

  const movePoint = (lineIndex, pointIndex, newPoint,startPoint) => {
    const updatedLines = lines.map((line, index) =>
      index === lineIndex ? {
        ...line,
        points: line.points.map((point, pIndex) =>
          pIndex === pointIndex ? newPoint : point
        )
      } : line
    );
    dispatch(setLines(updatedLines));
  };

  const deleteLastPoint = () => {
    const updatedLines = lines.map((line, index) => {
      if (index === lines.length - 1 && line.points.length > 1) {
        return { ...line, points: line.points.slice(0, -1) };
      }
      return line;
    });
    dispatch(setLines(updatedLines));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'x' || event.key === 'X') {
        deleteLastPoint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lines]);

  return (
    <div className="container">
      <div className="canvas-container">
        <Canvas
          style={{ height: window.innerHeight, width: '100%' }}
          orthographic
          raycaster={{ params: { Line: { threshold: 5 } } }}
          camera={{ position: [0, 0, 500], zoom: 1 }}
        >
          {lines.map((line, index) => (
            <PolyLine
              key={line.id}
              points={line.points}
              lineIndex={index}
              addPoint={addPoint}
              movePoint={movePoint}
            />
          ))}
          <Grid
            rotation={[Math.PI / 2, 0, 0]}
            cellSize={100}
            cellThickness={2}
            cellColor="red"
            sectionSize={20}
            sectionThickness={1.5}
            sectionColor="lightgray"
            fadeDistance={10000}
            infiniteGrid
          />
        </Canvas>
      </div>
      <div className="button-container">
        <button onClick={deleteLastPoint}>Delete Last Point</button>
        <button>Dummy Button 1</button>
        <button>Dummy Button 2</button>
        <button>Dummy Button 3</button>
      </div>
    </div>
  );
};

function PolyLine({ points, lineIndex, addPoint, movePoint }) {
  return (
    <>
      <Line points={points.flat()} lineWidth={20} color="green" />
      {points.map((point, index) => (
        <EndPoint
          key={index}
          position={point}
          lineIndex={lineIndex}
          pointIndex={index}
          addPoint={(newPoint,startPoint) => addPoint(lineIndex, newPoint,startPoint)}
          movePoint={(newPoint,startPoint) => movePoint(lineIndex, index, newPoint,startPoint)}
        />
      ))}
    </>
  );
}

function EndPoint({ position, lineIndex, pointIndex, addPoint, movePoint }) {
  const [hovered, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position.slice());
  let capturePoint = useRef(null);

  const down = event => {
    event.stopPropagation();
    event.target.setPointerCapture(event.pointerId);
    capturePoint.current = event.unprojectedPoint.toArray() ;
    console.log("Hii i am here ",capturePoint.current);
    setDragging(true);
    
  };

  const up = event => {
    if (dragging) {
      const newPosition = event.unprojectedPoint.toArray();
      const startPoint =capturePoint.current;
      console.log("Hii i am here 2 ",startPoint);
      if (event.button === 2) {
        movePoint(newPosition,startPoint);
      } else {
        addPoint(newPosition,startPoint);
      }
    }
    setDragging(false);
  };

  const move = event => {
    if (dragging) {
      const newPosition = event.unprojectedPoint.toArray();
      setCurrentPosition(newPosition);
    }
  };

  return (
    <mesh
      position={currentPosition}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerDown={down}
      onPointerUp={up}
      onPointerMove={move}
    >
      <sphereGeometry args={[10, 16, 16]} />
      <meshBasicMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
