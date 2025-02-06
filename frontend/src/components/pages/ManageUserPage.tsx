import React, { useState, useEffect } from "react";

import {
  TableContainer,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  TableHead,
  Table,
  Stack,
  Button,
  TextField,
  Menu,
  MenuItem,
  InputAdornment,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { Search, FilterList, Add, Delete} from "@mui/icons-material";

import { Role } from "../../types/AuthTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";
import placeholderImage from "../assets/placeholder_profile.png";

const roleColors: Record<string, string> = {
  Administrator: "#FFE0CC",
  Facilitator: "#E0D4FF",
  Learner: "#D1F2EB",
};

const ManageUser = (): React.ReactElement => {
  const [role, setRole] = useState<Role>("Administrator");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  useEffect(() => {
    async function getUsers() {
      const fetchedUsers = await UserAPIClient.getUsersByRole(role);
      setUsers(fetchedUsers);
      setPage(0);
    }
    getUsers();
  }, [role]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * usersPerPage - users.length) : 0;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchFocus = () => setIsSearchActive(true);
  const handleSearchBlur = () => setIsSearchActive(false);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUsersPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setFilterAnchor(event.currentTarget);
    setIsFilterActive(true);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
    setIsFilterActive(false);
  };

  return (
    <Stack direction="column" spacing={2} margin="2rem">
      {/* Top Toolbar Section */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%", height: "64px" }}
      >
        {/* Title Section */}
        <Stack direction="column">
          <h2
            style={{
              fontFamily: "Lexend Deca, sans-serif",
              fontSize: "28px",
              fontWeight: 600,
              lineHeight: "33.6px",
              color: "#171D1E",
              margin: 0,
            }}
          >
            User List
          </h2>
          <p style={{ margin: 0, color: "#5F6368" }}>
            View all the people using this platform
          </p>
        </Stack>

        {/* Controls Section */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Search Bar with Floating Label */}
          <TextField
            required
            label="Search by name..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{ color: isSearchActive ? "#0056D2" : "#5F6368" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: "240px",
              borderRadius: "8px",
              "& label": {
                color: isSearchActive ? "#0056D2" : "#5F6368",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: isSearchActive ? "#0056D2" : "#E0E0E0",
                },
                "&:hover fieldset": {
                  borderColor: "#0056D2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0056D2",
                },
              },
            }}
          />

          {/* Filter Input with Floating Label */}
          <TextField
            required
            label="Filter"
            variant="outlined"
            size="small"
            onClick={handleFilterClick} // Use onClick to open dropdown
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={(event) => {
                      event.preventDefault(); // Prevents input focus
                      event.stopPropagation(); // Ensures only the icon triggers the dropdown
                      handleFilterClick(event); // Opens the menu
                    }}
                  >
                    <FilterList
                      sx={{ color: isFilterActive ? "#0056D2" : "#5F6368" }}
                    />
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: "180px",
              borderRadius: "8px",
              "& label": {
                color: isFilterActive ? "#0056D2" : "#5F6368",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: isFilterActive ? "#0056D2" : "#E0E0E0",
                },
                "&:hover fieldset": {
                  borderColor: "#0056D2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0056D2",
                },
              },
            }}
          />
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={handleFilterClose}
          >
            {["Administrator", "Facilitator", "Learner"].map((roleOption) => (
              <MenuItem
                key={roleOption}
                onClick={() => {
                  setRole(roleOption as Role);
                  handleFilterClose();
                }}
              >
                {roleOption}
              </MenuItem>
            ))}
          </Menu>

          {/* Add New Admin Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: "#8B4513",
              color: "white",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#6F3A10" },
            }}
          >
            ADD NEW ADMIN
          </Button>
        </Stack>
      </Stack>

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table aria-label="User List Table">
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(usersPerPage > 0
              ? filteredUsers.slice(page * usersPerPage, page * usersPerPage + usersPerPage)
              : filteredUsers
            ).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar src={placeholderImage} alt={user.firstName} />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">{user.firstName}</TableCell>
                <TableCell align="right">{user.lastName}</TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{
                      backgroundColor: roleColors[role] || "#D1F2EB",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {role.toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="error" startIcon={<Delete />}>
                    DELETE USER
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={6}
                count={filteredUsers.length}
                rowsPerPage={usersPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default ManageUser;
