import { Search } from "@mui/icons-material";
import {
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import StartAdornedTextField from "../common/form/StartAdornedTextField";
import LearnerFeedbackBlock from "./LearnerFeedbackBlock";

const FeedbackFacilitatorView = (): React.ReactElement => {
  const theme = useTheme();
  const { role } = useUser();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      justifyContent="space-between"
      gap="24px"
      alignSelf="stretch"
      sx={{ padding: "32px 64px" }}
    >
      <Typography variant="headlineLarge" color={theme.palette.Neutral[700]}>
        View Feedback
      </Typography>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap="32px"
        alignSelf="stretch"
      >
        <StartAdornedTextField
          variant="outlined"
          label="Student Name"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
          adornment={
            <Search
              sx={{
                color: isSearchActive
                  ? theme.palette.Neutral[600]
                  : theme.palette.Neutral[500],
              }}
            />
          }
          focusedBorderColor={theme.palette[role].Dark.Default}
          sx={{
            flex: "1 0 0",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isSearchActive
                  ? theme.palette[role].Dark.Default
                  : theme.palette.Neutral[500],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.Neutral[600],
              },
            },
          }}
        />
        <TextField
          select
          variant="outlined"
          label="Unit"
          sx={{ minWidth: "200px" }}
        >
          {["1.0", "2.0", "2.1"].map((roleOption) => (
            <MenuItem key={roleOption} value={roleOption} onClick={() => {}}>
              <Typography variant="labelMedium">
                {roleOption.toUpperCase()}
              </Typography>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="outlined"
          label="Module"
          sx={{ minWidth: "200px" }}
        >
          {["1.0", "2.0", "2.1"].map((roleOption) => (
            <MenuItem key={roleOption} value={roleOption} onClick={() => {}}>
              <Typography variant="labelMedium">
                {roleOption.toUpperCase()}
              </Typography>
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <hr
        style={{
          border: "1px solid",
          width: "100%",
          color: theme.palette.Neutral[300],
          margin: 0,
        }}
      />
      <LearnerFeedbackBlock />
      <LearnerFeedbackBlock />
    </Stack>
  );
};

export default FeedbackFacilitatorView;
