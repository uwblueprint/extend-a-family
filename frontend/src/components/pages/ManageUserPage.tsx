import React, { useState, useEffect } from "react";

import {
  TableContainer,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
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
  ArrowDropDown,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";
import placeholderImage from "../assets/placeholder_profile.png";

const ManageUser = (): React.ReactElement => {
  const [users, setUsers] = useState<User[]>([]);
  const [userData, setUserData] = useState<User[]>([]);

  const [page, setPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterActive] = useState(false);
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

  const [firstName, setFirstName] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [lastName, setLastName] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  useEffect(() => {
    async function getUsers() {
      const allUsers = await UserAPIClient.getUsers();
      setUserData(allUsers);
      setUsers(allUsers);
    }
    getUsers();
  }, []);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * usersPerPage - users.length) : 0;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchFocus = () => setIsSearchActive(true);
  const handleSearchBlur = () => setIsSearchActive(false);

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.lastName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
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

  const [selectedRole, setSelectedRole] = useState<string | null>(null); // No default role

  const handleFilterClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleRoleSelect = (role_curr: string) => {
    setUsers(role_curr === "All" ? userData : userData.filter((item) => item.role === role_curr));
    setPage(0);
    setSelectedRole(role_curr);
    handleFilterClose();
  };

  // set the displayed value
  const filterLabel = selectedRole ? selectedRole.toUpperCase() : "Filter";

  // TODO: IMPLEMENT
  const handleDeleteUser = (userId: string) => {}; // eslint-disable-line @typescript-eslint/no-unused-vars
  const handleAddAdmin = async () => {};

  const roleBackground: Record<string, string> = {
    Administrator: theme.palette.Administrator.Light,
    Facilitator: theme.palette.Facilitator.Light,
    Learner: theme.palette.Learner.Light,
  };

  const roleColors: Record<string, string> = {
    Administrator: theme.palette.Administrator.Default,
    Facilitator: theme.palette.Facilitator.Default,
    Learner: theme.palette.Learner.Default,
  };

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "25px",
      }}
    >
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
            <h2>
              <Typography
                variant="headlineLarge"
                color={theme.palette.OnBackground}
              >
                User List
              </Typography>
            </h2>
            <p style={{ margin: 0 }}>
              <Typography
                variant="bodyMedium"
                color={theme.palette.OnBackground}
              >
                View all the people using this platform
              </Typography>
            </p>
          </Stack>

          {/* Controls Section */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Search Bar with Floating Label */}
            
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
                    <Search sx={{ color: isSearchActive ? theme.palette.Neutral[600]: theme.palette.Neutral[500]}} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: "400px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isSearchActive ? theme.palette.Learner.Default : theme.palette.Neutral[500],
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


            {/* Filter Input with Floating Label */}

            <TextField
              variant="outlined"
              placeholder="Filter"
              value={filterLabel}
              onClick={handleFilterClick} // Opens dropdown on click
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
                      <FilterList sx={{ color: isFilterActive ? "#6f797b" : "#6f797b" }} />
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
                "& .MuiOutlinedInput-root":  {
                  "& fieldset": {
                    borderColor: isSearchActive ? theme.palette.Learner.Default : theme.palette.Neutral[500],
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
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "8px",
                  padding: "4px",
                },
              }}
            >
              {/* role selection with Styled Badges */}
              {["All", "Administrator", "Facilitator", "Learner"].map(
                (roleOption) => (
                  <MenuItem
                    key={roleOption}
                    onClick={() => handleRoleSelect(roleOption)}
                  >
                    <Typography
                      variant = "labelMedium"
                      sx={{
                        display: "inline-block",
                        backgroundColor: roleBackground[roleOption],
                        color: roleColors[roleOption],
                        padding: "4px 8px",
                        borderRadius: "8px"
                      }}
                    >
                      {roleOption.toUpperCase()}
                    </Typography>
                  </MenuItem>
                ),
              )}
            </Menu>

            {/* admin button */}
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
              <Typography
                variant="labelLarge"
                color={theme.palette.Neutral[100]}
              >
                ADD NEW ADMIN
              </Typography>
            </Button>
          </Stack>
        </Stack>

        {/* User Table */}
        <TableContainer
          component={Paper}
          sx={{
            display: "center",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            height: "80%", // Full viewport height
            border: "none",
            boxShadow: 0,
          }}
        >
          <Table
            aria-label="User List Table"
            sx={{
              width: "100%", // Fills the container width
              height: "100%", // Fills the container height
            }}
          >
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
                  <TableCell align="left">
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="bodyLarge">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="bodySmall" color="textSecondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "right",
                      paddingRight: "16px",
                      width: "18%",
                    }}
                  >
                    <Typography
                      variant="labelMedium"
                      sx={{
                        display: "inline-block",
                        backgroundColor: theme.palette[user.role].Light,
                        color: theme.palette[user.role].Default,
                      }}
                    >
                      {user.role.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "right",
                      paddingRight: "0px",
                      width: "18%",
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Delete />}
                      sx={{
                        height: "40px", // Match button height
                        padding: "4px 16px",
                        borderRadius: "4px",
                        borderColor: "#6F797B", // grey outline
                        color: theme.palette.Error.Default,
                      }}
                      onClick={() => handleOpenDeleteUserModal(user.id)}
                    >
                      <Typography variant="labelLarge">DELETE USER</Typography>
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
