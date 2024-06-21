import React, { useContext } from "react";
import MainPageButton from "../common/MainPageButton";
import AuthContext from "../../contexts/AuthContext";

const MyAccount = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>My Account</h1>
      <div>First Name: {authenticatedUser?.firstName}</div>
      <div>Last Name: {authenticatedUser?.lastName}</div>
      <div style={{ marginBottom: "1rem" }}>
        Email: {authenticatedUser?.email}
      </div>
      <MainPageButton />
    </div>
  );
};

export default MyAccount;
