import React from 'react';
import { useDispatch } from 'react-redux';
import { setMeasured } from '../features/drawing/drwingSlice';

const useLengthUnitSelector = () => {
    const dispatch = useDispatch();

    const handleUnitChange = (event) => {
        dispatch(setMeasured(event.target.value));
    };

    return { handleUnitChange };
};

export const LengthConverter = () => {
    const { handleUnitChange } = useLengthUnitSelector();

    return (
        <div>
            <label htmlFor="lengthUnit">Select Length Unit:</label>
            <select id="lengthUnit" onChange={handleUnitChange}>
                <option value="in">Inches</option>
                <option value="m">Meters</option>
                <option value="cm">Centimeters</option>
                <option value="mm">Millimeters</option>
                <option value="ft">Feet</option>
            </select>
        </div>
    );
};
