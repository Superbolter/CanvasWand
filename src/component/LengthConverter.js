import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMeasured } from '../features/drawing/drwingSlice';
import { Typography } from '../design_system/StyledComponents/components/Typography';
import { MenuItem, Select,InputBase, } from '@mui/material';
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
  
const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: "4px",
    },
    "& .MuiInputBase-input": {
      borderRadius: 8,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      fontFamily: "'DM Sans', sans-serif",
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
}));

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
            <Select
                input={<BootstrapInput />}
                MenuProps={{
                  PaperProps: {
                    style: {
                      borderRadius: "12px",
                    },
                  },
                  MenuListProps: {
                    sx: {
                      padding: '4px',
                    },
                  },
                }}
                IconComponent={KeyboardArrowDownIcon} id="lengthUnit" onChange={handleUnitChange} value={measured} defaultValue={measured} style={{height:"38px", width:"100%"}}>
                <MenuItem style={{borderRadius:"8px"}} value="in"><Typography modifiers={["subtitle2"]}>Inches</Typography></MenuItem>
                <MenuItem style={{borderRadius:"8px"}} value="m"><Typography modifiers={["subtitle2"]}>Meters</Typography></MenuItem>
                <MenuItem style={{borderRadius:"8px"}} value="cm"><Typography modifiers={["subtitle2"]}>Centimeters</Typography></MenuItem>
                <MenuItem style={{borderRadius:"8px"}} value="mm"><Typography modifiers={["subtitle2"]}>Millimeters</Typography></MenuItem>
                <MenuItem style={{borderRadius:"8px"}} value="ft"><Typography modifiers={["subtitle2"]}>Feet</Typography></MenuItem>
            </Select>
        </div>
    );
};
export default LengthConverter;
