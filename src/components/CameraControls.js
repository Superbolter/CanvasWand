import React, { useRef, useEffect } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

const CameraControls = () => {
    const { camera, gl } = useThree();
    const controls = useRef();

    useFrame(() => {
        controls.current.update();
    });

    useEffect(() => {
        camera.position.set(0, -10, 10); // Adjust the camera position
        camera.lookAt(0, 0, 0); // Ensure the camera looks at the origin
    }, [camera]);

    return (
        <orbitControls
            ref={controls}
            args={[camera, gl.domElement]}
            enableDamping
            dampingFactor={0.2}
            rotateSpeed={0.5}
        />
    );
};

export default CameraControls;
