import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Box,
  Button,
  Snackbar,
  SnackbarContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";

import AuthAPIClient from "../../APIClients/AuthAPIClient";
import { useUser } from "../../hooks/useUser";
import { isCaseInsensitiveSubstring } from "../../utils/StringUtils";
import AddAdminModal from "./AddAdminModal";
import AddLearnerModal from "./AddLearnerModal";
import DeleteUserModal from "./DeleteUserModal";
import TopToolBar from "./TopToolBar";
import UserTable from "./UserTable";

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
  const [openDeleteUserSnackbar, setOpenDeleteUserSnackbar] = useState(false);
  const [addSnackbarMessage, setAddSnackbarMessage] = useState("");
  const [deleteSnackbarName, setDeleteSnackbarName] = useState("");

  // States for admin modal inputs
  const [deleteFirstName, setDeleteFirstName] = useState("");
  const [deleteLastName, setDeleteLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // States for learner modal inputs
  const [openAddLearnerModal, setOpenAddLearnerModal] = useState(false);
  const [learnerFirstName, setLearnerFirstName] = useState("");
  const [learnerLastName, setLearnerLastName] = useState("");
  const [learnerEmail, setLearnerEmail] = useState("");

  const [selectedRole, setSelectedRole] = useState<string>("");

  const theme = useTheme();
  const { role } = useUser();

  // Add this outside of useEffect so it can be reused
  const getUsers = useCallback(async () => {
    const allUsers =
      role === "Administrator"
        ? await UserAPIClient.getUsers()
        : await UserAPIClient.facilitatorGetLearners();
    setUserData(allUsers);
    setUsers(allUsers);
  }, [role]);

  // Fetch all users on mount
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * usersPerPage - users.length) : 0;

  // Search handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      isCaseInsensitiveSubstring(user.firstName, searchQuery) ||
      isCaseInsensitiveSubstring(user.lastName, searchQuery) ||
      isCaseInsensitiveSubstring(user.email, searchQuery) ||
      (searchQuery.split(" ").length > 1 &&
        isCaseInsensitiveSubstring(user.firstName, searchQuery.split(" ")[0]) &&
        isCaseInsensitiveSubstring(user.lastName, searchQuery.split(" ")[1])),
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

  const handleCloseAddLearnerModal = () => setOpenAddLearnerModal(false);
  const handleOpenAddLearnerModal = () => setOpenAddLearnerModal(true);

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

  const handleDeleteUser = async (
    userId: string,
    dFirstName: string,
    dLastName: string,
  ) => {
    const deletedUser = await UserAPIClient.deleteUser(userId);
    if (deletedUser) {
      handleCloseDeleteUserModal();
      setDeleteSnackbarName(`${dFirstName} ${dLastName}`);
      setOpenDeleteUserSnackbar(true);
      await getUsers(); // Refresh user list
    }
  };

  const handleAddAdmin = async () => {
    if (firstName && lastName && email) {
      const admin = await AuthAPIClient.inviteAdmin(firstName, lastName, email);
      if (admin) {
        setAddSnackbarMessage(
          `"${admin.firstName} ${admin.lastName}" was added as admin`,
        );
        handleCloseAddAdminModal();
        setOpenAddUserSnackbar(true);
        await getUsers();
      }
    }
  };

  const handleAddLearner = async () => {
    if (learnerFirstName && learnerLastName && learnerEmail) {
      const learner = await AuthAPIClient.inviteLearner(
        learnerFirstName,
        learnerLastName,
        learnerEmail,
      );
      if (learner) {
        setAddSnackbarMessage(
          `User "${learner.firstName} ${learner.lastName}" was created`,
        );
        handleCloseAddLearnerModal();
        setOpenAddUserSnackbar(true);
        await getUsers();
      }
    }
  };

  // Approval handlers
  const handleApproveFacilitator = async (userId: string) => {
    try {
      await UserAPIClient.approveFacilitator(userId);
      await getUsers(); // Refresh the user list
    } catch (error) {
      // Handle error silently
    }
  };

  const handleRejectFacilitator = async (userId: string) => {
    try {
      await UserAPIClient.rejectFacilitator(userId);
      await getUsers(); // Refresh the user list
    } catch (error) {
      // Handle error silently
    }
  };

  const addAction = (
    <>
      <Button
        size="small"
        onClick={handleCloseAddAdminSnackbar}
        sx={{
          color: theme.palette.Learner.Dark.Default,
        }}
      >
        CLOSE
      </Button>
    </>
  );
  const deleteAction = (
    <>
      <Button
        size="small"
        onClick={handleCloseDeleteUserSnackbar}
        sx={{
          color: theme.palette.Learner.Dark.Default,
        }}
      >
        UNDO
      </Button>
    </>
  );
  const AddUserSnackbar = () => {
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
            backgroundColor: theme.palette.Success.Light.Hover,
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
                  color: theme.palette.Success.Dark.Default,
                }}
              />
              <Typography
                variant="bodyMedium"
                sx={{
                  color: theme.palette.Success.Dark.Default,
                }}
              >
                {addSnackbarMessage}
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
            backgroundColor: theme.palette.Error.Light.Hover,
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
                  color: theme.palette.Error.Dark.Default,
                }}
              />
              <Typography
                variant="bodyMedium"
                sx={{
                  color: theme.palette.Error.Dark.Default,
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
      <AddUserSnackbar />
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
      <AddLearnerModal
        open={openAddLearnerModal}
        onClose={handleCloseAddLearnerModal}
        setFirstName={setLearnerFirstName}
        setLastName={setLearnerLastName}
        setEmail={setLearnerEmail}
        handleAddLearner={handleAddLearner}
      />
      <Stack direction="column" spacing={2} margin="2rem">
        <TopToolBar
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          filterLabel={selectedRole}
          handleRoleSelect={handleRoleSelect}
          handleOpenAddAdminModal={handleOpenAddAdminModal}
          handleOpenAddLearnerModal={handleOpenAddLearnerModal}
        />
        <UserTable
          filteredUsers={filteredUsers}
          usersPerPage={usersPerPage}
          page={page}
          emptyRows={emptyRows}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleOpenDeleteUserModal={handleOpenDeleteUserModal}
          handleApproveFacilitator={handleApproveFacilitator}
          handleRejectFacilitator={handleRejectFacilitator}
        />
      </Stack>
    </Box>
  );
};

export default ManageUserPage;
