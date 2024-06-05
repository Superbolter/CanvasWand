import {v4 as uuidv4} from 'uuid';



export const findNearestPoint = (points, x, y, SNAP_THRESHOLD) => {
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

export const findNearestLine = (lines, x, y, SNAP_THRESHOLD) => {
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

export const distanceBetweenPoints = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.abs(Math.sqrt(dx * dx + dy * dy));
};

export const uniqueId = () => {
    let uniqueId = uuidv4().slice(0,8);
    return uniqueId;
};