import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DisplayElementType,
  FontSize,
  FontWeight,
  isFontSize,
  isFontWeight,
  isTextAlign,
  isTextElementData,
  TextAlign,
} from "../../../../types/CourseElementTypes";
import { ActivityDataContext } from "../../../../contexts/ActivityDataContext";

interface TextDataFormProps {
  id: string;
}

const TextDataForm: React.FC<TextDataFormProps> = ({ id }) => {
  const { elements, setElements, setActiveElementId } =
    useContext(ActivityDataContext);
  const [text, setText] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<FontSize | null>(null);
  const [fontWeight, setFontWeight] = useState<FontWeight | null>(null);
  const [textAlign, setTextAlign] = useState<TextAlign | null>(null);

  useEffect(() => {
    const currentData = elements.get(id);
    if (currentData && isTextElementData(currentData)) {
      setText(currentData.text);
      setFontSize(currentData.fontSize);
      setFontWeight(currentData.fontWeight);
      setTextAlign(currentData.textAlign);
    }
  }, [elements, id]);

  const handleSubmit = () => {
    const updatedData = new Map(elements);
    const newData = {
      type: DisplayElementType.Text,
      text,
      fontSize,
      fontWeight,
      textAlign,
    };
    updatedData.set(id, newData);
    setElements(updatedData);
    setActiveElementId(null);
  };

  return (
    <Box
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      <Stack spacing="12px" paddingBottom="12px">
        <Typography variant="titleMedium">Text element</Typography>
        <Typography variant="bodyMedium">
          Customize the selected text element.
        </Typography>
      </Stack>
      <Stack spacing="12px" paddingBottom="12px">
        <Typography variant="labelLargeProminent">Content:</Typography>
        <TextField
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Stack>
      <Stack spacing="12px" paddingBottom="12px">
        <Typography variant="labelLargeProminent">Font size:</Typography>
        <RadioGroup
          value={fontSize}
          onChange={(e) =>
            isFontSize(e.target.value) && setFontSize(e.target.value)
          }
        >
          <FormControlLabel
            control={<Radio size="small" />}
            label="Small"
            value="Small"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            label="Medium"
            value="Medium"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            label="Large"
            value="Large"
          />
        </RadioGroup>
      </Stack>
      <Stack spacing="12px" paddingBottom="12px">
        <Typography variant="labelLargeProminent">Font weight:</Typography>
        <RadioGroup
          value={fontWeight}
          onChange={(e) =>
            isFontWeight(e.target.value) && setFontWeight(e.target.value)
          }
        >
          <FormControlLabel
            control={<Radio size="small" />}
            label="Normal"
            value="Normal"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            label="Bold"
            value="Bold"
          />
        </RadioGroup>
      </Stack>
      <Stack spacing="12px" paddingBottom="12px">
        <Typography variant="labelLargeProminent">Text alignment:</Typography>
        <RadioGroup
          value={textAlign}
          onChange={(e) =>
            isTextAlign(e.target.value) && setTextAlign(e.target.value)
          }
        >
          <FormControlLabel
            control={<Radio size="small" />}
            label="Left"
            value="Left"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            label="Center"
            value="Center"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            label="Right"
            value="Right"
          />
        </RadioGroup>
      </Stack>
      <Button variant="outlined" onClick={handleSubmit}>
        Done
      </Button>
    </Box>
  );
};

export default TextDataForm;
