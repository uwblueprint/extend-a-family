import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";

import UserAPIClient from "../../APIClients/UserAPIClient";
import { User } from "../../types/UserTypes";

import TopToolBar from "./TopToolBar";
import UserTable from "./UserTable";
import AddAdminModal from "./AddAdminModal";
import DeleteUserModal from "./DeleteUserModal";

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

  // States for admin modal inputs
  const [firstName, setFirstName] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [lastName, setLastName] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars

  const [selectedRole, setSelectedRole] = useState<string>("");

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

  const handleOpenDeleteUserModal = (userId: string) => {
    setDeleteUserId(userId);
    setOpenDeleteUserModal(true);
  };
  const handleCloseDeleteUserModal = () => setOpenDeleteUserModal(false);

  // TODO: Implement these actions as needed
  const handleDeleteUser = () => {
    // userId: string
  };
  const handleAddAdmin = async () => {};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "25px" }}>
      <DeleteUserModal
        open={openDeleteUserModal}
        onClose={handleCloseDeleteUserModal}
        deleteUserId={deleteUserId}
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
