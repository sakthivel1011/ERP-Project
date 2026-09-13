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
  InputLabelProps,
  ...props
}) {
  
  const isDate = type === "date";

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
      value={value ?? ""}
      onChange={onChange}
      
      InputLabelProps={{
        ...(isDate ? { shrink: true } : {}),
        ...InputLabelProps,
      }}
      
      sx={{
        width: width || "200px",
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
          transform: isDate 
            ? "translate(14px, -8px) scale(0.75) !important" 
            : "translate(14px, 6px) scale(1) !important", 
          backgroundColor: isDate ? "white !important" : "transparent",
          padding: isDate ? "0 4px !important" : "0",
          zIndex: 1,
        },

        
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -8px) scale(0.75) !important", 
          backgroundColor: "white !important",
          padding: "0 4px !important",
          zIndex: 1,
        },
        ...props.sx,
      }}
    >
      {props.children}
    </TextField>
  );
}

export default CustomTextField;
