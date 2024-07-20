import { Role } from "./AuthTypes";

export type BaseUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type Administrator = BaseUser;
export type Facilitator = BaseUser & { learners: string[] };
export type Learner = BaseUser & { facilitator: string };

export type User = Administrator | Facilitator | Learner;

export function isAdministrator(user: User): user is Administrator {
  return user.role === "Administrator";
}

export function isFacilitator(user: User): user is Facilitator {
  return user.role === "Facilitator";
}

export function isLearner(user: User): user is Learner {
  return user.role === "Learner";
}
