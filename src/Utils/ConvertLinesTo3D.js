export const convertLinesTo3D = (lines, setWalls3D, setIs3D) => {
    const scaleFactor = 0.02; // Scale down the size of the lines
    const canvasHeight = 400; // Height of the canvas, should be consistent with the canvas height
    const walls3DConverted = lines.map((line) => {
        // Flip the y-coordinates correctly
        const start = [(line.startX - 300) * scaleFactor, -(line.startY - canvasHeight / 2) * scaleFactor, 0];
        const end = [(line.endX - 300) * scaleFactor, -(line.endY - canvasHeight / 2) * scaleFactor, 0];
        return { start, end };
    });
    setWalls3D(walls3DConverted);
    setIs3D(true);
};
