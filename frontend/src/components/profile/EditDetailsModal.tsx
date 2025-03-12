import React, { useState } from "react";
import {
  Dialog,
  IconButton,
  Typography,
  Button,
  TextField,
  useTheme,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../hooks/useUser";

interface EditDetailsModalProps {
  open: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  onSave: (firstName: string, lastName: string) => void;
}

const EditDetailsModal: React.FC<EditDetailsModalProps> = ({
  open,
  onClose,
  firstName,
  lastName,
  onSave,
}) => {
  const theme = useTheme();
  const [editedFirstName, setEditedFirstName] = useState(firstName);
  const [editedLastName, setEditedLastName] = useState(lastName);
  const user = useUser();

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setEditedFirstName(firstName);
      setEditedLastName(lastName);
    }
  }, [open, firstName, lastName]);

  const handleSave = () => {
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      return; // Add error handling if needed
    }
    onSave(editedFirstName, editedLastName);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-details-modal-title"
      PaperProps={{
        sx: {
          display: "flex",
          width: "500px",
          padding: theme.spacing(4),
          flexDirection: "column",
          gap: theme.spacing(3),
          borderRadius: "8px",
          backgroundColor: theme.palette.Neutral[100],
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "32px",
        }}
      >
        <Typography
          variant="headlineMedium"
          sx={{
            color: theme.palette.Neutral[700],
          }}
        >
          Edit Details
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `1px solid ${theme.palette.Neutral[500]}`,
            color: theme.palette.Neutral[700],
            "&:hover": {
              backgroundColor: theme.palette.Neutral[200],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          alignSelf: "stretch",
        }}
      >
        <TextField
          label="First Name"
          value={editedFirstName}
          onChange={(e) => setEditedFirstName(e.target.value)}
          fullWidth
          InputLabelProps={{
            sx: theme.typography.bodySmall,
          }}
          InputProps={{
            sx: theme.typography.bodyMedium,
          }}
        />

        <TextField
          label="Last Name"
          value={editedLastName}
          onChange={(e) => setEditedLastName(e.target.value)}
          fullWidth
          InputLabelProps={{
            sx: theme.typography.bodySmall,
          }}
          InputProps={{
            sx: theme.typography.bodyMedium,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
          marginTop: "16px",
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            display: "flex",
            height: "40px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "4px",
            border: `1px solid ${theme.palette.Neutral[500]}`,
            "&:hover": {
              backgroundColor: theme.palette.Neutral[200],
            },
          }}
        >
          <Typography
            variant="labelLarge"
            sx={{
              color: theme.palette[user.role].Default,
            }}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            display: "flex",
            height: "40px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "4px",
            backgroundColor: theme.palette[user.role].Default,
            "&:hover": {
              background: theme.palette[user.role].Pressed,
            },
            padding: "10px 24px",
          }}
        >
          <Typography
            variant="labelLarge"
            sx={{
              color: theme.palette.Neutral[100],
            }}
          >
            Save Details
          </Typography>
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditDetailsModal;
