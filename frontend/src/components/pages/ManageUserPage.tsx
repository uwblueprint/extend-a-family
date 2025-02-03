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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Search, FilterList, Add } from "@mui/icons-material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { Role } from "../../types/AuthTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";

const ManageUser = (): React.ReactElement => {
  const [role, setRole] = useState<Role>("Administrator");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

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

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  return (
    <Stack direction="column" spacing={2} margin="2rem">
      {/* Top Toolbar Section */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="column">
          <h2>User List</h2>
          <p>View all the people using this platform</p>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search by name..."
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <IconButton edge="start">
                  <Search />
                </IconButton>
              ),
            }}
          />

          {/* Filter Button (Replaces Role Dropdown) */}
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>
          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={handleFilterClose}
          >
            <MenuItem
              onClick={() => {
                setRole("Administrator");
                handleFilterClose();
              }}
            >
              Administrator
            </MenuItem>
            <MenuItem
              onClick={() => {
                setRole("Facilitator");
                handleFilterClose();
              }}
            >
              Facilitator
            </MenuItem>
            <MenuItem
              onClick={() => {
                setRole("Learner");
                handleFilterClose();
              }}
            >
              Learner
            </MenuItem>
          </Menu>

          {/* Add New Admin Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ backgroundColor: "#8B4513", color: "white" }}
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
              <TableCell>Email</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
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
              <TableRow key={user.id} style={{ height: 53 }}>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {user.firstName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {user.lastName}
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
                colSpan={3}
                count={filteredUsers.length}
                rowsPerPage={usersPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "users per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default ManageUser;
