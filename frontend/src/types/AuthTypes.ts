export type Role = "Administrator" | "Facilitator" | "Learner";

export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  accessToken: string;
};

export type AuthenticatedAdministrator = AuthenticatedUser;
export type AuthenticatedFacilitator = AuthenticatedUser & {
  learners: string[];
};
export type AuthenticatedLearner = AuthenticatedUser & {
  facilitator: string;
};

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };

export function isAuthenticatedAdministrator(
  user: AuthenticatedUser,
): user is AuthenticatedAdministrator {
  return user.role === "Administrator";
}

export function isAuthenticatedFacilitator(
  user: AuthenticatedUser,
): user is AuthenticatedFacilitator {
  return user.role === "Facilitator";
}

export function isAuthenticatedLearner(
  user: AuthenticatedUser,
): user is AuthenticatedLearner {
  return user.role === "Learner";
}
