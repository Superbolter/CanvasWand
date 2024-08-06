import React from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';




const InputField = props => (
    <TextField
    id="outlined-full-width"
    label={props.label}
    style={{ margin: 8 }}
    placeholder={props.placeholder}
    helperText={props.helperText}
    fullWidth
    InputLabelProps={{
    shrink: true,
    }}
    variant="outlined"
    />
)


export default InputField;