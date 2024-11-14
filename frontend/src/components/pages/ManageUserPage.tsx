import React, { useState, useEffect, useCallback } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import {
  TableRow,
  TableCell,
  TablePagination,
  Stack,
  FormControl,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import CustomTable from "../common/table/CustomTable";
import useTable from "../../hooks/useTable";
import { Role } from "../../types/AuthTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";

const ManageUser = (): React.ReactElement => {
  const [role, setRole] = useState<Role>("Administrator");
  const [users, setUsers] = useState<User[]>([]);

  const {
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    pageSize,
    page,
    setSortField,
    setSortAscending,
    sortField,
  } = useTable({
    data: users,
  });

  useEffect(() => {
    async function getUsers() {
      const fetchedUsers = await UserAPIClient.getUsersByRole(role);
      setUsers(fetchedUsers);
      handleChangePage(0);
    }
    getUsers();
  }, [role, handleChangePage]);

  const setSortFieldAndSortDirection = useCallback(
    (selectedSortField: keyof User) => {
      if (selectedSortField === sortField) {
        setSortAscending((prev) => !prev);
      } else {
        setSortField(selectedSortField);
        setSortAscending(true);
      }
    },
    [setSortField, setSortAscending, sortField],
  );

  const changePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      handleChangePage(newPage);
    },
    [handleChangePage],
  );

  const changeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChangeRowsPerPage(parseInt(event.target.value, 10));
      handleChangePage(0);
    },
    [handleChangePage, handleChangeRowsPerPage],
  );

  const renderHead = useCallback(() => {
    return (
      <TableRow>
        <TableCell onClick={() => setSortFieldAndSortDirection("email")}>
          Email
        </TableCell>
        <TableCell
          align="right"
          onClick={() => setSortFieldAndSortDirection("firstName")}
        >
          First Name
        </TableCell>
        <TableCell
          align="right"
          onClick={() => setSortFieldAndSortDirection("lastName")}
        >
          Last Name
        </TableCell>
      </TableRow>
    );
  }, [setSortFieldAndSortDirection]);

  const renderRow = useCallback((user: User) => {
    return (
      <TableRow style={{ height: 53 }}>
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
    );
  }, []);

  const renderFooter = useCallback(() => {
    return (
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={users.length}
          rowsPerPage={pageSize}
          page={page}
          slotProps={{
            select: {
              inputProps: {
                "aria-label": "users per page",
              },
              native: true,
            },
          }}
          onPageChange={changePage}
          onRowsPerPageChange={changeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    );
  }, [changePage, changeRowsPerPage, page, pageSize, users.length]);

  const getKey = useCallback((user: User) => {
    return user.id;
  }, []);

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
      <CustomTable
        data={paginatedData}
        renderRow={renderRow}
        renderHead={renderHead}
        renderFooter={renderFooter}
        getKey={getKey}
      />
    </Stack>
  );
};

export default ManageUser;
