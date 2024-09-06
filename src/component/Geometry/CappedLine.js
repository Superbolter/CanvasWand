import React, { useMemo } from 'react';
import * as THREE from 'three';
import Window from "../../assets/Window.png";
import Door from "../../assets/Door.png";
import Railing from "../../assets/Railing.png";
import Wall from "../../assets/Walll.png";
import { useSelector } from 'react-redux';

function CappedLine({ lines }) {
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const windowTexture = useMemo(() => textureLoader.load(Window), [textureLoader]);
  const wallTexture = useMemo(() => textureLoader.load(Wall), [textureLoader]);
  const railingTexture = useMemo(() => textureLoader.load(Railing), [textureLoader]);
  const doorTexture = useMemo(() => textureLoader.load(Door), [textureLoader]);

  const {linePlacementMode } = useSelector(
    (state) => state.drawing
  );

  const quadrilateralShape = new THREE.Shape();
  quadrilateralShape.moveTo(-8, -8);
  quadrilateralShape.lineTo(8, -8);
  quadrilateralShape.lineTo(8, 8);
  quadrilateralShape.lineTo(-8, 8);
  quadrilateralShape.lineTo(-8, -8);

  const edgeShape = new THREE.Shape();
  edgeShape.moveTo(-8, -8);
  edgeShape.lineTo(8, -8);  
  edgeShape.lineTo(8, 8);
  edgeShape.lineTo(-8, 8);
  edgeShape.lineTo(-8, -8);
  edgeShape.lineTo(-8, -8);

  const capGeometry = new THREE.ShapeGeometry(quadrilateralShape);

  const countPointOccurrences = (point, allLines) => {
    let count = 0;
    allLines.forEach(line => {
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

  return (
    <>
      {lines.map((line, index) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(line.points);
        return linePlacementMode!=="midpoint"? null : (
          <React.Fragment key={index}>
            <line
              geometry={lineGeometry}
              material={new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })}
            />
            {line.points.map((point, idx) => {
              const occurrences = countPointOccurrences(point, lines);

              // Handle cap for angles
              if (occurrences > 1 && idx < line.points.length - 1) {
                const prevLine = lines[index - 1];
                if (prevLine) {
                  const angle = calculateAngleBetweenLines(
                    { start: prevLine.points[prevLine.points.length - 2], end: prevLine.points[prevLine.points.length - 1] },
                    { start: line.points[idx], end: line.points[idx + 1] }
                  );

                  // Only show the cap if the angle exceeds 15 degrees
                  if (angle > 15) {
                    return (
                      <mesh
                        key={`${index}-${idx}`}
                        position={[point.x, point.y, point.z]}
                        geometry={capGeometry}
                      >
                        <meshBasicMaterial map={wallTexture} transparent={true} opacity={0.9} />
                      </mesh>
                    );
                  }
                }
              }
              return null; // Skip cap if conditions aren't met
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default CappedLine;