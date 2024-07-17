// BoxGeometry.js
import React from "react";
import { Vector3 } from "three";
import convert from "convert-units";
import { useSelector } from "react-redux";

const BoxGeometry = ({
  start,
  end,
  dimension,
  widthchange,
  widthchangetype,
  isSelected,
  typeId,
  isChoose,
  onClick,
  //handlePointClick,
  currentPoint,
  newPointMode,
  opacity = 0.5,
}) => {
  const { measured,factor,roomSelect } = useSelector((state) => state.drawing);
  
  if (!start || !end) return null;

  const length = start.distanceTo(end);
  const width = convert(dimension.width*factor[1]).from("mm").to(measured)
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  if(end.y === start.y){
    if (widthchangetype === 'inside') {
      // Adjust the width to inside (keeping the horizontal level unchanged)
      midpoint.y += widthchange ;
    } else if (widthchangetype === 'outside') {
      // Adjust the width to outside (keeping the horizontal level unchanged)
      midpoint.y -= widthchange ;
     
    }
  }
  else{
    if (widthchangetype === 'inside') {
      // Adjust the width to inside (keeping the vertical level unchanged)
      midpoint.x -= widthchange ;
     
    } else if (widthchangetype === 'outside') {
      // Adjust the width to outside (keeping the vertical level unchanged)

      midpoint.x += widthchange ;
      
    }
  }

  // Determine the rotation angle for the box
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  return (
    <>
      <mesh position={midpoint} rotation={[0, 0, angle]} onClick={onClick}>
        <boxGeometry
          args={[length, width, 0]}
        />
        <meshBasicMaterial
          color={typeId===1?"grey": typeId === 2 ? "#EE918E" : typeId===3?"#BEE7FE":typeId===4?"#6360FB":(isSelected && roomSelect) ? "blue" : (isSelected && !roomSelect) ?'green': isChoose ? "pink" : "#787878"}

          transparent={true}
          //opacity={opacity}
        />
      </mesh>
      <mesh
        position={start}
       // onClick={(e) => {
          //e.stopPropagation();
          //handlePointClick(start);
        //}}
      >
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial
          color={typeId === 2 ? "brown" : newPointMode && start.equals(currentPoint) ? "yellow" : "black"}
          transparent={true}
          opacity={opacity}
        />
      </mesh>
      <mesh
        position={end}
        //onClick={(e) => {
          //e.stopPropagation();
          //handlePointClick(end);
        //}}
      >
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={typeId === 2 ? "brown" : newPointMode && end.equals(currentPoint) ? "yellow" : "black"}
          transparent={true}
          opacity={opacity}
        />
      </mesh>
    </>
  );
};

export default BoxGeometry;