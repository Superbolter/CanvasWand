import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import useTexture from '../../hooks/useTexture';

function CappedLine({ line, index }) {
  const { wallTexture } = useTexture();

  const { linePlacementMode } = useSelector(
    (state) => state.drawing
  );

  const { storeLines } = useSelector((state) => state.ApplicationState);

  const quadrilateralShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-8, -8);
    shape.lineTo(8, -8);
    shape.lineTo(8, 8);
    shape.lineTo(-8, 8);
    shape.lineTo(-8, -8);
    return shape;
  }, []); 


  const countPointOccurrences = (point) => {
    let count = 0;
    storeLines.forEach(line => {
      line.points.forEach(p => {
        if (p.equals(point)) {
          count++;
        }
      });
    });
    return count;
  };

  const calculateAngleBetweenLines = (line1, line2) => {
    const dir1 = new THREE.Vector3().subVectors(line1.end, line1.start).normalize();
    const dir2 = new THREE.Vector3().subVectors(line2.end, line2.start).normalize();

    const dotProduct = dir1.dot(dir2);
    const angle = Math.acos(dotProduct); // Angle in radians
    return THREE.MathUtils.radToDeg(angle); // Convert to degrees
  };


  const memoisedLine = useMemo(()=>{
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(line.points);
    const capGeometry = new THREE.ShapeGeometry(quadrilateralShape);

    return(
      <React.Fragment key={index}>
      <line
        geometry={lineGeometry}
        material={new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })}
      />
      {line.points.map((point, idx) => {
        const occurrences = countPointOccurrences(point);

        // Handle cap for angles  
        if (occurrences > 1) {
          const prevLine = storeLines[index - 1];
          const nextLine = storeLines[index + 1];

          if (prevLine) {
            if (prevLine.typeId !== 1 || line.typeId === 4 || (nextLine && nextLine?.typeId !== 1)) return null;
            const angle = calculateAngleBetweenLines(
              { start: prevLine.points[0], end: prevLine.points[1] },
              { start: line.points[0], end: line.points[1] }
            );

            // Only show the cap if the angle exceeds 15 degrees
            if (angle > 15) {
              return (
                <mesh
                  key={`${index}-${idx}`}
                  position={[point.x, point.y, - 1]}
                  geometry={capGeometry}
                >
                  <meshBasicMaterial map={wallTexture} transparent={true} opacity={0.7} />
                </mesh>
              );
            }
          }
        }
        return null; // Skip cap if conditions aren't met
      })}
    </React.Fragment>
    )
  },[line.points])

  return linePlacementMode !== "midpoint" ? null : (
    <>
      {memoisedLine}
    </>
  );
}

export default CappedLine;