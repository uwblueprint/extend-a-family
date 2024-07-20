export type Role = "Administrator" | "Facilitator" | "Learner";

export type BaseAuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  accessToken: string;
};

export type AuthenticatedAdministrator = BaseAuthenticatedUser;
export type AuthenticatedFacilitator = BaseAuthenticatedUser & {
  learners: string[];
};
export type AuthenticatedLearner = BaseAuthenticatedUser & {
  facilitator: string;
};

export type AuthenticatedUser =
  | AuthenticatedAdministrator
  | AuthenticatedFacilitator
  | AuthenticatedLearner
  | null;

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };

export function isAuthenticatedAdministrator(
  user: AuthenticatedUser,
): user is AuthenticatedAdministrator {
  return user?.role === "Administrator";
}

export function isAuthenticatedFacilitator(
  user: AuthenticatedUser,
): user is AuthenticatedFacilitator {
  return user?.role === "Facilitator";
}

export function isAuthenticatedLearner(
  user: AuthenticatedUser,
): user is AuthenticatedLearner {
  return user?.role === "Learner";
}
