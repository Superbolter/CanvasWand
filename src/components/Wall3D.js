import React, { useMemo } from 'react';
import * as THREE from 'three';
import Bricks1 from '../assets/Bricks1.jpg'; // Adjust the path to your texture

const Wall3D = ({ start, end, height, width }) => {
    const position = [
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        height / 2,
    ];

    const length = Math.sqrt(
        Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
    );

    // Determine if the wall is vertical or horizontal
    const isVertical = Math.abs(end[0] - start[0]) < Math.abs(end[1] - start[1]);

    const texture = useMemo(() => {
        const tex = new THREE.TextureLoader().load(Bricks1);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(length / 1, height / 1);
        return tex;
    }, [length, height]);

    const bumpMapTexture = useMemo(() => {
        const bumpMap = new THREE.TextureLoader().load(Bricks1);
        bumpMap.wrapS = THREE.RepeatWrapping;
        bumpMap.wrapT = THREE.RepeatWrapping;
        bumpMap.repeat.set(length / 1, height / 1);
        return bumpMap;
    }, [length, height]);

    const normalMapTexture = useMemo(() => {
        const normalMap = new THREE.TextureLoader().load(Bricks1);
        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;
        normalMap.repeat.set(length / 1, height / 1);
        return normalMap;
    }, [length, height]);

    const boxArgs = isVertical
        ? [width, length, height]
        : [length, width, height];

    return (
        <mesh position={position}>
            <boxGeometry args={boxArgs} />
            <meshStandardMaterial
                map={texture}
                bumpMap={bumpMapTexture}
                normalMap={normalMapTexture}
                bumpScale={0.2}
                roughness={0.7}
                metalness={0.0}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default Wall3D;
