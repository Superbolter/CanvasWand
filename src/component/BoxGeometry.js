import React, {useEffect, useMemo} from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Vector3, Shape, ShapeGeometry, MeshBasicMaterial,TextureLoader } from "three";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@react-three/drei"; 
import convert from "convert-units";
import CreateFiller from "./filler";
import Window from "../assets/Window.png"
import Door from "../assets/Door.png"
import Railing from "../assets/Railing.png"
import New from "../assets/New.png"
import Wall from "../assets/Walll.png"
import { setStoreBoxes } from "../Actions/ApplicationStateAction";

// Extend the R3F renderer with ShapeGeometry
extend({ ShapeGeometry });




const calculateSlope = (angle) => {
  // Handle vertical lines (angle of π/2 or -π/2)
  if (angle === Math.PI / 2 || angle === -Math.PI / 2) {
    return Infinity;
  }
  return Math.tan(angle);
};

// Function to calculate the y-intercept given a point and slope
const calculateIntercept = (point, slope) => {
  if (slope === Infinity) {
    // For vertical lines, the intercept can be considered the x-coordinate
    return point.x;
  }
  return point.y - slope * point.x;
};

// Function to calculate the intersection point of two lines
const calculateIntersection = (point1, angle1, point2, angle2) => {
  const slope1 = calculateSlope(angle1);
  const intercept1 = calculateIntercept(point1, slope1);

  const slope2 = calculateSlope(angle2);
  const intercept2 = calculateIntercept(point2, slope2);

  // If both lines are vertical and have the same x-coordinate
  if (slope1 === Infinity && slope2 === Infinity && intercept1 === intercept2) {
    return new Vector3(point1.x, point1.y, 0);
  }

  // If both lines are vertical and have different x-coordinates
  if (slope1 === Infinity && slope2 === Infinity) {
    return null;
  }

  // If one line is vertical
  if (slope1 === Infinity) {
    const x = intercept1;
    const y = slope2 * x + intercept2;
    return new Vector3(x, y, 0);
  }

  // If the other line is vertical
  if (slope2 === Infinity) {
    const x = intercept2;
    const y = slope1 * x + intercept1;
    return new Vector3(x, y, 0);
  }

  // If the slopes are the same, the lines are parallel
  if (slope1 === slope2) {
    return null;
  }

  // Calculate the x-coordinate of the intersection
  const x = (intercept2 - intercept1) / (slope1 - slope2);

  // Calculate the y-coordinate of the intersection using one of the line equations
  const y = slope1 * x + intercept1;

  return new Vector3(x, y, 0);
};



const BoxGeometry = ({
  start,
  end,
  dimension,
  widthchange,
  widthchangetype,
  isSelected,
  type,
  typeId,
  isChoose,
  onClick,
  currentPoint,
  newPointMode,
  opacity = 0.5,
}) => {
  const dispatch = useDispatch();


  const { measured, roomSelect,newline } = useSelector((state) => state.drawing);
  const { storeLines, factor, storeBoxes} = useSelector((state) => state.ApplicationState);

  const textureLoader = useMemo(() => new TextureLoader(), []);
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
  const newTexture = useMemo(
    () => textureLoader.load(New), // Replace with the path to your window image
    [textureLoader]
  );


  const length = start.distanceTo(end);
  const width = convert(dimension.width * factor[1]).from("mm").to(measured);

  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
  //console.log("middlepoint", midpoint);

  // Determine the rotation angle for the box
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  // Calculate the offset to shift the midpoint by half the width
  const offset = new Vector3(-Math.sin(angle) * width / 2, Math.cos(angle) * width / 2, 0);
  const adjustedMidpoint = midpoint.add(offset);
  //console.log("hello adjustmid :", adjustedMidpoint);

let p1,p2,p3,p4,mid1,mid2,prevAngle;

let idx = storeLines.findIndex((line) => line.points[0] === start&& line.points[1]=== end );
//console.log("index",idx)

if(idx>=1){
  //console.log("shubham")

    
    const line = storeLines[idx-1];
    //console.log("hello line :", line)
    const prevWidth = convert(line.width * factor[1]).from("mm").to(measured);
    const prevMid = new Vector3().addVectors(line.points[0], line.points[1]).multiplyScalar(0.5);
    prevAngle = Math.atan2(line.points[1].y - line.points[0].y, line.points[1].x - line.points[0].x);
    const prevoffset = new Vector3(-Math.sin(prevAngle) * width / 2, Math.cos(prevAngle) * prevWidth / 2, 0);
    const prevAdjustedMidpoint = prevMid.add(prevoffset);

    //console.log("prevAdjustedMidpoint:", prevAdjustedMidpoint);

   if(line.points[1]===start){
    if (line.points[0].x === line.points[1].x) {
      mid1 = new Vector3(prevAdjustedMidpoint.x, line.points[1].y, 0);
      p4 = line.points[1];
      p1 = new Vector3(
        2 * mid1.x - p4.x,
        2 * mid1.y - p4.y,
        0
      );
    } else if (line.points[0].y === line.points[1].y) {
      mid1 = new Vector3(line.points[1].x, prevAdjustedMidpoint.y, 0);
      p4 = line.points[1];
      p1 = new Vector3(
        2 * mid1.x - p4.x,
        2 * mid1.y - p4.y,
        0
      );
    }else{

      p4 = line.points[1];
      mid1 = p4.clone().add(prevoffset);
      p1 = mid1.clone().add(prevoffset)
    }
   }
  }

if(start.x === end.x){
  mid2 = new Vector3(adjustedMidpoint.x, start.y,0);
  
  p4 = start;
  p2= new Vector3(
      2 * mid2.x - p4.x,
      2 * mid2.y - p4.y,
      0
    );
}else if(start.y === end.y){
  mid2 = new Vector3(start.x,adjustedMidpoint.y,0);
  p4 = start;
  p2 = new Vector3(
      2 * mid2.x - p4.x,
      2 * mid2.y - p4.y,
      0
    );
}else{
  p4 = start;
  mid2 = p4.clone().add(offset);
  p2 = mid2.clone().add(offset);
}


if(mid1 && mid2 && !newline){
  if(mid1!== mid2 && p1!==p2){
    //console.log("intersection point found between mid1 and mid2")
    p3 = calculateIntersection(p1, prevAngle, p2, angle);

    //console.log("hii",p3);
  }
}




  // let p1 = new Vector3(start.x, start.y+width, 0);
  // let p2 = new Vector3(start.x+ width, start.y, 0)
  // let p3 = new Vector3(start.x+ width, start.y+width, 0);
  // let p4 = start;



//console.log("mid1 and mid2 :", mid1, mid2);
// console.log('p1:',p1);
// console.log(p2);
// console.log(p3);
// console.log(p4);

useEffect(()=>{
  if(mid1 && mid2 && mid1!==mid2){
    if(Math.abs(p1?.x) <1000 && Math.abs(p1?.y) <1000 && Math.abs(p2?.x) <1000 && Math.abs(p2?.y) <1000 && Math.abs(p3?.x) <1000 && Math.abs(p3?.y) <1000 && Math.abs(p4?.x) <1000 && Math.abs(p4?.y) <1000){
      // console.log("intersection point found between mid1 and mid2",p1,p2,p3,p4)
      const data={p1,p2,p3,p4}
      const boxes = [...storeBoxes]
      boxes.push(data)
      dispatch(setStoreBoxes(boxes))
    }
  }
},[])

if (!start || !end) return null;

// Calculate the text position slightly above the midpoint
const textPosition = new Vector3(
  midpoint.x - 20 * Math.sin(angle),
  midpoint.y + 20 * Math.cos(angle),
  0.1 // Ensure it's above the box geometry
);

// Calculate the rotation angle for the text based on the line angle
const textRotation = angle;


  
  return (
    <>
      <mesh position={adjustedMidpoint} rotation={[0, 0, angle]} onClick={onClick}>
        <boxGeometry args={[length, width, 0.1]} />
        <meshBasicMaterial
           map={
            isSelected?
            newTexture
            :
            typeId === 1
              ? wallTexture
              : typeId === 2
              ? doorTexture
              : typeId === 3
              ? windowTexture
              : typeId === 4
              ? railingTexture
              : wallTexture
          }
          width={typeId===4?"10px":"20px"}
          transparent={true}
          opacity={0.9}
        />
      </mesh>


     
      {/* {mid1 && mid2 && mid1!==mid2 && (<CreateFiller p1={p1} p2={p2} p3={p3} p4={p4} />)} */}
     
      

      <mesh position={start}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial
          color={typeId === 2 ? "brown" : typeId === 3 ? "skyblue" : typeId === 4 ? "violet": "black"}
          transparent={true}
          opacity={opacity}
        />
      </mesh>

       {/* Text to display the length of the box */}
       <Text
        position={textPosition}
        rotation={[0, 0, textRotation]}
        fontSize={12}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {`${(length*factor[0]).toFixed(2)} ${measured}`}
      </Text>


      <mesh position={end}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={typeId === 2 ? "brown" : typeId === 3 ? "skyblue" : typeId === 4 ? "violet":  "black"}
          transparent={true}
          opacity={opacity}
        />
      </mesh>
      
      
      
    </>
  );
};

export default BoxGeometry;










