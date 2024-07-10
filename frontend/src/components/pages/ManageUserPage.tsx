import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import {
  TableContainer,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  TableHead,
  Stack,
  FormControl,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { Table } from "react-bootstrap";
import { Role } from "../../types/AuthTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";

const ManageUser = (): React.ReactElement => {
  const [role, setRole] = useState<Role>("Administrator");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
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

  return (
    <Stack direction="column" justifyContent="center" margin="2rem" spacing={2}>
      <FormControl fullWidth>
        <InputLabel id="role-select-label">Role</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={role}
          label="Role"
          onChange={(e: SelectChangeEvent<Role>) =>
            setRole(e.target.value as Role)
          }
        >
          <MenuItem value="Administrator">Administrator</MenuItem>
          <MenuItem value="Facilitator">Facilitator</MenuItem>
          <MenuItem value="Learner">Learner</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table aria-label="User grouped by role table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(usersPerPage > 0
              ? users.slice(
                  page * usersPerPage,
                  page * usersPerPage + usersPerPage,
                )
              : users
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
                count={users.length}
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
