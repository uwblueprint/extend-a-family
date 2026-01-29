import { Box, useTheme } from "@mui/material";

export default function DeleteCircleButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid",
        borderColor: theme.palette.Neutral[400],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ":hover": {
          backgroundColor: theme.palette.Neutral[300],
        },
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.6302 3.526V4.53469H20.6737V6.55206H19.665V19.665C19.665 20.7746 18.7572 21.6824 17.6476 21.6824H7.56073C6.45117 21.6824 5.54336 20.7746 5.54336 19.665V6.55206H4.53467V4.53469H9.5781V3.526H15.6302ZM7.56073 19.665H17.6476V6.55206H7.56073V19.665ZM9.5781 8.56944H11.5955V17.6476H9.5781V8.56944ZM15.6302 8.56944H13.6129V17.6476H15.6302V8.56944Z"
          fill="#AD2323"
        />
      </svg>
    </Box>
  );
}
