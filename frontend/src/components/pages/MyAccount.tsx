import React from "react";
import MainPageButton from "../common/MainPageButton";
import {
  isAuthenticatedFacilitator,
  isAuthenticatedLearner,
} from "../../types/AuthTypes";
import { useUser } from "../../hooks/useUser";

const MyAccount = (): React.ReactElement => {
  const authenticatedUser = useUser();
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>My Account</h1>
      <div>First Name: {authenticatedUser.firstName}</div>
      <div>Last Name: {authenticatedUser.lastName}</div>
      <div style={{ marginBottom: "1rem" }}>
        Email: {authenticatedUser.email}
      </div>
      {isAuthenticatedFacilitator(authenticatedUser) && (
        <div>Learners : {authenticatedUser.learners}</div>
      )}
      {isAuthenticatedLearner(authenticatedUser) && (
        <div>Facilitator : {authenticatedUser.facilitator}</div>
      )}
      <MainPageButton />
    </div>
  );
};

export default MyAccount;
