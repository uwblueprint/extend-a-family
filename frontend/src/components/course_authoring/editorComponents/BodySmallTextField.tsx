import { TextField } from "@mui/material";

export default function BodySmallTextField({
  value,
  onChange,
  placeholder,
  minRows,
  maxRows,
  rows,
}: {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  rows?: number;
}) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      multiline
      minRows={minRows}
      maxRows={maxRows}
      rows={rows}
      placeholder={placeholder}
      value={value}
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
}
