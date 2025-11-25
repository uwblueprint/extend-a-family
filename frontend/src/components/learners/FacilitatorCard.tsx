import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";

type ProfileFieldProps = {
  label: string;
  children: React.ReactNode;
};

function ProfileField({ label, children }: ProfileFieldProps) {
  return (
    <Box display="flex" alignItems="flex-start">
      <Typography
        variant="labelLarge"
        sx={{ minWidth: 100, marginRight: 1, paddingTop: "2.5px" }}
      >
        {label}:
      </Typography>

      <Typography variant="bodyMedium">{children}</Typography>
    </Box>
  );
}

type FacilitatorCardProps = {
  facilitator: {
    firstName: string;
    lastName: string;
    pronouns?: string;
    email: string;
    bio?: string;
    profilePic?: string;
  };
};

export default function FacilitatorCard({ facilitator }: FacilitatorCardProps) {
  const theme = useTheme();
  const initials =
    `${facilitator.firstName[0]}${facilitator.lastName[0]}`.toUpperCase();
  return (
    <Card
      variant="outlined"
      sx={{ width: 1045, height: 230, borderRadius: "10px" }}
    >
      <CardContent sx={{ height: "100%" }}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="50px"
          height="100%"
          p="20px"
        >
          <Avatar
            sx={{
              width: 155,
              height: 155,
              bgcolor: theme.palette.Facilitator.Light.Default,
              color: theme.palette.Facilitator.Dark.Default,
              ...theme.typography.displayLarge,
            }}
            src={facilitator.profilePic}
          >
            {!facilitator.profilePic && initials} {/* fallback to initials */}
          </Avatar>
          <Stack sx={{ gap: "15px" }}>
            <ProfileField label="Name">
              {facilitator.firstName} {facilitator.lastName}
            </ProfileField>
            <ProfileField label="Pronouns">
              {facilitator.pronouns || "N/A"}
            </ProfileField>
            <ProfileField label="Email"> {facilitator.email} </ProfileField>
            <ProfileField label="Bio">{facilitator.bio || "N/A"}</ProfileField>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
