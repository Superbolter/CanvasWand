import React from 'react';

const convertToJSON = (lines, points) => {
    const jsonData = {
        points: points.map(point => ({ x: point.x, y: point.y,id:point.id })),
        lines: lines.map(line => ({
            Id :line.id,
            startPoint :line.points[0],
            endPoint :line.points[1],
            length: line.length,
            width: line.width,
            height: line.height,
            widthchangetype:line.widthchangetype,
            widthchange:line.widthchange,
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
