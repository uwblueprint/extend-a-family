import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type ProfileFieldProps = {
  label: string;
  children: string;
};

function ProfileField({ label, children }: ProfileFieldProps) {
  return (
    <Box display="flex" alignItems="center">
      <Typography
        variant="labelLarge"
        sx={{ minWidth: 100, paddingRight: "8px" }}
      >
        {label}:
      </Typography>

      <Typography variant="bodyMedium">{children}</Typography>
    </Box>
  );
}

export default function FacilitatorCard() {
  return (
    <Card variant="outlined" sx={{ width: 1045, height: 230 }}>
      <CardContent sx={{ height: "100%" }}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="50px"
          height="100%"
          p="20px"
        >
          <Avatar sx={{ width: 155, height: 155 }} />
          <Stack sx={{ gap: "15px" }}>
            <ProfileField label="Name"> John Doe </ProfileField>
            <ProfileField label="Pronouns"> he/him </ProfileField>
            <ProfileField label="Email"> john.doe@email.com </ProfileField>
            <ProfileField label="Bio">
              Hello! My name is John Doe. I’m super excited to be your
              facilitator and to work with you.
            </ProfileField>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
