import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
}

export default function NavButton({ label, icon, href }: NavButtonProps) {
  const theme = useTheme();
  return (
    <Link to={href || "#"} style={{ textDecoration: "none" }}>
      <Button
        variant="outlined"
        startIcon={icon}
        endIcon={<ArrowRightIcon />}
        sx={{
          borderColor: theme.palette.Neutral[300],
          color: theme.palette.Neutral[900],
          borderRadius: "8px",
          padding: "20px",
          gap: "12px",
          width: 350,
          ...theme.typography.bodyLarge,
        }}
      >
        <Box sx={{ flexGrow: 1, textAlign: "left" }}>{label}</Box>
      </Button>
    </Link>
  );
}
