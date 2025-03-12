import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Box,
  Typography,
  TableFooter,
  TablePagination,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import { User } from "../../types/UserTypes";
import placeholderImage from "../assets/placeholder_profile.png";

interface UserTableProps {
  filteredUsers: User[];
  usersPerPage: number;
  page: number;
  emptyRows: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleOpenDeleteUserModal: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  filteredUsers,
  usersPerPage,
  page,
  emptyRows,
  handleChangePage,
  handleChangeRowsPerPage,
  handleOpenDeleteUserModal,
}) => {
  const theme = useTheme();
  return (
    <TableContainer
      component={Paper}
      sx={{
        display: "center",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
        border: "none",
        boxShadow: 0,
      }}
    >
      <Table
        aria-label="User List Table"
        sx={{ width: "100%", height: "100%" }}
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
                    height: "40px",
                    padding: "4px 16px",
                    borderRadius: "4px",
                    borderColor: theme.palette.Neutral[500],
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
  );
};

export default UserTable;
