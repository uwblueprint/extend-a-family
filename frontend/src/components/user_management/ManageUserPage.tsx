import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  SnackbarContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";

import TopToolBar from "./TopToolBar";
import UserTable from "./UserTable";
import AddAdminModal from "./AddAdminModal";
import DeleteUserModal from "./DeleteUserModal";
import AuthAPIClient from "../../APIClients/AuthAPIClient";

const ManageUserPage = (): React.ReactElement => {
  // Main state
  const [users, setUsers] = useState<User[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [openAddUserSnackbar, setOpenAddUserSnackbar] = useState(false);
  const [openDeleteUserSnackbar, setOpenDeleteUserSnackbar] = useState(true);
  const [addSnackbarName, setAddSnackbarName] = useState("Jane Doe");
  const [deleteSnackbarName, setDeleteSnackbarName] = useState("");
  // States for admin modal inputs
  const [deleteFirstName, setDeleteFirstName] = useState("");
  const [deleteLastName, setDeleteLastName] = useState("");
  const [firstName, setFirstName] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [lastName, setLastName] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars

  const [selectedRole, setSelectedRole] = useState<string>("");

  const theme = useTheme();

  // Fetch all users on mount
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

  // Search handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      (user.firstName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (user.lastName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination handlers
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

  const handleRoleSelect = (role_curr: string) => {
    if (role_curr === "All") {
      setUsers(userData);
    } else {
      setUsers(userData.filter((item) => item.role === role_curr));
    }
    setPage(0);
    setSelectedRole(role_curr);
  };

  // Modal open/close handlers
  const handleOpenAddAdminModal = () => setOpenAddAdminModal(true);
  const handleCloseAddAdminModal = () => setOpenAddAdminModal(false);
  const handleCloseAddAdminSnackbar = () => setOpenAddUserSnackbar(false);
  const handleCloseDeleteUserSnackbar = () => setOpenDeleteUserSnackbar(false);

  const handleOpenDeleteUserModal = (
    userId: string,
    dFirstName: string,
    dLastName: string,
  ) => {
    setDeleteUserId(userId);
    setDeleteFirstName(dFirstName);
    setDeleteLastName(dLastName);
    setOpenDeleteUserModal(true);
  };
  const handleCloseDeleteUserModal = () => setOpenDeleteUserModal(false);

  // TODO: Implement these actions as needed
  const handleDeleteUser = async (
    userId: string,
    dFirstName: string,
    dLastName: string,
  ) => {
    const deletedUser = await UserAPIClient.deleteUsers(userId);
    if (deletedUser) {
      handleCloseDeleteUserModal();
      setDeleteSnackbarName(`${dFirstName} ${dLastName}`);
      setOpenDeleteUserSnackbar(true);
    }
  };

  const handleAddAdmin = async () => {
    const admin = await AuthAPIClient.inviteAdmin(firstName, lastName, email);
    if (admin) {
      // upon successful API call
      setAddSnackbarName(`${admin.firstName} ${admin.lastName}`);
      handleCloseAddAdminModal();
      setOpenAddUserSnackbar(true);
    }
  };
  const addAction = (
    <>
      <Button
        size="small"
        onClick={handleCloseAddAdminSnackbar}
        sx={{
          color: theme.palette.Learner.Default,
        }}
      >
        UNDO
      </Button>
    </>
  );
  const deleteAction = (
    <>
      <Button
        size="small"
        onClick={handleCloseDeleteUserSnackbar}
        sx={{
          color: theme.palette.Learner.Default,
        }}
      >
        UNDO
      </Button>
    </>
  );
  const AddAdminSnackbar = () => {
    return (
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={openAddUserSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseAddAdminSnackbar}
        sx={{
          maxWidth: "482px",
          maxHeight: "64px",
          width: "100%",
          height: "100%",
        }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: theme.palette.Success.Hover,
            color: theme.palette.Neutral[700],
            paddingTop: "12px",
            paddingLeft: "32px",
            paddingRight: "12px",
            paddingBottom: "12px",
            gap: "16px",
            "& .MuiSnackbarContent-action": {
              padding: "0px",
              margin: "0px",
            },
          }}
          message={
            <span
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <PersonOutlineIcon
                sx={{
                  color: theme.palette.Success.Default,
                }}
              />
              <Typography
                variant="bodyMedium"
                sx={{
                  color: theme.palette.Success.Default,
                }}
              >
                &quot;{addSnackbarName}&quot; was added as admin
              </Typography>
            </span>
          }
          action={addAction}
        />
      </Snackbar>
    );
  };

  const DeleteUserSnackbar = () => {
    return (
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={openDeleteUserSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseDeleteUserSnackbar}
      >
        <SnackbarContent
          sx={{
            backgroundColor: theme.palette.Error.Hover,
            color: theme.palette.Neutral[700],
            paddingTop: "12px",
            paddingLeft: "32px",
            paddingRight: "12px",
            paddingBottom: "12px",
            gap: "16px",
            "& .MuiSnackbarContent-action": {
              padding: "0px",
              margin: "0px",
            },
          }}
          action={deleteAction}
          message={
            <span
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <PersonOutlineIcon
                sx={{
                  color: theme.palette.Error.Default,
                }}
              />
              <Typography
                variant="bodyMedium"
                sx={{
                  color: theme.palette.Error.Default,
                }}
              >
                &quot;{deleteSnackbarName}&quot; was deleted from the user list
              </Typography>
            </span>
          }
        />
      </Snackbar>
    );
  };

  return (
    <Box
      role="main"
      sx={{ display: "flex", flexDirection: "column", padding: "25px" }}
    >
      <AddAdminSnackbar />
      <DeleteUserSnackbar />
      <DeleteUserModal
        open={openDeleteUserModal}
        onClose={handleCloseDeleteUserModal}
        deleteUserId={deleteUserId}
        deleteFirstName={deleteFirstName}
        deleteLastName={deleteLastName}
        handleDeleteUser={handleDeleteUser}
      />
      <AddAdminModal
        open={openAddAdminModal}
        onClose={handleCloseAddAdminModal}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
        handleAddAdmin={handleAddAdmin}
      />
      <Stack direction="column" spacing={2} margin="2rem">
        <TopToolBar
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          filterLabel={selectedRole}
          handleRoleSelect={handleRoleSelect}
          handleOpenAddAdminModal={handleOpenAddAdminModal}
        />
        <UserTable
          filteredUsers={filteredUsers}
          usersPerPage={usersPerPage}
          page={page}
          emptyRows={emptyRows}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleOpenDeleteUserModal={handleOpenDeleteUserModal}
        />
      </Stack>
    </Box>
  );
};

export default ManageUserPage;
