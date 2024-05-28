import React from 'react';

const Wall3D = ({ start, end }) => {
    const width = Math.abs(end[0] - start[0]);
    const height = Math.abs(end[1] - start[1]);
    const depth = 1; // Set depth to represent walls

    const position = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        depth / 2
    ];

    return (
        <mesh position={position}>
            <boxGeometry args={[width, height, depth]} />
            <meshBasicMaterial color="#eb3434" />
        </mesh>
    );
};

export default Wall3D;
