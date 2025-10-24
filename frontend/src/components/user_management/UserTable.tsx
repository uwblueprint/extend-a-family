import { Delete, MarkUnreadChatAltOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useUser } from "../../hooks/useUser";
import { User } from "../../types/UserTypes";
import ChatWithLearner from "./chat-with-learner/ChatWithLearner";

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
  handleOpenDeleteUserModal: (
    userId: string,
    firstName: string,
    deleteName: string,
  ) => void;
  handleApproveFacilitator?: (userId: string) => void;
  handleRejectFacilitator?: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  filteredUsers,
  usersPerPage,
  page,
  emptyRows,
  handleChangePage,
  handleChangeRowsPerPage,
  handleOpenDeleteUserModal,
  handleApproveFacilitator,
  handleRejectFacilitator,
}) => {
  const theme = useTheme();
  const { role } = useUser();

  const [chatPopoverAnchorEl, setChatPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const chatPopoverOpen = Boolean(chatPopoverAnchorEl);
  const chatPopoverId = chatPopoverOpen ? "chat-popover" : undefined;

  const [chatWithUser, setChatWithUser] = React.useState<User | null>(null);

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
              <TableCell
                sx={{
                  paddingLeft: "0px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Avatar src={user.profilePicture} alt={user.firstName} />
                <Box
                  sx={{
                    marginLeft: "16px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="bodyLarge">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="bodySmall" color="textSecondary">
                    {user.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ textAlign: "right", paddingRight: "0px" }}>
                {role === "Facilitator" &&
                  (user.status === "Active" ? (
                    <>
                      <IconButton
                        size="large"
                        aria-label="show messages with learner"
                        onClick={(event) => {
                          setChatPopoverAnchorEl(event.currentTarget);
                          setChatWithUser(user);
                        }}
                      >
                        <MarkUnreadChatAltOutlined
                          sx={{
                            width: "24px",
                            height: "24px",
                            color: theme.palette.Facilitator.Dark.Selected,
                          }}
                        />
                      </IconButton>
                      <Typography
                        variant="labelMedium"
                        sx={{ marginLeft: "16px" }}
                      >
                        X% COMPLETE
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="labelMedium"
                      sx={{
                        display: "inline-block",
                        backgroundColor: "#F6F6F6",
                        color: theme.palette.Neutral[700],
                        padding: "4px 8px",
                      }}
                    >
                      ACCOUNT PENDING
                    </Typography>
                  ))}
                {role === "Administrator" && (
                  <>
                    <Typography
                      variant="labelMedium"
                      sx={{
                        marginRight: "16px",
                        display: "inline-block",
                        backgroundColor: theme.palette[user.role].Light.Default,
                        color: theme.palette[user.role].Dark.Default,
                        padding: "4px 8px",
                      }}
                    >
                      {user.role.toUpperCase()}
                    </Typography>
                    {user.status === "PendingApproval" &&
                    user.role === "Facilitator" ? (
                      <>
                        <Button
                          variant="outlined"
                          sx={{
                            height: "40px",
                            padding: "4px 16px",
                            borderRadius: "4px",
                            borderColor: theme.palette.Success.Dark.Default,
                            color: theme.palette.Success.Dark.Default,
                            marginRight: "8px",
                          }}
                          onClick={() => handleApproveFacilitator?.(user.id)}
                        >
                          <Typography variant="labelLarge">APPROVE</Typography>
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            height: "40px",
                            padding: "4px 16px",
                            borderRadius: "4px",
                            borderColor: theme.palette.Error.Dark.Default,
                            color: theme.palette.Error.Dark.Default,
                          }}
                          onClick={() => handleRejectFacilitator?.(user.id)}
                        >
                          <Typography variant="labelLarge">REJECT</Typography>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        sx={{
                          height: "40px",
                          padding: "4px 16px",
                          borderRadius: "4px",
                          borderColor: theme.palette.Neutral[500],
                          color: theme.palette.Error.Dark.Default,
                        }}
                        onClick={() =>
                          handleOpenDeleteUserModal(
                            user.id,
                            user.firstName,
                            user.lastName,
                          )
                        }
                      >
                        <Typography variant="labelLarge">DELETE USER</Typography>
                      </Button>
                    )}
                  </>
                )}
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
              sx={{
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    margin: "auto",
                  },
              }}
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
      <Popover
        id={chatPopoverId}
        open={chatPopoverOpen}
        anchorEl={chatPopoverAnchorEl}
        onClose={() => setChatPopoverAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ borderRadius: "8px" }}
      >
        {chatWithUser && <ChatWithLearner learner={chatWithUser} />}
      </Popover>
    </TableContainer>
  );
};

export default UserTable;
