import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMeasured } from '../features/drawing/drwingSlice';
import { Typography } from '../design_system/StyledComponents/components/Typography';
import { MenuItem, Select } from '@mui/material';

const useLengthUnitSelector = () => {
    const dispatch = useDispatch();

    const handleUnitChange = (event) => {
        dispatch(setMeasured(event.target.value));
    };

    return { handleUnitChange };
};

 const LengthConverter = () => {
    const { measured } = useSelector((state) => state.drawing);
    const { handleUnitChange } = useLengthUnitSelector();

    return (
        <div>
            <label htmlFor="lengthUnit"><Typography className="thickness-text">Select Length Unit:</Typography></label>
            <Select id="lengthUnit" onChange={handleUnitChange} value={measured} defaultValue={measured} style={{height:"38px", width:"100%"}}>
                <MenuItem value="in"><Typography modifiers={["subtitle2"]}>Inches</Typography></MenuItem>
                <MenuItem value="m"><Typography modifiers={["subtitle2"]}>Meters</Typography></MenuItem>
                <MenuItem value="cm"><Typography modifiers={["subtitle2"]}>Centimeters</Typography></MenuItem>
                <MenuItem value="mm"><Typography modifiers={["subtitle2"]}>Millimeters</Typography></MenuItem>
                <MenuItem value="ft"><Typography modifiers={["subtitle2"]}>Feet</Typography></MenuItem>
            </Select>
        </div>
    );
};
export default LengthConverter;
