import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";


const HelpModalPage = (): React.ReactElement => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("submit");
    handleClose();
  };

  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      Help Modal
      <Button onClick={handleClickOpen}>Help?</Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Help with Content</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What are you having trouble with?
          </DialogContentText>
          <textarea aria-label="help message" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HelpModalPage;
