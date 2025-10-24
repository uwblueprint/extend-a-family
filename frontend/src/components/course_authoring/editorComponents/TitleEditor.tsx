import { TextField } from "@mui/material";

export default function TitleEditor({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (newTitle: string) => void;
}) {
  return (
    <TextField
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="[Click to add the question]"
      variant="outlined"
      fullWidth
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "24px",
          fontWeight: 600,
          lineHeight: "120%",
          textTransform: "none",
          fontFamily: "Lexend Deca, sans-serif",
          padding: 0,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "& .MuiOutlinedInput-root": {
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
