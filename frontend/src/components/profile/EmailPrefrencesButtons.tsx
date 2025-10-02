import { Typography, Button, useTheme } from "@mui/material";
import { RadioButtonUnchecked, RadioButtonChecked } from "@mui/icons-material";
import React from "react";

interface EmailPrefrencesButtonProps {
  selectedId: number;
  buttonId: number;
  text: string;
  setPrefrence: (id: number) => void;
}

const EmailPrefrencesButton: React.FC<EmailPrefrencesButtonProps> = ({
  setPrefrence,
  selectedId,
  buttonId,
  text,
}) => {
  const theme = useTheme();
  function emailOptionSelecttor() {
    if (selectedId === buttonId) {
      return {
        backgroud: theme.palette.Facilitator.Light,
        border: theme.palette.Facilitator.Default,
      };
    }
    return {
      backgroud: theme.palette.Neutral[100],
      border: theme.palette.Neutral[600],
    };
  }

  return (
    <Button
      onClick={() => setPrefrence(buttonId)}
      sx={{
        width: "100%",
        height: "50px",
        border: `1.5px solid ${emailOptionSelecttor().border}`,
        justifyContent: "left",
        paddingLeft: "20px",
        backgroundColor: `${emailOptionSelecttor().backgroud}`,
      }}
    >
      {selectedId === buttonId ? (
        <RadioButtonChecked
          sx={{
            paddingRight: "10px",
            height: "30px",
            width: "30px",
            color: theme.palette.Neutral[500],
          }}
        />
      ) : (
        <RadioButtonUnchecked
          sx={{
            paddingRight: "10px",
            height: "30px",
            width: "30px",
            color: theme.palette.Neutral[500],
          }}
        />
      )}
      <Typography
        variant="bodySmall"
        sx={{ color: theme.palette.Neutral[500] }}
      >
        {text}
      </Typography>
    </Button>
  );
};

export default EmailPrefrencesButton;
