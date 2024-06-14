const DrawPlane = () => {
    const planeRef = useRef();
    const [drawing, setDrawing] = useState(false);
    const [points, setPoints] = useState([]);
  
    const handlePointerDown = (event) => {
      setDrawing(true);
      const { offsetX, offsetY } = event.pointers[0];
      setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
    };
  
    const handlePointerMove = (event) => {
      if (drawing) {
        const { offsetX, offsetY } = event.pointers[0];
        setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
      }
    };
  
    return (
      <mesh
        ref={planeRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[10, 10, 10, 10]} />
        <meshBasicMaterial color="lightblue" wireframe />
        {points.map((point, index) => (
          <mesh key={index} position={[point.x, point.y, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        ))}
      </mesh>
    );
  };
  