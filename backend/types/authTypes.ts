import { UserDTO } from "./userTypes";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type AuthDTO = Token & UserDTO;

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
};

export type SignupMethod = "PASSWORD" | "GOOGLE";
