export const isPointConnected = (point, lines) => {
    return lines.some(line => 
        (line.startX === point.x && line.startY === point.y) ||
        (line.endX === point.x && line.endY === point.y)
    );
};