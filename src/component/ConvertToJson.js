import React from 'react';

const convertToJSON = (lines, points,roomSelectors) => {
    console.log("roomSelectors",roomSelectors);
    const jsonData = {
        points: points.map(point => ({ id:point.id,x: point.x, y: point.y,  z: point.z})),
        lines: lines.map(line => ({
            id :line.id,
            startPoint :line.points[0],
            endPoint :line.points[1],
            length: line.length,
            width: line.width,
            height: line.height,
            widthchangetype:line.widthchangetype,
            widthchange:line.widthchange,
            type:line.type,
            typeId: line.typeId
        })),
        rooms: roomSelectors.map(room => ({
            roomId: room.roomId,
            roomName: room.roomName,
            wallIds: room.wallIds,
        })),
    };
    return JSON.stringify(jsonData);
};


const DownloadJSONButton = ({ lines, points,roomSelectors }) => {
   
    const handleDownload = () => {
        console.log("roomSelectors",roomSelectors,lines);
        const jsonData = convertToJSON(lines, points,roomSelectors);
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

export const handleDownload = (lines, points, roomSelectors) => {
    console.log(lines);
    console.log("roomSelectors", roomSelectors, lines);
    const data = convertToJSON(lines, points, roomSelectors);
    return data;
};





