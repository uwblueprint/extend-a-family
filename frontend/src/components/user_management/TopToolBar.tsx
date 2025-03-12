import React, { useState } from "react";
import { Box, MenuItem, Typography, Button, Stack } from "@mui/material";
import { Search, FilterList, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import StartAdornedTextField from "../common/form/StartAdornedTextField";
import { isRole } from "../../types/UserTypes";

interface TopToolBarProps {
  searchQuery: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterLabel: string;
  handleRoleSelect: (role: string) => void;
  handleOpenAddAdminModal: () => void;
}

const TopToolBar: React.FC<TopToolBarProps> = ({
  searchQuery,
  handleSearch,
  filterLabel,
  handleRoleSelect,
  handleOpenAddAdminModal,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", height: "64px" }}
    >
      {/* Title Section */}
      <Stack direction="column">
        <Typography variant="headlineLarge" color={theme.palette.Neutral[700]}>
          User List
        </Typography>
        <Typography variant="bodyMedium" color={theme.palette.Neutral[700]}>
          View all the people using this platform
        </Typography>
      </Stack>
      {/* Controls Section */}
      <Stack direction="row" spacing={1} alignItems="center">
        <StartAdornedTextField
          variant="outlined"
          label="Search by name"
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
          focusedBorderColor={theme.palette.Learner.Default}
          sx={{
            minWidth: "400px",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isSearchActive
                  ? theme.palette.Learner.Default
                  : theme.palette.Neutral[500],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.Neutral[600],
              },
            },
          }}
        />
        <StartAdornedTextField
          select
          variant="outlined"
          label="Filter"
          value={filterLabel}
          adornment={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <FilterList sx={{ color: "#6f797b" }} />
            </Box>
          }
          focusedBorderColor={theme.palette.Learner.Default}
          sx={{
            width: "250px",
            textTransform: "uppercase",
            textAlign: "left",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.Neutral[600],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.Neutral[600],
              },
            },
          }}
        >
          {["All", "Administrator", "Facilitator", "Learner"].map(
            (roleOption) => (
              <MenuItem
                key={roleOption}
                value={roleOption}
                onClick={() => handleRoleSelect(roleOption)}
              >
                <Typography
                  variant="labelMedium"
                  sx={{
                    display: "inline-block",
                    color: isRole(roleOption)
                      ? theme.palette[roleOption].Default
                      : undefined,
                    backgroundColor: isRole(roleOption)
                      ? theme.palette[roleOption].Light
                      : undefined,
                    padding: "4px 8px",
                    borderRadius: "8px",
                  }}
                >
                  {roleOption.toUpperCase()}
                </Typography>
              </MenuItem>
            ),
          )}
        </StartAdornedTextField>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: theme.palette.Administrator.Default,
            height: "56px",
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.Administrator.Default,
            },
          }}
          onClick={handleOpenAddAdminModal}
          disableElevation
        >
          <Typography variant="labelLarge" color={theme.palette.Neutral[100]}>
            ADD NEW ADMIN
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default TopToolBar;
