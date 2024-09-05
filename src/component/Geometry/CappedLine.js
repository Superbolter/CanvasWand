import React, { useMemo } from 'react';
import * as THREE from 'three';
import Window from "../../assets/Window.png";
import Door from "../../assets/Door.png";
import Railing from "../../assets/Railing.png";
import Wall from "../../assets/Walll.png";

function CappedLine({ lines }) {
    const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const windowTexture = useMemo(
    () => textureLoader.load(Window), // Replace with the path to your window image
    [textureLoader]
  );
  const wallTexture = useMemo(
    () => textureLoader.load(Wall), // Replace with the path to your window image
    [textureLoader]
  );
  const railingTexture = useMemo(
    () => textureLoader.load(Railing), // Replace with the path to your window image
    [textureLoader]
  );
  const doorTexture = useMemo(
    () => textureLoader.load(Door), // Replace with the path to your window image
    [textureLoader]
  );


    const quadrilateralShape = new THREE.Shape();
    quadrilateralShape.moveTo(-8, -8);
    quadrilateralShape.lineTo(8, -8);
    quadrilateralShape.lineTo(8, 8);
    quadrilateralShape.lineTo(-8, 8);
    quadrilateralShape.lineTo(-8, -8);
  
    const capGeometry = new THREE.ShapeGeometry(quadrilateralShape);
    const capMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

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
  
    return (
      <>
        {lines.map((line, index) => {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(line.points);
          return (
            <React.Fragment key={index}>
              <line
                geometry={lineGeometry}
                material={new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })}
              />
              {line.points.map((point, idx) => {
              const occurrences = countPointOccurrences(point, lines);
              if (occurrences === 1) { return ; }
              return (
                <mesh
                  key={`${index}-${idx}`}
                  position={[point.x, point.y, point.z]}
                  geometry={capGeometry}
                >
                  <meshBasicMaterial map={wallTexture} transparent={true} opacity={0.9} />
                </mesh>
              );
            })}
            </React.Fragment>
          );
        })}
      </>
    );
  }

export default CappedLine;