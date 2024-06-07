import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLines ,setFormVisible, setIdSelection} from "../features/drawing/drwingSlice";
import convert from 'convert-units';

const LineEditForm = () => {
  const { lines, idSelection, measured } = useSelector((state) => state.drawing);
  const dispatch = useDispatch();

  const selectedLine = lines.find(line => line.startId === idSelection[idSelection.length-1].si && line.endId === idSelection[idSelection.length-1].ei);
  

  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    if (selectedLine) {
      setLength(convert(selectedLine.len).from('mm').to(measured));
      setWidth(convert(selectedLine.breadth).from('mm').to(measured));
      setHeight(convert(selectedLine.height).from('mm').to(measured));
    }
  }, [selectedLine, measured]);

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedLine) {
      const updatedLine = {
        ...selectedLine,
        len: parseFloat(convert(length).from(measured).to('mm')),
        breadth: parseFloat(convert(width).from(measured).to('mm')),
        height: parseFloat(convert(height).from(measured).to('mm')),
      };

      dispatch(setLines(lines.map(line =>
        line.startId === selectedLine.startId && line.endId === selectedLine.endId ? updatedLine : line
      )));
      
      dispatch(setFormVisible(false));
      dispatch(setIdSelection([]));
    }
  };

  return (
    <div style={{ position: 'absolute', top: '100px', right: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black' }}>
      <h3>Edit Line</h3>
      <label>
        Length:
        <input type="text" value={length} onChange={(e) => setLength(e.target.value)} />
      </label>
      <br />
      <label>
        Width:
        <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} />
      </label>
      <br />
      <label>
        Height:
        <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default LineEditForm;
