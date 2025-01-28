import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
    passwordsMatch: false, // New criteria for matching passwords
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const validatePassword = (password: string) => {
    setPasswordCriteria((prev) => ({
      ...prev,
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    }));
  };

  useEffect(() => {
    validatePassword(newPassword);
  }, [newPassword]);

  useEffect(() => {
    // Check if passwords match and newPassword is not empty
    const passwordsMatch = newPassword === confirmPassword && newPassword.trim() !== "";
    setPasswordCriteria((prev) => ({
      ...prev,
      passwordsMatch,
    }));

    const isValid =
      passwordCriteria.minLength &&
      passwordCriteria.uppercase &&
      passwordCriteria.lowercase &&
      passwordCriteria.specialChar &&
      passwordsMatch;

    onValidationChange(isValid);
  }, [passwordCriteria, newPassword, confirmPassword, onValidationChange]);

  const passwordRequirements = [
    { text: "At least 8 characters", met: passwordCriteria.minLength },
    { text: "At least 1 uppercase letter", met: passwordCriteria.uppercase },
    { text: "At least 1 lowercase letter", met: passwordCriteria.lowercase },
    { text: "At least 1 special character (!, @, #, $, %, ^, &, or *)", met: passwordCriteria.specialChar },
    { text: "Passwords must match", met: passwordCriteria.passwordsMatch }, // New requirement
  ];

  return (
    <>
      <TextField
        label="New password"
        variant="outlined"
        type={showPassword ? "text" : "password"} // Toggle between text and password
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
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
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
        type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
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
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
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