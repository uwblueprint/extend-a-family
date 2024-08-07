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
    const UNIT = "66a1b0f68eb236cce6df3184"; // wrong one
    const MODULE = "66a1b0f68eb236cce6df3184";
    const PAGE = "66a1b0f68eb236cce6df3184"; // also wrong one
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
