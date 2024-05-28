import React from 'react';
import * as THREE from 'three';

const TexturedPlane = ({ texture }) => {
    return (
        <>
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[12, 8]} />
                <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
            <gridHelper 
                args={[window.innerHeight, window.innerWidth, 'white', 'gray']} 
                position={[0, 0, 0]} 
                rotation={[Math.PI / 2, 0, 0]} 
            />
        </>
    );
};

export default TexturedPlane;
