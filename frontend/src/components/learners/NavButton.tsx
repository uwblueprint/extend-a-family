import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Button, useTheme } from "@mui/material";

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export default function NavButton({
  label,
  icon,
  href,
  onClick,
}: NavButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant="outlined"
      href={href}
      onClick={onClick}
      startIcon={icon}
      endIcon={<ArrowRightIcon />}
      sx={{
        borderColor: theme.palette.Neutral[300],
        color: theme.palette.Neutral[900],
        borderRadius: "8px",
        padding: "20px",
        gap: "12px",
        width: 515,
        // justifyContent: "flex-start",
        ...theme.typography.bodyLarge,
      }}
    >
      <Box sx={{ flexGrow: 1, textAlign: "left" }}>{label}</Box>
    </Button>
  );
}
