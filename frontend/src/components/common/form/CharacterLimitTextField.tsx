/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";

type CharacterLimitTextFieldProps = TextFieldProps & {
  maxLength: number;
};

/**
 * Custom MUI TextField that enforces a character limit on the input
 * Accepts the usual MUI TextField props, plus some custom props:
 * @param characterLimit limit on number of character in text field
 */
const CharacterLimitTextField: React.FC<CharacterLimitTextFieldProps> = ({
  maxLength,
  slotProps,
  value,
  onChange,
  ...props
}) => {
  const [length, setLength] = useState((value as string).length);
  return (
    <TextField
      {...props}
      slotProps={{
        ...slotProps,
        htmlInput: { ...slotProps?.htmlInput, maxLength },
        formHelperText: {
          ...slotProps?.formHelperText,
          sx: { textAlign: "right" },
        },
      }}
      helperText={`${length}/${maxLength} characters`}
      error={length === maxLength}
      value={value}
      onChange={(e) => {
        setLength(e.target.value.length);
        onChange?.(e);
      }}
    />
  );
};

export default CharacterLimitTextField;
