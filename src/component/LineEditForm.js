import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setInformation,information, setIdSelection, setWidthChangeType } from "../features/drawing/drwingSlice";
import convert from 'convert-units';
import { setStoreLines } from '../Actions/ApplicationStateAction';
const LineEditForm = ({selectedLines,setSelectedLines,setSelectionMode}) => {
  const {  idSelection, measured, widthChangeType,information } = useSelector((state) => state.drawing);
  const {  storeLines} = useSelector((state) => state.ApplicationState);
  const dispatch = useDispatch();

  const selectedLine = storeLines.find(line => line.id === selectedLines[selectedLines.length-1]);

  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  
  useEffect(() => {
    if (selectedLine) {
      setLength(convert(selectedLine.length).from('mm').to(measured));
      setWidth(convert(selectedLine.width).from('mm').to(measured));
      setHeight(convert(selectedLine.height).from('mm').to(measured));
    }
  }, [selectedLine, measured]);

  const handleSave = (e) => {
        e.preventDefault();
        if (selectedLine) {
         const widthchange = (width - convert(selectedLine.width).from('mm').to(measured))/2;
         const widthchangetype =widthChangeType;

        const updatedLine = {
          ...selectedLine,
          length: parseFloat(convert(length).from(measured).to('mm')),
          width: parseFloat(convert(width).from(measured).to('mm')),
          height: parseFloat(convert(height).from(measured).to('mm')),
          widthchange: widthchange,
          widthchangetype: widthchangetype,
          
        };
    
          dispatch(setStoreLines(storeLines.map(line =>
            line.id === updatedLine.id ? updatedLine : line
          )));

          setSelectedLines([]);
          setSelectionMode(false);
          dispatch(setInformation(false));
          
        }
      };

  return (
    <div style={{ position: 'absolute', bottom: '100px', right: '20px', backgroundColor: 'white', padding: '10px', border: '1px solid black' }}>
      <h3>Edit Line</h3>
      <label>
        Length:
        <input type="text" value={length} onChange={(e) => setLength(e.target.value)} />
      </label>
      <br />
      <label>
        Thickness:
        <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} />
      </label>
      <br />
      <label>
        Height:
        <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="inside"
          checked={widthChangeType === 'inside'}
          onChange={() => dispatch(setWidthChangeType('inside'))}
        />
        Inside
      </label>
      <label>
        <input
          type="radio"
          value="outside"
          checked={widthChangeType === 'outside'}
          onChange={() => dispatch(setWidthChangeType('outside'))}
        />
        Outside
      </label>
      <label>
        <input
          type="radio"
          value="inside"
          checked={widthChangeType === 'between'}
          onChange={() => dispatch(setWidthChangeType('between'))}
        />
        Between
      </label>
      <br />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default LineEditForm;
