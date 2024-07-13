import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';


const HelpModalPage = (): React.ReactElement => {
  const [open, setOpen] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("submit")
    handleClose();
  }

  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      Help Modal
      <Button onClick={handleClickOpen}>
        Help?
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Help with Content</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What are you having trouble with?
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <TextareaAutosize aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HelpModalPage;
