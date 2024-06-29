import React from 'react';

// Function to translate points
const translatePoints = (points) => {
    // Filter points that are in the third quadrant (x < 0, y < 0)
    const thirdQuadrantPoints = points.filter(point => point.x < 0 && point.y < 0);

    // Find the point with the minimum x and y values in the third quadrant
    const minPoint = thirdQuadrantPoints.reduce((min, point) => ({
        x: Math.min(min.x, point.x),
        y: Math.min(min.y, point.y)
    }), { x: Infinity, y: Infinity });

    // Calculate the translation values to move points to the first quadrant
    const translation = { x: -minPoint.x + 50, y: -minPoint.y + 50 };

    // Apply the translation to all points
    const translatedPoints = points.map(point => ({
        ...point,
        x: point.x + translation.x,
        y: point.y + translation.y,
    }));

    return { translatedPoints, translation };
};

const convertToJSON = (lines, points) => {
    const { translatedPoints, translation } = translatePoints(points);

    // Function to translate individual points
    const translatePoint = (point) => {
        console.log("Points here: ", point);
        if (!point) return null; // Check if point is defined and not null
        return {
            ...point,
            x: point.x + translation.x,
            y: point.y + translation.y,
        };
    };

    const jsonData = {
        points: translatedPoints.map(point => ({ x: point.x, y: point.y, z: point.z })),
        lines: lines.map(line => ({
            Id: line.id,
            startPoint: translatePoint(line.points[0]) ,
            endPoint: translatePoint(line.points[1]) ,
            length: line.length,
            width: line.width,
            height: line.height,
            widthchangetype: line.widthchangetype,
            widthchange: line.widthchange,
        }))
    };
    return JSON.stringify(jsonData);
};

const DownloadJSONButton = ({ lines, points }) => {
    const handleDownload = () => {
        const jsonData = convertToJSON(lines, points);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <button onClick={handleDownload}>Download JSON</button>
    );
};

export default DownloadJSONButton;
