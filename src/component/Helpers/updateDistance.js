import React, {useEffect, useMemo} from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Vector3, Shape, ShapeGeometry, MeshBasicMaterial,TextureLoader } from "three";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@react-three/drei"; 
import convert from "convert-units";
import { setStoreBoxes } from "../../Actions/ApplicationStateAction";

const UpdateDistance = ({nearVal})=>{
    const { measured, roomSelect,newline } = useSelector((state) => state.drawing);
    const { storeLines, factor, storeBoxes} = useSelector((state) => state.ApplicationState);

    let p1 = nearVal.line.points[0];
    let p2 = nearVal.point;
    let p3 = nearVal.line.points[1];
    const length1 = p1.distanceTo(p2);
    const length2 = p3.distanceTo(p2);
    const width = convert(nearVal.line.width * factor[1]).from("mm").to(measured);
    
    
 

  const midpoint1 = new Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const midpoint2 = new Vector3().addVectors(p3, p2).multiplyScalar(0.5);
  //console.log("middlepoint", midpoint);

  // Determine the rotation angle for the box
  const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const angle2 = Math.atan2(p2.y - p3.y, p2.x - p3.x);

  // Calculate the offset to shift the midpoint by half the width
  const offset1 = new Vector3(-Math.sin(angle1) * width / 2, Math.cos(angle1) * width / 2, 0);
  const offset2 = new Vector3(-Math.sin(angle2) * width / 2, Math.cos(angle2) * width / 2, 0);
  const adjustedMidpoint1 = midpoint1.add(offset1);
  const adjustedMidpoint2 = midpoint2.add(offset2);


  const textPosition1 = new Vector3(
    midpoint1.x - 20 * Math.sin(angle1),
    midpoint1.y + 20 * Math.cos(angle1),
    0.1 // Ensure it's above the box geometry
  );
  
  // Calculate the rotation angle for the text based on the line angle
  const textRotation1 = angle1;
  const textPosition2 = new Vector3(
    midpoint2.x - 20 * Math.sin(angle2),
    midpoint2.y + 20 * Math.cos(angle2),
    0.1 // Ensure it's above the box geometry
  );
  
  // Calculate the rotation angle for the text based on the line angle
  const textRotation2 = angle2;
  return(
    <>
    <Text
        position={textPosition1}
        rotation={[0, 0, textRotation1]}
        fontSize={12}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {`${(length1*factor[0]).toFixed(2)} ${measured}`}
      </Text>
      <Text
      position={textPosition2}
      rotation={[0, 0, textRotation2]}
      fontSize={12}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {`${(length2*factor[0]).toFixed(2)} ${measured}`}
    </Text>
    </>
  )





};
export default UpdateDistance;