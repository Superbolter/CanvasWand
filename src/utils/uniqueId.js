import {v4 as uuidv4} from 'uuid';
import { Vector3 } from "three";

export const uniqueId = () => {
    let uniqueId = uuidv4().slice(0,8);
    return uniqueId;
};

export const calculateAlignedPoint = (previousPoint, newPosition) => {
    const [x1, y1, z1] = previousPoint;
    const [x2, y2, z2] = newPosition;
  
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    const dz = Math.abs(z1 - z2);
  
    let newPoint = new Vector3(x2, y2, z2);
  
    if (dx >= dy && dx >= dz) {
      newPoint.setY(y1); 
      newPoint.setZ(z1); 
    } else if (dy >= dx && dy >= dz) {
      newPoint.setX(x1); 
      newPoint.setZ(z1); 
    } else {
      newPoint.setX(x1); 
      newPoint.setY(y1); 
    }
  
    return newPoint;
  };
  