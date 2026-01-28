import { createContext } from "react";
import { AuthenticatedUser } from "../types/AuthTypes";

type AuthContextType = {
  authenticatedUser: AuthenticatedUser | null;
  setAuthenticatedUser: (_authenticatedUser: AuthenticatedUser | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  authenticatedUser: null,
  setAuthenticatedUser: (
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    _authenticatedUser: AuthenticatedUser | null,
  ): void => {},
  refreshUser: async (): Promise<void> => {},
});

export default AuthContext;
