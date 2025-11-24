import { Role } from "./AuthTypes";

export type Status = "Invited" | "Active" | "PendingApproval";

export type BaseUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: Status;
  profilePicture?: string;
};

export type Bookmark = {
  id: string;
  title: string;
  type: string;
  unitId: string;
  moduleId: string;
  pageId: string;
};

export type Administrator = BaseUser;
export type Facilitator = BaseUser & {
  learners: string[];
  bio?: string;
  emailPrefrence: number;
};
export type Learner = BaseUser & { facilitator: Facilitator };

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

export function isRole(role: string): role is Role {
  return (
    role === "Administrator" || role === "Facilitator" || role === "Learner"
  );
}
