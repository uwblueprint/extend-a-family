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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Delete,
  AlternateEmail,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

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
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const handleOpenAddAdminModal = () => setOpenAddAdminModal(true);
  const handleCloseAddAdminModal = () => setOpenAddAdminModal(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const handleOpenDeleteUserModal = (userId: string) => {
    setDeleteUserId(userId);
    setOpenDeleteUserModal(true);
  };
  const handleCloseDeleteUserModal = () => setOpenDeleteUserModal(false);
  const theme = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
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

  // TODO: IMPLEMENT
  const handleDeleteUser = (userId: string) => {};
  const handleAddAdmin = async () => {};

  const AddAdminModal = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Dialog
          open={openAddAdminModal}
          onClose={handleCloseAddAdminModal}
          PaperProps={{
            sx: {
              display: "flex",
              width: "400px",
              padding: "32px",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              gap: "32px",
            },
          }}
        >
          <Box>
            <Box>
              <IconButton
                onClick={handleCloseAddAdminModal}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogTitle
              sx={{
                margin: "0px",
                padding: "0px",
                marginBottom: "12px",
              }}
            >
              <Typography
                variant="headlineMedium"
                color={theme.palette.OnBackground}
              >
                Add new admin{" "}
              </Typography>
            </DialogTitle>
          </Box>
          <Box>
            <DialogContent
              sx={{
                margin: "0px",
                padding: "0px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "336px",
                  gap: "24px",
                }}
              >
                <TextField
                  required
                  type="text"
                  placeholder="First Name"
                  onChange={(event) => setFirstName(event.target.value)}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "stretch",
                    height: "56px",
                    width: "100%",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  type="text"
                  placeholder="Last Name"
                  onChange={(event) => setLastName(event.target.value)}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "stretch",
                    height: "56px",
                    width: "100%",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  type="email"
                  placeholder="Email"
                  onChange={(event) => setEmail(event.target.value)}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "stretch",
                    maxHeight: "56px",
                    width: "100%",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </DialogContent>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                display: "flex",
                height: "40px",
                gap: "8px",
                "&:hover": {
                  bgcolor: theme.palette.Administrator.Hover,
                },
                borderColor: `${theme.palette.Light.Outline}`,
              }}
              onClick={handleCloseAddAdminModal}
            >
              <Typography
                variant="labelLarge"
                color={theme.palette.Administrator.Default}
              >
                CANCEL
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                display: "flex",
                height: "40px",
                gap: "8px",
                backgroundColor: theme.palette.Administrator.Default,
                "&:hover": {
                  bgcolor: theme.palette.Administrator.Default,
                },
              }}
              onClick={handleAddAdmin}
            >
              <Typography variant="labelLarge">ADD ADMIN</Typography>
            </Button>
          </Box>
        </Dialog>
      </Box>
    );
  };

  const DeleteUserModal = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Dialog
          open={openDeleteUserModal}
          onClose={handleCloseDeleteUserModal}
          PaperProps={{
            sx: {
              display: "flex",
              width: "400px",
              padding: "32px",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              gap: "32px",
            },
          }}
        >
          <Box>
            <Box>
              <IconButton
                onClick={handleCloseDeleteUserModal}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogTitle
              sx={{
                margin: "0px",
                padding: "0px",
                marginBottom: "12px",
              }}
            >
              <Typography
                variant="headlineMedium"
                color={theme.palette.OnBackground}
              >
                Delete User?
              </Typography>
            </DialogTitle>
            <DialogContent
              sx={{
                margin: "0px",
                padding: "0px",
              }}
            >
              <DialogContentText>
                <Typography
                  variant="bodyMedium"
                  color={theme.palette.OnBackground}
                >
                  This action can&apos;t be undone. A deleted user cannot be
                  recovered.
                </Typography>
              </DialogContentText>
            </DialogContent>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                display: "flex",
                height: "40px",
                gap: "8px",
                "&:hover": {
                  bgcolor: theme.palette.Administrator.Hover,
                },
                borderColor: `${theme.palette.Light.Outline}`,
              }}
              onClick={handleCloseDeleteUserModal}
            >
              <Typography
                variant="labelLarge"
                color={theme.palette.Administrator.Default}
              >
                GO BACK
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                display: "flex",
                height: "40px",
                gap: "8px",
                backgroundColor: theme.palette.Error.Default,
                "&:hover": {
                  bgcolor: theme.palette.Error.Default,
                },
              }}
              onClick={() => handleDeleteUser(deleteUserId)}
            >
              <Typography variant="labelLarge">DELETE</Typography>
            </Button>
          </Box>
        </Dialog>
      </Box>
    );
  };

  return (
    <Box>
      <DeleteUserModal />
      <AddAdminModal />
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
              onClick={handleOpenAddAdminModal}
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
                ? filteredUsers.slice(
                    page * usersPerPage,
                    page * usersPerPage + usersPerPage,
                  )
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
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleOpenDeleteUserModal(user.id)}
                    >
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
    </Box>
  );
};

export default ManageUser;
