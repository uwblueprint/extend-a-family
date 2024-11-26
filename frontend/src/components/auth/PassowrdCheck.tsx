import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

interface PasswordCheckProps {
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const PasswordCheck: React.FC<PasswordCheckProps> = ({
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  onValidationChange,
}) => {
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
  });

  const validatePassword = (password: string) => {
    setPasswordCriteria({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
  };

  useEffect(() => {
    validatePassword(newPassword);
  }, [newPassword]);

  useEffect(() => {
    const isValid =
      passwordCriteria.minLength &&
      passwordCriteria.uppercase &&
      passwordCriteria.lowercase &&
      passwordCriteria.specialChar &&
      newPassword === confirmPassword;

    onValidationChange(isValid);
  }, [passwordCriteria, newPassword, confirmPassword, onValidationChange]);

  const passwordRequirements = [
    { text: "At least 8 characters", met: passwordCriteria.minLength },
    { text: "At least 1 uppercase letter", met: passwordCriteria.uppercase },
    { text: "At least 1 lowercase letter", met: passwordCriteria.lowercase },
    { text: "At least 1 special character (!, @, #, $, %, ^, &, or *)", met: passwordCriteria.specialChar },
  ];

  return (
    <>
      <TextField
        label="New password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        placeholder="Your new password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        placeholder="Rewrite your new password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ marginTop: 2 }}>
        {passwordRequirements.map((requirement, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
