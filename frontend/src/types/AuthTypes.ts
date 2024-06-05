export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Administrator" | "Facilitator" | "Learner";
  accessToken: string;
} | null;

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };
