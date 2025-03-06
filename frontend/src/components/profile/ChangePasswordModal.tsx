import React, { useState } from "react";
import {
    Dialog,
    IconButton,
    Typography,
    Button,
    useTheme,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../hooks/useUser";
import PasswordCheck from "../auth/PasswordCheck";

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    open,
    onClose,
    onSave,
}) => {
    const theme = useTheme();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    const handleSave = () => {
        if (!isFormValid) {
            alert("Please ensure the passwords match and meet the requirements.");
            return;
        }
        onSave(newPassword);
        onClose();
    };

    const user = useUser();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="change-password-modal-title"
            PaperProps={{
                sx: {
                    display: "flex",
                    width: "500px",
                    padding: theme.spacing(4),
                    flexDirection: "column",
                    gap: theme.spacing(3),
                    borderRadius: "8px",
                    backgroundColor: theme.palette.Neutral[100],
                    position: "relative",
                },
            }}
        >
            <Box
                sx={{
                    alignItems: "center",
                    gap: "32px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "32px",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.Neutral[700],
                        }}
                    >
                        Edit Password
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: `1px solid ${theme.palette.Neutral[500]}`,
                            color: "black",
                            "&:hover": {
                                backgroundColor: theme.palette.Neutral[200],
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <PasswordCheck
                    newPassword={newPassword}
                    confirmPassword={confirmPassword}
                    setNewPassword={setNewPassword}
                    setConfirmPassword={setConfirmPassword}
                    onValidationChange={setIsFormValid}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        gap: "12px",
                        paddingTop: "32px",
                        alignSelf: "stretch",
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            display: "flex",
                            height: "40px",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            borderRadius: "4px",
                            border: "1px solid var(--M3-sys-light-outline, #6F797B)",
                            "&:hover": {
                                backgroundColor: theme.palette.Neutral[200],
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: "300",
                                lineHeight: "120%",
                                letterSpacing: "0.7px",
                                color: theme.palette[`${user.role}`].Default,
                            }}
                        >
                            Cancel
                        </Typography>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!isFormValid}
                        sx={{
                            display: "flex",
                            height: "40px",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            alignSelf: "stretch",
                            borderRadius: "4px",
                            backgroundColor: isFormValid
                                ? theme.palette[`${user.role}`].Default
                                : "#ccc",
                            "&:hover": {
                                background: isFormValid
                                    ? theme.palette[`${user.role}`].Pressed
                                    : "#ccc",
                            },
                            padding: "10px 24px",
                            "&.Mui-disabled": {
                                backgroundColor: "#ccc",
                                color: "#666",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: "300",
                                lineHeight: "120%",
                                letterSpacing: "0.7px",
                                color: isFormValid ? theme.palette.Neutral[100] : "#666",
                            }}
                        >
                            Save Password
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ChangePasswordModal;