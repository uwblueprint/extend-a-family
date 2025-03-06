import React from "react";
import {
  TextField,
  InputAdornment,
  Box,
  Menu,
  MenuItem,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Search, FilterList, ArrowDropDown, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface TopToolBarProps {
  searchQuery: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSearchActive: boolean;
  handleSearchFocus: () => void;
  handleSearchBlur: () => void;
  filterLabel: string;
  handleFilterClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  filterAnchor: HTMLElement | null;
  handleFilterClose: () => void;
  handleRoleSelect: (role: string) => void;
  roleBackground: Record<string, string>;
  roleColors: Record<string, string>;
  handleOpenAddAdminModal: () => void;
}

const TopToolBar: React.FC<TopToolBarProps> = ({
  searchQuery,
  handleSearch,
  isSearchActive,
  handleSearchFocus,
  handleSearchBlur,
  filterLabel,
  handleFilterClick,
  filterAnchor,
  handleFilterClose,
  handleRoleSelect,
  roleBackground,
  roleColors,
  handleOpenAddAdminModal,
}) => {
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
        <TextField
          variant="outlined"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  sx={{
                    color: isSearchActive
                      ? theme.palette.Neutral[600]
                      : theme.palette.Neutral[500],
                  }}
                />
              </InputAdornment>
            ),
          }}
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
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.Learner.Default,
              },
            },
          }}
        />
        <TextField
          variant="outlined"
          placeholder="Filter"
          value={filterLabel}
          onClick={handleFilterClick}
          InputProps={{
            style: {
              fontSize: "14px",
              fontWeight: 300,
              lineHeight: "120%",
              letterSpacing: "0.7px",
              textTransform: "uppercase",
            },
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleFilterClick(event);
                  }}
                >
                  <FilterList sx={{ color: "#6f797b" }} />
                </Box>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ArrowDropDown sx={{ color: "#6F797B" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            textTransform: "uppercase",
            textAlign: "left",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isSearchActive
                  ? theme.palette.Learner.Default
                  : theme.palette.Neutral[500],
              },
              "&:hover fieldset": {
                borderColor: theme.palette.Neutral[600],
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.Learner.Default,
              },
            },
          }}
        />
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
          sx={{ "& .MuiPaper-root": { borderRadius: "8px", padding: "4px" } }}
        >
          {["All", "Administrator", "Facilitator", "Learner"].map(
            (roleOption) => (
              <MenuItem
                key={roleOption}
                onClick={() => handleRoleSelect(roleOption)}
              >
                <Typography
                  variant="labelMedium"
                  sx={{
                    display: "inline-block",
                    backgroundColor: roleBackground[roleOption],
                    color: roleColors[roleOption],
                    padding: "4px 8px",
                    borderRadius: "8px",
                  }}
                >
                  {roleOption.toUpperCase()}
                </Typography>
              </MenuItem>
            ),
          )}
        </Menu>
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
