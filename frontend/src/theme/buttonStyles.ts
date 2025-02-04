import palette from "./palette";
import { Role } from "../types/AuthTypes";

const roles: Role[] = ["Administrator", "Facilitator", "Learner"];

const containedStyles = {};
roles.forEach((role: Role) => {
  Object.assign(containedStyles, {
    [`&.MuiButton-contained${role}`]: {
      color: palette.Neutral[100],
      backgroundColor: palette[role].Default,
      "&:hover": {
        backgroundColor: palette[role].Default,
      },
    },
  });
});

const buttonStyles = {
  contained: containedStyles,
};

export default buttonStyles;
