import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import MainPageButton from "../common/MainPageButton";
import AuthContext from "../../contexts/AuthContext";
import {
  isAuthenticatedFacilitator,
  isAuthenticatedLearner,
} from "../../types/AuthTypes";
import { WELCOME_PAGE } from "../../constants/Routes";

const MyAccount = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  if (!authenticatedUser) {
    return <Redirect to={WELCOME_PAGE} />;
  }
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
