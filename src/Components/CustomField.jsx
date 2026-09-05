import React from "react";
import { TextField, MenuItem } from "@mui/material";
import '../../src/Components/CustomField.scss';

function CustomTextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  select = false,
  options = [],
  error,
  helperText,
  width,
  height = "38px", 
  ...props
}) {
  return (
    <TextField
      {...props}
      className="custom-textfield-wrapper"
      select={select}
      variant="outlined"
      label={label}
      size="small"
      placeholder={placeholder}
      type={type}
      error={error}
      helperText={helperText}
      value={value ?? ''}
      onChange={onChange}
      sx={{
        width: width || "200px", // Default width
        height: height, 
        
        "& .MuiInputBase-root": {
          height: height, 
        },
       
        "& .MuiOutlinedInput-input": {
          padding: "0 14px", 
          height: height,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center"
        },
       
        "& .MuiSelect-select": {
          padding: "0 14px !important",
          lineHeight: height,
          display: "flex",
          alignItems: "center",
          height: "100%"
        },

        "& .MuiInputLabel-root": {
          transform: "translate(14px, 6px) scale(1)", 
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -6px) scale(0.75)", 
        },
        ...props.sx,
      }}
    >
    </TextField>
  );
}

export default CustomTextField;
