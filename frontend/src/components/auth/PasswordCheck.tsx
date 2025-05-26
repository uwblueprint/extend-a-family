import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface PasswordCheckProps {
  newPassword: string;
  confirmPassword: string;
  passwordLabel: string;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const PasswordCheck: React.FC<PasswordCheckProps> = ({
  newPassword,
  confirmPassword,
  passwordLabel,
  setNewPassword,
  setConfirmPassword,
  onValidationChange,
}) => {
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    passwordsMatch: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string, confirmPwd: string) => {
    const passwordCheckCriteria = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      passwordsMatch: password === confirmPwd && password.trim() !== "",
    };

    setPasswordCriteria(passwordCheckCriteria);

    const isValid =
      passwordCheckCriteria.minLength &&
      passwordCheckCriteria.uppercase &&
      passwordCheckCriteria.lowercase &&
      passwordCheckCriteria.specialChar &&
      passwordCheckCriteria.passwordsMatch;

    onValidationChange(isValid);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newPwd = event.target.value;
    setNewPassword(newPwd);
    validatePassword(newPwd, confirmPassword);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const confirmPwd = event.target.value;
    setConfirmPassword(confirmPwd);
    validatePassword(newPassword, confirmPwd);
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: passwordCriteria.minLength },
    { text: "At least 1 uppercase letter", met: passwordCriteria.uppercase },
    { text: "At least 1 lowercase letter", met: passwordCriteria.lowercase },
    {
      text: "At least 1 special character (!, @, #, $, %, ^, &, or *)",
      met: passwordCriteria.specialChar,
    },
    {
      text: "Password and Confirm Password must be the same",
      met: passwordCriteria.passwordsMatch,
    },
  ];

  return (
    <>
      <TextField
        label={passwordLabel}
        variant="outlined"
        type={showPassword ? "text" : "password"}
        fullWidth
        placeholder={`Your ${passwordLabel.toLowerCase()}`}
        value={newPassword}
        onChange={handleNewPasswordChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm password"
        variant="outlined"
        type={showConfirmPassword ? "text" : "password"}
        fullWidth
        placeholder={`Rewrite your ${passwordLabel.toLowerCase()}`}
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box>
        {passwordRequirements.map((requirement, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {requirement.met ? (
              <CheckIcon sx={{ color: "green" }} />
            ) : (
              <CloseIcon sx={{ color: "red" }} />
            )}
            <Typography>{requirement.text}</Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default PasswordCheck;
