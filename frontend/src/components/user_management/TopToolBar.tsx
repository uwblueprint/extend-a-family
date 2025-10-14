import { Add, FilterList, Search } from "@mui/icons-material";
import { Box, Button, MenuItem, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { isRole } from "../../types/UserTypes";
import StartAdornedTextField from "../common/form/StartAdornedTextField";

interface TopToolBarProps {
  searchQuery: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterLabel: string;
  handleRoleSelect: (role: string) => void;
  handleOpenAddAdminModal: () => void;
  handleOpenAddLearnerModal: () => void;
}

const TopToolBar: React.FC<TopToolBarProps> = ({
  searchQuery,
  handleSearch,
  filterLabel,
  handleRoleSelect,
  handleOpenAddAdminModal,
  handleOpenAddLearnerModal,
}) => {
  const { role } = useUser();
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
          {role === "Administrator" && <>User List</>}
          {role === "Facilitator" && <>Learner List</>}
        </Typography>
        <Typography variant="bodyMedium" color={theme.palette.Neutral[700]}>
          {role === "Administrator" && (
            <>View all the people using this platform</>
          )}
          {role === "Facilitator" && <>View a complete list of your learners</>}
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
          focusedBorderColor={theme.palette[role].Dark.Default}
          sx={{
            minWidth: "400px",
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
        {role === "Administrator" && (
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
                <FilterList sx={{ color: theme.palette.Neutral[500] }} />
              </Box>
            }
            focusedBorderColor={theme.palette[role].Dark.Default}
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
                        ? theme.palette[roleOption].Dark.Default
                        : undefined,
                      backgroundColor: isRole(roleOption)
                        ? theme.palette[roleOption].Light.Default
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
        )}
        {role === "Administrator" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: theme.palette.Administrator.Dark.Default,
              height: "56px",
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.Administrator.Dark.Default,
              },
            }}
            onClick={handleOpenAddAdminModal}
            disableElevation
          >
            <Typography variant="labelLarge" color={theme.palette.Neutral[100]}>
              ADD NEW ADMIN
            </Typography>
          </Button>
        )}
        {role === "Facilitator" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: theme.palette.Facilitator.Dark.Default,
              height: "56px",
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.Facilitator.Dark.Default,
              },
            }}
            onClick={handleOpenAddLearnerModal}
            disableElevation
          >
            <Typography variant="labelLarge" color={theme.palette.Neutral[100]}>
              CREATE LEARNER ACCOUNT
            </Typography>
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default TopToolBar;
