import { TextField } from "@mui/material";

export const BodySmallTextField = ({
  defaultValue,
  onChange,
  placeholder,
  minRows,
  maxRows,
  rows,
}: {
  defaultValue: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  rows?: number;
}) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      multiline
      minRows={minRows}
      maxRows={maxRows}
      rows={rows}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "140%",
          letterSpacing: "0.32px",
          textTransform: "none",
          fontFamily: "Lexend Deca, sans-serif",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "& .MuiOutlinedInput-root": {
          padding: 0,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      }}
    />
  );
};

export const BodyMediumTextField = ({
  defaultValue,
  onChange,
  placeholder,
  minRows,
  maxRows,
  rows,
  color,
}: {
  defaultValue: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  rows?: number;
  color?: string;
}) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      multiline
      minRows={minRows}
      maxRows={maxRows}
      rows={rows}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "140%",
          letterSpacing: "0.2px",
          textTransform: "none",
          fontFamily: "Lexend Deca, sans-serif",
          color,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "& .MuiOutlinedInput-root": {
          padding: 0,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      }}
    />
  );
};

export const HeaderLargeTextField = ({
  defaultValue,
  onChange,
  placeholder,
  minRows,
  maxRows,
  rows,
  color,
  onBlur,
}: {
  defaultValue: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  rows?: number;
  color?: string;
  onBlur?: () => void;
}) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      multiline
      minRows={minRows}
      maxRows={maxRows}
      rows={rows}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "28px",
          fontWeight: 600,
          lineHeight: "120%",
          textTransform: "none",
          letterSpacing: "0.2px",
          fontFamily: "Lexend Deca, sans-serif",
          color,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "& .MuiOutlinedInput-root": {
          padding: 0,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      }}
    />
  );
};
