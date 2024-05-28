import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

const AxesHelper = () => {
    const { scene } = useThree();

    useEffect(() => {
        const axesHelper = new THREE.AxesHelper(window.innerHeight); // Length of the axes
        const redMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 10 });
        const greenMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 10 });
        const blueMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 10 });

        if (axesHelper.children.length >= 3) {
            axesHelper.children[0].material = redMaterial; // X-axis material
            axesHelper.children[1].material = greenMaterial; // Y-axis material
            axesHelper.children[2].material = blueMaterial; // Z-axis material
        } else {
            console.warn('AxesHelper does not have the expected number of children.');
        }

        scene.add(axesHelper);

        return () => {
            scene.remove(axesHelper);
        };
    }, [scene]);

    return null;
};

export default AxesHelper;
