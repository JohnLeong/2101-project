import React from 'react'
import { TextareaAutosize, TextField, } from '@material-ui/core';

export default function InputLarge(props) {

    const { name, label, value,error=null, onChange, ...other } = props;
    return (
        <TextField
            variant="outlined"
            multiline
            rows = {20}
            label={label}
            name={name}
            value={value}
            contentEditable = "true"
            onChange={onChange}
            {...other}
            {...(error && {error:true,helperText:error})}
        />
    )
}
