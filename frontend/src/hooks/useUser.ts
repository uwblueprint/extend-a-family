import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import {
  AuthenticatedAdministrator,
  AuthenticatedFacilitator,
  AuthenticatedLearner,
  AuthenticatedUser,
  isAuthenticatedAdministrator,
  isAuthenticatedFacilitator,
  isAuthenticatedLearner,
} from "../types/AuthTypes";

export function useUser(): AuthenticatedUser & {
  refreshUser: () => Promise<void>;
} {
  const { authenticatedUser, refreshUser } = useContext(AuthContext);
  if (!authenticatedUser) {
    throw new Error("Private route component accessed by unauthorized user");
  }
  return { ...authenticatedUser, refreshUser };
}

export function useAdministrator(): AuthenticatedAdministrator {
  const { authenticatedUser } = useContext(AuthContext);
  if (!authenticatedUser || !isAuthenticatedAdministrator(authenticatedUser)) {
    throw new Error("Administrator component accessed by unauthorized user");
  }
  return authenticatedUser;
}

export function useFacilitator(): AuthenticatedFacilitator {
  const { authenticatedUser } = useContext(AuthContext);
  if (!authenticatedUser || !isAuthenticatedFacilitator(authenticatedUser)) {
    throw new Error("Facilitator component accessed by unauthorized user");
  }
  return authenticatedUser;
}

export function useLearner(): AuthenticatedLearner {
  const { authenticatedUser } = useContext(AuthContext);
  if (!authenticatedUser || !isAuthenticatedLearner(authenticatedUser)) {
    throw new Error("Learner component accessed by unauthorized user");
  }
  return authenticatedUser;
}
