/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

type StartAdornedTextFieldProps = TextFieldProps & {
  adornment: JSX.Element;
  focusedBorderColor?: string;
};

/**
 * Custom MUI TextField that supports start adornment with floating label.
 * Accepts the usual MUI TextField props, plus some custom props:
 * @param adornment JSX Element to be placed in start adornment slot
 * @param label placeholder that floats to label position on click
 * @param focusedBorderColor (optional) color of border and label when text field is focused
 */
const StartAdornedTextField: React.FC<StartAdornedTextFieldProps> = ({
  adornment,
  focusedBorderColor,
  onFocus,
  onBlur,
  slotProps,
  sx,
  ...props
}) => {
  const [shrink, setShrink] = useState(false);
  return (
    <TextField
      {...props}
      onFocus={(e) => {
        setShrink(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setShrink(!!e.target.value);
        onBlur?.(e);
      }}
      slotProps={{
        ...slotProps,
        inputLabel: {
          ...slotProps?.inputLabel,
          sx: { ml: 4.5 },
          shrink,
        },
        input: {
          ...slotProps?.input,
          startAdornment: (
            <InputAdornment position="start">{adornment}</InputAdornment>
          ),
        },
      }}
      sx={{
        ...sx,
        marginTop: "5px",
        "& .MuiInputLabel-shrink": {
          marginLeft: 0,
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: focusedBorderColor,
        },
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: focusedBorderColor,
        },
        "& .MuiFormLabel-root": {
          fontSize: "inherit",
        },
        "& .MuiInputBase-root": {
          fontSize: "inherit",
        },
      }}
    />
  );
};

export default StartAdornedTextField;
