import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useLearner } from "../../hooks/useUser";
import helpRequestAPIClient from "../../APIClients/HelpRequestAPIClient";

const MakeHelpRequestPage = (): React.ReactElement => {
  const learner = useLearner();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    // hardocde, dont actually do this
    // this assumes ur connected to carolyn_dev btw
    const UNIT = "66b55d6f827f79dd57710ad9"; // wrong one
    const MODULE = "66b55d15e2c9ce72d4b65a6f";
    const PAGE = "66b55a37f55a2e9e071d8363"; // also wrong one
    await helpRequestAPIClient.createHelpRequest(
      text,
      learner.id,
      learner.facilitator,
      UNIT,
      MODULE,
      PAGE,
    );
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
          <textarea
            aria-label="help message"
            onChange={(e) => setText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MakeHelpRequestPage;
